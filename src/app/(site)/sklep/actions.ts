"use server";

import { redirect } from "next/navigation";
import { checkoutSchema } from "@/lib/schemas/checkout";
import { createPendingOrder, setOrderP24Session } from "@/lib/orders";
import { registerP24Transaction, isP24Configured } from "@/lib/przelewy24";
import { getSiteUrl } from "@/lib/site-url";

export type CheckoutFormState = { success: false; error: string } | undefined;

const reasonMessages: Record<string, string> = {
  EMPTY_CART: "Koszyk jest pusty.",
  PRODUCT_NOT_FOUND: "Jeden z produktów w koszyku już nie istnieje. Odśwież koszyk i spróbuj ponownie.",
  PRODUCT_INACTIVE: "Jeden z produktów nie jest już dostępny.",
  OUT_OF_STOCK: "Niestety, zabrakło jednego z produktów w wybranej ilości.",
};

export async function createCheckoutAction(
  _prev: CheckoutFormState,
  formData: FormData
): Promise<CheckoutFormState> {
  let items: unknown;
  try {
    items = JSON.parse(String(formData.get("itemsJson") ?? "[]"));
  } catch {
    items = [];
  }

  const parsed = checkoutSchema.safeParse({
    customerName: formData.get("customerName"),
    customerEmail: formData.get("customerEmail"),
    customerPhone: formData.get("customerPhone"),
    deliveryMethod: formData.get("deliveryMethod"),
    shippingAddress: formData.get("shippingAddress"),
    notes: formData.get("notes"),
    voucherRecipientName: formData.get("voucherRecipientName"),
    voucherMessage: formData.get("voucherMessage"),
    items,
  });

  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "Sprawdź poprawność formularza." };
  }

  const data = parsed.data;

  const orderResult = await createPendingOrder({
    customerName: data.customerName,
    customerEmail: data.customerEmail,
    customerPhone: data.customerPhone || undefined,
    deliveryMethod: data.deliveryMethod,
    shippingAddress: data.shippingAddress || undefined,
    notes: data.notes || undefined,
    voucherRecipientName: data.voucherRecipientName || undefined,
    voucherMessage: data.voucherMessage || undefined,
    items: data.items,
  });

  if (!orderResult.ok) {
    const base = reasonMessages[orderResult.reason] ?? "Nie udało się złożyć zamówienia.";
    const message = orderResult.productName ? `${base} (${orderResult.productName})` : base;
    return { success: false, error: message };
  }

  const { order } = orderResult;

  if (!isP24Configured()) {
    // Płatności online nie są jeszcze skonfigurowane - zamówienie zostaje zapisane
    // jako oczekujące, a klient trafia na stronę z informacją, że skontaktujemy się
    // w sprawie płatności. Admin widzi je w /admin/zamowienia i może oznaczyć jako
    // opłacone ręcznie po otrzymaniu przelewu bezpośredniego.
    redirect(`/sklep/dziekujemy?order=${order.id}&status=pending`);
  }

  const siteUrl = getSiteUrl();

  let paymentUrl: string;
  try {
    const registered = await registerP24Transaction({
      sessionId: order.id,
      amountCents: order.totalCents,
      description: `Zamówienie NURT #${order.id.slice(-8)}`,
      email: order.customerEmail,
      urlReturn: `${siteUrl}/sklep/dziekujemy?order=${order.id}`,
      urlStatus: `${siteUrl}/api/p24/webhook`,
    });
    await setOrderP24Session(order.id, order.id);
    paymentUrl = registered.paymentUrl;
  } catch (error) {
    console.error("[sklep] Błąd rejestracji transakcji P24:", error);
    return {
      success: false,
      error: "Nie udało się przekierować do płatności. Spróbuj ponownie za chwilę albo skontaktuj się z nami.",
    };
  }

  // redirect() musi być wywołane poza try/catch - rzuca specjalny wyjątek
  // sterujący nawigacją, który catch powyżej mógłby błędnie przechwycić.
  redirect(paymentUrl);
}
