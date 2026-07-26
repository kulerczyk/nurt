import { verifyP24NotificationSignature, verifyP24Transaction, type P24NotificationPayload } from "@/lib/przelewy24";
import { markOrderPaid } from "@/lib/orders";
import { sendOrderPaidEmails } from "@/lib/email";

// Endpoint wywoływany asynchronicznie przez serwery Przelewy24 (urlStatus) -
// NIE przez przeglądarkę klienta. Musi być publicznie dostępny (bez auth admina)
// i odpowiadać szybko z kodem 200, inaczej P24 uzna dostawę za nieudaną i będzie ponawiać.
export async function POST(request: Request) {
  let payload: P24NotificationPayload;
  try {
    payload = await request.json();
  } catch {
    return new Response("Invalid JSON", { status: 400 });
  }

  if (!verifyP24NotificationSignature(payload)) {
    console.error("[p24-webhook] Nieprawidłowy podpis powiadomienia - odrzucam.");
    return new Response("Invalid signature", { status: 400 });
  }

  try {
    const verified = await verifyP24Transaction({
      sessionId: payload.sessionId,
      orderId: payload.orderId,
      amountCents: payload.amount,
      currency: payload.currency,
    });

    if (!verified) {
      console.error(`[p24-webhook] Weryfikacja transakcji P24 nie powiodła się (sesja ${payload.sessionId}).`);
      return new Response("Verification failed", { status: 400 });
    }

    const result = await markOrderPaid(payload.sessionId, String(payload.orderId));
    if (!result.alreadyProcessed) {
      await sendOrderPaidEmails({
        customerName: result.order.customerName,
        customerEmail: result.order.customerEmail,
        deliveryMethod: result.order.deliveryMethod,
        shippingAddress: result.order.shippingAddress,
        totalCents: result.order.totalCents,
        items: result.order.items,
        vouchers: result.generatedVouchers,
      });
    }
  } catch (error) {
    console.error("[p24-webhook] Błąd przetwarzania powiadomienia:", error);
    return new Response("Internal error", { status: 500 });
  }

  return new Response("OK", { status: 200 });
}
