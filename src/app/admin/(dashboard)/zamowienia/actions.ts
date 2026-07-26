"use server";

import { revalidatePath } from "next/cache";
import { markOrderPaid, setOrderStatus } from "@/lib/orders";
import { sendOrderPaidEmails } from "@/lib/email";
import { cancelVoucher } from "@/lib/vouchers";
import { prisma } from "@/lib/db";

type ActionResult = { success: true } | { success: false; error: string };

function revalidateOrderPages() {
  revalidatePath("/admin/zamowienia");
  revalidatePath("/sklep");
}

// Ręczne oznaczenie jako opłacone — np. gdy klient zapłacił przelewem bezpośrednim
// zamiast przez P24. Korzysta z tego samego, idempotentnego markOrderPaid(), więc
// vouchery i stan magazynowy są obsłużone identycznie jak przy prawdziwej płatności.
export async function markOrderPaidManuallyAction(id: string): Promise<ActionResult> {
  try {
    const result = await markOrderPaid(id, `MANUAL-${Date.now()}`);
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
    console.error("[admin/zamowienia] Błąd ręcznego oznaczania jako opłacone:", error);
    return { success: false, error: "Nie udało się oznaczyć zamówienia jako opłacone." };
  }

  revalidateOrderPages();
  return { success: true };
}

export async function markOrderFulfilledAction(id: string): Promise<ActionResult> {
  try {
    await setOrderStatus(id, "FULFILLED");
  } catch (error) {
    console.error("[admin/zamowienia] Błąd oznaczania jako zrealizowane:", error);
    return { success: false, error: "Nie udało się zaktualizować statusu." };
  }
  revalidateOrderPages();
  return { success: true };
}

export async function cancelOrderAction(id: string): Promise<ActionResult> {
  try {
    await prisma.$transaction(async (tx) => {
      await tx.order.update({ where: { id }, data: { status: "CANCELLED" } });
      await tx.voucher.updateMany({
        where: { orderId: id, status: "ACTIVE" },
        data: { status: "CANCELLED" },
      });
    });
  } catch (error) {
    console.error("[admin/zamowienia] Błąd anulowania zamówienia:", error);
    return { success: false, error: "Nie udało się anulować zamówienia." };
  }
  revalidateOrderPages();
  return { success: true };
}

export async function cancelVoucherAction(id: string): Promise<ActionResult> {
  try {
    await cancelVoucher(id);
  } catch (error) {
    console.error("[admin/zamowienia] Błąd anulowania vouchera:", error);
    return { success: false, error: "Nie udało się anulować vouchera." };
  }
  revalidateOrderPages();
  return { success: true };
}
