"use client";

import { useActionState, useMemo, useState } from "react";
import Link from "next/link";
import { useCart } from "@/components/shop/CartProvider";
import { createCheckoutAction, type CheckoutFormState } from "@/app/(site)/sklep/actions";
import { FLAT_SHIPPING_CENTS } from "@/lib/shop-constants";

const inputClasses =
  "w-full px-4 py-2.5 rounded-2xl border border-heather-200 text-sm bg-white " +
  "focus:outline-none focus:ring-2 focus:ring-heather-400 focus:border-heather-400 transition-all duration-300";
const labelClasses = "block text-sm font-medium text-stone-600 mb-1.5";
const cardClasses = "bg-white rounded-3xl border border-heather-100 p-6 space-y-4";

function formatPln(cents: number): string {
  return `${(cents / 100).toFixed(2).replace(".", ",")} zł`;
}

export default function CheckoutPage() {
  const { items, subtotalCents } = useCart();
  const [state, formAction, pending] = useActionState<CheckoutFormState, FormData>(createCheckoutAction, undefined);
  const [deliveryMethod, setDeliveryMethod] = useState<"PICKUP" | "COURIER">("PICKUP");

  const hasPhysicalItem = items.some((i) => i.type === "PHYSICAL");
  const hasVoucher = items.some((i) => i.type === "VOUCHER");
  const shippingCents = deliveryMethod === "COURIER" && hasPhysicalItem ? FLAT_SHIPPING_CENTS : 0;

  const itemsJson = useMemo(
    () => JSON.stringify(items.map((i) => ({ productId: i.productId, quantity: i.quantity }))),
    [items]
  );

  if (items.length === 0) {
    return (
      <div className="pt-28 pb-24">
        <div className="max-w-2xl mx-auto px-6 text-center">
          <span className="section-label block mb-2">Sklep</span>
          <h1 className="font-serif text-4xl font-semibold text-stone-900 mb-6">Koszyk jest pusty</h1>
          <Link href="/sklep" className="blob-btn inline-flex">Przejdź do sklepu</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-28 pb-24">
      <div className="max-w-3xl mx-auto px-6">
        <span className="section-label block mb-2">Sklep</span>
        <h1 className="font-serif text-4xl font-semibold text-stone-900 mb-10">Podsumowanie zamówienia</h1>

        <div className={`${cardClasses} mb-6`}>
          <span className="section-label block mb-1">Twoje zamówienie</span>
          <div className="space-y-1.5 text-sm">
            {items.map((item) => (
              <div key={item.productId} className="flex justify-between">
                <span className="text-stone-600">{item.quantity} × {item.name}</span>
                <span className="text-stone-500">{formatPln(item.priceCents * item.quantity)}</span>
              </div>
            ))}
            {shippingCents > 0 && (
              <div className="flex justify-between text-stone-500">
                <span>Dostawa kurierem</span>
                <span>{formatPln(shippingCents)}</span>
              </div>
            )}
          </div>
          <div className="flex justify-between pt-3 border-t border-heather-100 font-medium text-stone-800">
            <span>Razem</span>
            <span className="font-serif text-lg">{formatPln(subtotalCents + shippingCents)}</span>
          </div>
        </div>

        <form action={formAction} className="space-y-6">
          <input type="hidden" name="itemsJson" value={itemsJson} />
          <input type="hidden" name="deliveryMethod" value={hasPhysicalItem ? deliveryMethod : "PICKUP"} />

          <div className={cardClasses}>
            <span className="section-label block mb-1">Twoje dane</span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="customerName" className={labelClasses}>Imię i nazwisko</label>
                <input id="customerName" name="customerName" type="text" required className={inputClasses} placeholder="Jan Kowalski" />
              </div>
              <div>
                <label htmlFor="customerEmail" className={labelClasses}>E-mail</label>
                <input id="customerEmail" name="customerEmail" type="email" required className={inputClasses} placeholder="jan@przykład.pl" />
              </div>
            </div>
            <div>
              <label htmlFor="customerPhone" className={labelClasses}>Telefon <span className="text-stone-400 font-normal">(opcjonalnie)</span></label>
              <input id="customerPhone" name="customerPhone" type="tel" className={inputClasses} placeholder="+48 600 000 000" />
            </div>
          </div>

          {hasPhysicalItem && (
            <div className={cardClasses}>
              <span className="section-label block mb-1">Dostawa</span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setDeliveryMethod("PICKUP")}
                  className={`rounded-2xl border px-4 py-3 text-sm font-medium text-left transition-all duration-300 ${
                    deliveryMethod === "PICKUP" ? "border-heather-400 bg-heather-50 text-heather-800" : "border-heather-200 text-stone-600 hover:bg-heather-50/50"
                  }`}
                >
                  Odbiór osobisty
                  <span className="block text-xs font-normal text-stone-400 mt-0.5">W pracowni NURT, bez dodatkowych opłat</span>
                </button>
                <button
                  type="button"
                  onClick={() => setDeliveryMethod("COURIER")}
                  className={`rounded-2xl border px-4 py-3 text-sm font-medium text-left transition-all duration-300 ${
                    deliveryMethod === "COURIER" ? "border-heather-400 bg-heather-50 text-heather-800" : "border-heather-200 text-stone-600 hover:bg-heather-50/50"
                  }`}
                >
                  Wysyłka kurierem
                  <span className="block text-xs font-normal text-stone-400 mt-0.5">{formatPln(FLAT_SHIPPING_CENTS)}</span>
                </button>
              </div>

              {deliveryMethod === "COURIER" && (
                <div>
                  <label htmlFor="shippingAddress" className={labelClasses}>Adres dostawy</label>
                  <textarea
                    id="shippingAddress"
                    name="shippingAddress"
                    rows={3}
                    required
                    className={inputClasses}
                    placeholder="Ulica i numer, kod pocztowy, miasto"
                  />
                </div>
              )}
            </div>
          )}

          {hasVoucher && (
            <div className={cardClasses}>
              <span className="section-label block mb-1">Personalizacja vouchera</span>
              <p className="text-xs text-stone-400 -mt-2">Opcjonalnie — jeśli kupujesz voucher w prezencie.</p>
              <div>
                <label htmlFor="voucherRecipientName" className={labelClasses}>Dla kogo <span className="text-stone-400 font-normal">(opcjonalnie)</span></label>
                <input id="voucherRecipientName" name="voucherRecipientName" type="text" className={inputClasses} placeholder="np. Kasia" />
              </div>
              <div>
                <label htmlFor="voucherMessage" className={labelClasses}>Wiadomość <span className="text-stone-400 font-normal">(opcjonalnie)</span></label>
                <textarea id="voucherMessage" name="voucherMessage" rows={2} className={inputClasses} placeholder="Krótka dedykacja" />
              </div>
            </div>
          )}

          <div className={cardClasses}>
            <label htmlFor="notes" className={labelClasses}>Uwagi do zamówienia <span className="text-stone-400 font-normal">(opcjonalnie)</span></label>
            <textarea id="notes" name="notes" rows={2} className={inputClasses} />
          </div>

          {state?.success === false && (
            <p className="text-sm text-red-600 bg-red-50 rounded-2xl px-4 py-3">{state.error}</p>
          )}

          <button type="submit" disabled={pending} className="blob-btn w-full justify-center disabled:opacity-60">
            {pending ? "Przetwarzanie…" : `Przejdź do płatności — ${formatPln(subtotalCents + shippingCents)}`}
          </button>
        </form>
      </div>
    </div>
  );
}
