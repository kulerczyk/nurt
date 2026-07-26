import { randomInt } from "crypto";
import { prisma } from "@/lib/db";
import type { Voucher as VoucherRow, VoucherStatus } from "@/generated/prisma/client";

export interface Voucher {
  id: string;
  code: string;
  orderId: string;
  valueCents: number;
  status: VoucherStatus;
  recipientName: string | null;
  message: string | null;
  expiresAt: Date | null;
  redeemedAt: Date | null;
  redeemedBookingId: string | null;
  createdAt: Date;
}

function toVoucher(row: VoucherRow): Voucher {
  return {
    id: row.id,
    code: row.code,
    orderId: row.orderId,
    valueCents: row.valueCents,
    status: row.status,
    recipientName: row.recipientName,
    message: row.message,
    expiresAt: row.expiresAt,
    redeemedAt: row.redeemedAt,
    redeemedBookingId: row.redeemedBookingId,
    createdAt: row.createdAt,
  };
}

const CODE_ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // bez znaków mylących się (0/O, 1/I)

function randomSegment(length: number): string {
  let out = "";
  for (let i = 0; i < length; i++) {
    out += CODE_ALPHABET[randomInt(CODE_ALPHABET.length)];
  }
  return out;
}

async function generateUniqueVoucherCode(): Promise<string> {
  for (let attempt = 0; attempt < 10; attempt++) {
    const code = `NURT-${randomSegment(4)}-${randomSegment(4)}`;
    const existing = await prisma.voucher.findUnique({ where: { code }, select: { id: true } });
    if (!existing) return code;
  }
  throw new Error("Nie udało się wygenerować unikalnego kodu vouchera.");
}

export async function createVoucherForOrderItem(params: {
  orderId: string;
  valueCents: number;
  validDays: number | null;
  recipientName?: string | null;
  message?: string | null;
}): Promise<Voucher> {
  const code = await generateUniqueVoucherCode();
  const expiresAt = params.validDays
    ? new Date(Date.now() + params.validDays * 24 * 60 * 60 * 1000)
    : null;

  const row = await prisma.voucher.create({
    data: {
      code,
      orderId: params.orderId,
      valueCents: params.valueCents,
      expiresAt,
      recipientName: params.recipientName ?? null,
      message: params.message ?? null,
    },
  });
  return toVoucher(row);
}

export async function getVoucherByCode(code: string): Promise<Voucher | undefined> {
  const row = await prisma.voucher.findUnique({ where: { code: code.trim().toUpperCase() } });
  return row ? toVoucher(row) : undefined;
}

export async function getVouchersForOrder(orderId: string): Promise<Voucher[]> {
  const rows = await prisma.voucher.findMany({ where: { orderId }, orderBy: { createdAt: "asc" } });
  return rows.map(toVoucher);
}

export async function getAllVouchersForAdmin(): Promise<Voucher[]> {
  const rows = await prisma.voucher.findMany({ orderBy: { createdAt: "desc" } });
  return rows.map(toVoucher);
}

export type VoucherRedemptionResult =
  | { ok: true; voucher: Voucher }
  | { ok: false; reason: "not_found" | "already_redeemed" | "expired" | "cancelled" };

// Sprawdza i realizuje voucher w ramach tej samej transakcji, w której
// tworzona jest rezerwacja (patrz src/lib/bookings.ts) — zapobiega
// wielokrotnemu wykorzystaniu tego samego kodu przy równoległych żądaniach.
export async function redeemVoucherInTransaction(
  tx: Parameters<Parameters<typeof prisma.$transaction>[0]>[0],
  code: string,
  bookingId: string
): Promise<VoucherRedemptionResult> {
  const normalized = code.trim().toUpperCase();
  const voucher = await tx.voucher.findUnique({ where: { code: normalized } });
  if (!voucher) return { ok: false, reason: "not_found" };
  if (voucher.status === "CANCELLED") return { ok: false, reason: "cancelled" };
  if (voucher.status === "REDEEMED") return { ok: false, reason: "already_redeemed" };
  if (voucher.expiresAt && voucher.expiresAt.getTime() < Date.now()) {
    return { ok: false, reason: "expired" };
  }

  // updateMany z warunkiem status:"ACTIVE" w WHERE robi atomowy "redeem-if-active" —
  // przy dwóch równoczesnych próbach użycia tego samego kodu tylko jedna zwróci count=1,
  // bo Postgres serializuje UPDATE-y na tym samym wierszu przez blokadę wiersza.
  const result = await tx.voucher.updateMany({
    where: { id: voucher.id, status: "ACTIVE" },
    data: { status: "REDEEMED", redeemedAt: new Date(), redeemedBookingId: bookingId },
  });
  if (result.count === 0) return { ok: false, reason: "already_redeemed" };

  const updated = await tx.voucher.findUniqueOrThrow({ where: { id: voucher.id } });
  return { ok: true, voucher: toVoucher(updated) };
}

export async function cancelVoucher(id: string): Promise<void> {
  await prisma.voucher.update({ where: { id }, data: { status: "CANCELLED" } });
}
