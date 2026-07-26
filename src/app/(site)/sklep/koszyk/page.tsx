"use client";

import Link from "next/link";
import Image from "next/image";
import { useCart } from "@/components/shop/CartProvider";

function formatPln(cents: number): string {
  return `${(cents / 100).toFixed(2).replace(".", ",")} zł`;
}

export default function CartPage() {
  const { items, updateQuantity, removeItem, subtotalCents } = useCart();

  return (
    <div className="pt-28 pb-24">
      <div className="max-w-3xl mx-auto px-6">
        <span className="section-label block mb-2">Sklep</span>
        <h1 className="font-serif text-4xl font-semibold text-stone-900 mb-10">Koszyk</h1>

        {items.length === 0 ? (
          <div className="rounded-3xl bg-heather-50 border border-heather-100 p-12 text-center">
            <p className="text-stone-500 mb-6">Twój koszyk jest pusty.</p>
            <Link href="/sklep" className="blob-btn inline-flex">Przejdź do sklepu</Link>
          </div>
        ) : (
          <>
            <div className="bg-white rounded-3xl border border-heather-100 divide-y divide-heather-50 overflow-hidden mb-8">
              {items.map((item) => (
                <div key={item.productId} className="flex items-center gap-4 p-5">
                  <div className="relative w-16 h-16 rounded-2xl overflow-hidden flex-shrink-0 bg-heather-50">
                    <Image src={item.image} alt={item.name} fill className="object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-stone-800 truncate">{item.name}</p>
                    <p className="text-sm text-stone-400">{formatPln(item.priceCents)} / szt.</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                      className="w-8 h-8 rounded-full border border-heather-200 text-stone-500 hover:bg-heather-50 transition-colors duration-200"
                    >
                      −
                    </button>
                    <span className="w-6 text-center text-sm font-medium">{item.quantity}</span>
                    <button
                      type="button"
                      onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                      disabled={item.maxStock !== null && item.quantity >= item.maxStock}
                      className="w-8 h-8 rounded-full border border-heather-200 text-stone-500 hover:bg-heather-50 transition-colors duration-200 disabled:opacity-30"
                    >
                      +
                    </button>
                  </div>
                  <span className="w-20 text-right font-medium text-stone-700">
                    {formatPln(item.priceCents * item.quantity)}
                  </span>
                  <button
                    type="button"
                    onClick={() => removeItem(item.productId)}
                    aria-label="Usuń"
                    className="text-stone-300 hover:text-red-500 transition-colors duration-200 ml-2"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between mb-8">
              <span className="text-stone-500">Suma częściowa</span>
              <span className="font-serif text-2xl font-semibold text-stone-900">{formatPln(subtotalCents)}</span>
            </div>
            <p className="text-xs text-stone-400 mb-8">Koszt dostawy (jeśli dotyczy) zostanie doliczony w kolejnym kroku.</p>

            <div className="flex items-center gap-4">
              <Link href="/sklep/checkout" className="blob-btn">Przejdź do zamówienia</Link>
              <Link href="/sklep" className="text-sm text-stone-500 hover:text-heather-700 transition-colors duration-300">
                Kontynuuj zakupy
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
