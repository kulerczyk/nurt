"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { deleteProductAction } from "@/app/admin/(dashboard)/produkty/actions";
import type { Product } from "@/lib/products";

function formatPln(cents: number): string {
  return `${(cents / 100).toFixed(2).replace(".", ",")} zł`;
}

export default function ProductsTable({ products }: { products: Product[] }) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [pendingId, setPendingId] = useState<string | null>(null);

  const remove = (product: Product) => {
    if (!confirm(`Usunąć produkt „${product.name}”? Tej operacji nie można cofnąć.`)) return;
    setError(null);
    setPendingId(product.id);
    startTransition(async () => {
      const result = await deleteProductAction(product.id);
      if (!result.success) setError(result.error);
      setPendingId(null);
    });
  };

  return (
    <div>
      {error && <p className="text-sm text-red-600 bg-red-50 rounded-2xl px-4 py-3 mb-4">{error}</p>}

      <div className="bg-white rounded-3xl border border-heather-100 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-heather-100 text-left text-stone-400 text-xs uppercase tracking-wide">
              <th className="px-6 py-3 font-medium">Nazwa</th>
              <th className="px-6 py-3 font-medium">Typ</th>
              <th className="px-6 py-3 font-medium">Cena</th>
              <th className="px-6 py-3 font-medium">Stan</th>
              <th className="px-6 py-3 font-medium">Status</th>
              <th className="px-6 py-3 font-medium text-right">Akcje</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id} className="border-b border-heather-50 last:border-0 hover:bg-heather-50/50 transition-colors duration-200">
                <td className="px-6 py-3.5 font-medium text-stone-800">{p.name}</td>
                <td className="px-6 py-3.5 text-stone-500">{p.type === "VOUCHER" ? "Voucher" : "Produkt fizyczny"}</td>
                <td className="px-6 py-3.5 text-stone-500">{formatPln(p.priceCents)}</td>
                <td className="px-6 py-3.5 text-stone-500">{p.type === "PHYSICAL" ? (p.stock ?? "-") : "-"}</td>
                <td className="px-6 py-3.5">
                  <span
                    className={[
                      "inline-block px-2.5 py-0.5 rounded-full text-xs font-medium",
                      p.active ? "bg-heather-50 text-heather-700" : "bg-stone-100 text-stone-500",
                    ].join(" ")}
                  >
                    {p.active ? "Widoczny" : "Ukryty"}
                  </span>
                </td>
                <td className="px-6 py-3.5 text-right whitespace-nowrap">
                  <Link
                    href={`/admin/produkty/${p.id}/edytuj`}
                    className="text-xs font-medium text-heather-700 hover:underline mr-4"
                  >
                    Edytuj
                  </Link>
                  <button
                    type="button"
                    onClick={() => remove(p)}
                    disabled={isPending && pendingId === p.id}
                    className="text-xs font-medium text-red-500 hover:underline disabled:opacity-50"
                  >
                    Usuń
                  </button>
                </td>
              </tr>
            ))}
            {products.length === 0 && (
              <tr>
                <td colSpan={6} className="px-6 py-8 text-center text-stone-400">
                  Brak produktów - dodaj pierwszy powyżej.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
