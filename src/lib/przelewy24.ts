import { createHash } from "crypto";

// Integracja z Przelewy24 REST API v1 (https://developers.przelewy24.pl/).
// Flow: register -> redirect klienta na paymentUrl -> P24 wysyła webhook (notification)
// na urlStatus -> weryfikujemy podpis -> wywołujemy verify, żeby rozliczyć środki.
//
// Wymagane zmienne środowiskowe (dostarczane przez klienta z panelu P24):
//   P24_MERCHANT_ID, P24_POS_ID (zwykle = merchantId), P24_API_KEY, P24_CRC_KEY,
//   P24_SANDBOX ("true"/"false", domyślnie true dopóki nie ustawione na "false").
// Dopóki nie są skonfigurowane, isP24Configured() zwraca false i checkout
// pokazuje komunikat zamiast próby połączenia z P24.

interface P24Env {
  merchantId: number;
  posId: number;
  apiKey: string;
  crcKey: string;
  sandbox: boolean;
}

function getP24Env(): P24Env | null {
  const merchantId = process.env.P24_MERCHANT_ID;
  const apiKey = process.env.P24_API_KEY;
  const crcKey = process.env.P24_CRC_KEY;
  if (!merchantId || !apiKey || !crcKey) return null;

  return {
    merchantId: Number(merchantId),
    posId: Number(process.env.P24_POS_ID || merchantId),
    apiKey,
    crcKey,
    sandbox: process.env.P24_SANDBOX !== "false",
  };
}

export function isP24Configured(): boolean {
  return getP24Env() !== null;
}

function baseUrl(sandbox: boolean): string {
  return sandbox ? "https://sandbox.przelewy24.pl" : "https://secure.przelewy24.pl";
}

// P24 liczy podpis SHA-384 z JSON-a o ściśle określonej kolejności pól —
// dlatego literały obiektów poniżej mają pola wpisane w dokładnie tej kolejności.
function sign(payload: Record<string, unknown>): string {
  return createHash("sha384").update(JSON.stringify(payload)).digest("hex");
}

function authHeader(env: P24Env): string {
  return "Basic " + Buffer.from(`${env.posId}:${env.apiKey}`).toString("base64");
}

export interface P24RegisterInput {
  sessionId: string;
  amountCents: number;
  currency?: string;
  description: string;
  email: string;
  urlReturn: string;
  urlStatus: string;
}

export interface P24RegisterResult {
  token: string;
  paymentUrl: string;
}

export async function registerP24Transaction(
  input: P24RegisterInput
): Promise<P24RegisterResult> {
  const env = getP24Env();
  if (!env) throw new Error("P24_NOT_CONFIGURED");

  const currency = input.currency ?? "PLN";
  const signature = sign({
    sessionId: input.sessionId,
    merchantId: env.merchantId,
    amount: input.amountCents,
    currency,
    crc: env.crcKey,
  });

  const res = await fetch(`${baseUrl(env.sandbox)}/api/v1/transaction/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: authHeader(env) },
    body: JSON.stringify({
      merchantId: env.merchantId,
      posId: env.posId,
      sessionId: input.sessionId,
      amount: input.amountCents,
      currency,
      description: input.description,
      email: input.email,
      country: "PL",
      language: "pl",
      urlReturn: input.urlReturn,
      urlStatus: input.urlStatus,
      sign: signature,
    }),
  });

  const json = await res.json().catch(() => null);
  if (!res.ok || !json || json.responseCode !== 0 || !json.data?.token) {
    throw new Error(`Rejestracja transakcji P24 nie powiodła się: ${JSON.stringify(json)}`);
  }

  const token = json.data.token as string;
  return { token, paymentUrl: `${baseUrl(env.sandbox)}/trnRequest/${token}` };
}

export interface P24NotificationPayload {
  merchantId: number;
  posId: number;
  sessionId: string;
  amount: number;
  originAmount: number;
  currency: string;
  orderId: number;
  methodId: number;
  statement: string;
  sign: string;
}

// Zawsze weryfikuj podpis PRZED zaufaniem jakimkolwiek polom z webhooka —
// to jedyny sposób odróżnienia prawdziwego powiadomienia P24 od sfałszowanego.
export function verifyP24NotificationSignature(payload: P24NotificationPayload): boolean {
  const env = getP24Env();
  if (!env) return false;

  const expected = sign({
    merchantId: payload.merchantId,
    posId: payload.posId,
    sessionId: payload.sessionId,
    amount: payload.amount,
    originAmount: payload.originAmount,
    currency: payload.currency,
    orderId: payload.orderId,
    methodId: payload.methodId,
    statement: payload.statement,
    crc: env.crcKey,
  });
  return expected === payload.sign;
}

export async function verifyP24Transaction(params: {
  sessionId: string;
  orderId: number;
  amountCents: number;
  currency?: string;
}): Promise<boolean> {
  const env = getP24Env();
  if (!env) throw new Error("P24_NOT_CONFIGURED");

  const currency = params.currency ?? "PLN";
  const signature = sign({
    sessionId: params.sessionId,
    orderId: params.orderId,
    amount: params.amountCents,
    currency,
    crc: env.crcKey,
  });

  const res = await fetch(`${baseUrl(env.sandbox)}/api/v1/transaction/verify`, {
    method: "PUT",
    headers: { "Content-Type": "application/json", Authorization: authHeader(env) },
    body: JSON.stringify({
      merchantId: env.merchantId,
      posId: env.posId,
      sessionId: params.sessionId,
      amount: params.amountCents,
      currency,
      orderId: params.orderId,
      sign: signature,
    }),
  });

  const json = await res.json().catch(() => null);
  return Boolean(res.ok && json && json.responseCode === 0 && json.data?.status === "success");
}
