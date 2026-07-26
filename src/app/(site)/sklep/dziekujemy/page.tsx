import Link from "next/link";
import { getOrderById } from "@/lib/orders";
import { getVouchersForOrder } from "@/lib/vouchers";
import ClearCartOnMount from "@/components/shop/ClearCartOnMount";

interface Props {
  searchParams: Promise<{ order?: string; status?: string }>;
}

function formatPln(cents: number): string {
  return `${(cents / 100).toFixed(2).replace(".", ",")} zł`;
}

export default async function ThankYouPage({ searchParams }: Props) {
  const { order: orderId, status: statusParam } = await searchParams;
  const order = orderId ? await getOrderById(orderId) : null;
  const vouchers = order && order.status === "PAID" ? await getVouchersForOrder(order.id) : [];

  let heading = "Dziękujemy za zamówienie";
  let message =
    "Nie znaleźliśmy szczegółów tego zamówienia, ale jeśli płatność została pobrana, napisz do nas - sprawdzimy to ręcznie.";

  if (order) {
    if (statusParam === "pending") {
      heading = "Zamówienie przyjęte";
      message =
        "Płatności online w sklepie są jeszcze w trakcie uruchamiania - skontaktujemy się z Tobą e-mailem, żeby dokończyć płatność.";
    } else if (order.status === "PAID" || order.status === "FULFILLED") {
      heading = "Płatność potwierdzona";
      message = "Dziękujemy! Potwierdzenie i szczegóły wysłaliśmy na Twój adres e-mail.";
    } else if (order.status === "PENDING") {
      heading = "Przetwarzamy Twoją płatność";
      message = "Jeśli płatność się powiodła, potwierdzenie dotrze do Ciebie e-mailem za chwilę.";
    } else {
      heading = "Płatność nie powiodła się";
      message = "Coś poszło nie tak przy płatności. Spróbuj ponownie albo skontaktuj się z nami.";
    }
  }

  return (
    <div className="pt-28 pb-24">
      <ClearCartOnMount />
      <div className="max-w-xl mx-auto px-6 text-center">
        <div
          className="mx-auto mb-6 w-16 h-16 flex items-center justify-center bg-heather-100 text-heather-700"
          style={{ borderRadius: "62% 38% 54% 46% / 44% 58% 42% 56%" }}
        >
          <span className="text-3xl">✓</span>
        </div>
        <span className="section-label block mb-2">Sklep</span>
        <h1 className="font-serif text-4xl font-semibold text-stone-900 mb-4">{heading}</h1>
        <p className="text-stone-500 leading-relaxed mb-10">{message}</p>

        {order && (
          <div className="bg-white rounded-3xl border border-heather-100 p-6 text-left mb-10">
            <p className="text-sm text-stone-500 mb-3">Numer zamówienia: <span className="font-mono text-stone-700">{order.id}</span></p>
            <div className="space-y-1.5 text-sm">
              {order.items.map((item) => (
                <div key={item.id} className="flex justify-between">
                  <span className="text-stone-600">{item.quantity} × {item.nameSnapshot}</span>
                  <span className="text-stone-500">{formatPln(item.unitPriceCents * item.quantity)}</span>
                </div>
              ))}
            </div>
            <div className="flex justify-between pt-3 mt-2 border-t border-heather-100 font-medium text-stone-800">
              <span>Razem</span>
              <span>{formatPln(order.totalCents)}</span>
            </div>

            {vouchers.length > 0 && (
              <div className="mt-4 pt-4 border-t border-heather-100">
                <p className="text-xs font-medium text-stone-500 uppercase tracking-wide mb-2">Twoje kody voucherów</p>
                {vouchers.map((v) => (
                  <p key={v.id} className="font-mono text-sm text-heather-700">{v.code}</p>
                ))}
              </div>
            )}
          </div>
        )}

        <Link href="/sklep" className="blob-btn inline-flex">Wróć do sklepu</Link>
      </div>
    </div>
  );
}
