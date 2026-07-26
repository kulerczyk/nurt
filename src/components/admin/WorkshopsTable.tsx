"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { deleteWorkshopAction } from "@/app/admin/(dashboard)/warsztaty/actions";
import type { Workshop } from "@/lib/workshops";

// Tailwind musi widzieć pełne nazwy klas w kodzie źródłowym, żeby je wygenerować -
// stąd mapa zamiast `bg-${w.color}` (dynamiczny string nie zadziała z JIT).
const colorDotClass: Record<string, string> = {
  "heather-400": "bg-heather-400",
  "heather-500": "bg-heather-500",
  "heather-600": "bg-heather-600",
};

const categoryLabel: Record<string, string> = {
  WARSZTAT: "Warsztat",
  KURS_CERTYFIKOWANY: "Kurs certyfikowany",
  EVENT: "Event",
};

export default function WorkshopsTable({ workshops }: { workshops: Workshop[] }) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [pendingId, setPendingId] = useState<string | null>(null);

  const remove = (workshop: Workshop) => {
    if (!confirm(`Usunąć warsztat „${workshop.shortTitle}”? Tej operacji nie można cofnąć.`)) return;
    setError(null);
    setPendingId(workshop.id);
    startTransition(async () => {
      const result = await deleteWorkshopAction(workshop.id);
      if (!result.success) setError(result.error);
      setPendingId(null);
    });
  };

  return (
    <div>
      {error && (
        <p className="text-sm text-red-600 bg-red-50 rounded-2xl px-4 py-3 mb-4">{error}</p>
      )}

      <div className="bg-white rounded-3xl border border-heather-100 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-heather-100 text-left text-stone-400 text-xs uppercase tracking-wide">
              <th className="px-6 py-3 font-medium">Nazwa</th>
              <th className="px-6 py-3 font-medium">Slug</th>
              <th className="px-6 py-3 font-medium">Sekcja</th>
              <th className="px-6 py-3 font-medium">Kolor</th>
              <th className="px-6 py-3 font-medium text-right">Akcje</th>
            </tr>
          </thead>
          <tbody>
            {workshops.map((w) => (
              <tr key={w.id} className="border-b border-heather-50 last:border-0 hover:bg-heather-50/50 transition-colors duration-200">
                <td className="px-6 py-3.5 font-medium text-stone-800">{w.shortTitle}</td>
                <td className="px-6 py-3.5 text-stone-400 font-mono text-xs">{w.slug}</td>
                <td className="px-6 py-3.5 text-stone-500">{categoryLabel[w.category] ?? w.category}</td>
                <td className="px-6 py-3.5">
                  <span className={`inline-block w-3 h-3 rounded-full ${colorDotClass[w.color] ?? "bg-heather-400"}`} />
                </td>
                <td className="px-6 py-3.5 text-right whitespace-nowrap">
                  <Link
                    href={`/admin/warsztaty/${w.id}/edytuj`}
                    className="text-xs font-medium text-heather-700 hover:underline mr-4"
                  >
                    Edytuj
                  </Link>
                  <button
                    type="button"
                    onClick={() => remove(w)}
                    disabled={isPending && pendingId === w.id}
                    className="text-xs font-medium text-red-500 hover:underline disabled:opacity-50"
                  >
                    Usuń
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
