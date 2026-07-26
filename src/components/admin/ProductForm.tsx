"use client";

import { useActionState, useState } from "react";
import type { Product } from "@/lib/products";
import type { ProductFormState } from "@/app/admin/(dashboard)/produkty/actions";

const inputClasses =
  "w-full px-4 py-2.5 rounded-2xl border border-heather-200 text-sm bg-white " +
  "focus:outline-none focus:ring-2 focus:ring-heather-400 focus:border-heather-400 transition-all duration-300";
const labelClasses = "block text-sm font-medium text-stone-600 mb-1.5";
const cardClasses = "bg-white rounded-3xl border border-heather-100 p-6 space-y-4";

function slugify(value: string): string {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

interface Props {
  mode: "create" | "edit";
  initialData?: Product;
  action: (prevState: ProductFormState, formData: FormData) => Promise<ProductFormState>;
}

export default function ProductForm({ mode, initialData, action }: Props) {
  const [state, formAction, pending] = useActionState<ProductFormState, FormData>(action, undefined);

  const [slug, setSlug] = useState(initialData?.slug ?? "");
  const [slugTouched, setSlugTouched] = useState(mode === "edit");
  const [type, setType] = useState<"VOUCHER" | "PHYSICAL">(initialData?.type ?? "VOUCHER");

  return (
    <form action={formAction} className="space-y-6">
      <div className={cardClasses}>
        <span className="section-label block mb-1">Podstawowe informacje</span>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="name" className={labelClasses}>Nazwa produktu</label>
            <input
              id="name"
              name="name"
              type="text"
              required
              defaultValue={initialData?.name}
              placeholder="np. Voucher podarunkowy 200 zł"
              className={inputClasses}
              onChange={(e) => {
                if (!slugTouched) setSlug(slugify(e.target.value));
              }}
            />
          </div>
          <div>
            <label htmlFor="type" className={labelClasses}>Typ produktu</label>
            <select
              id="type"
              name="type"
              required
              value={type}
              onChange={(e) => setType(e.target.value as "VOUCHER" | "PHYSICAL")}
              className={inputClasses}
            >
              <option value="VOUCHER">Voucher podarunkowy</option>
              <option value="PHYSICAL">Produkt fizyczny</option>
            </select>
          </div>
        </div>

        <div>
          <label htmlFor="slug" className={labelClasses}>
            Adres (slug) <span className="text-stone-400 font-normal">- identyfikator produktu w sklepie</span>
          </label>
          <input
            id="slug"
            name="slug"
            type="text"
            required
            value={slug}
            onChange={(e) => { setSlug(slugify(e.target.value)); setSlugTouched(true); }}
            placeholder="voucher-200"
            className={`${inputClasses} font-mono`}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label htmlFor="priceZl" className={labelClasses}>Cena (zł)</label>
            <input
              id="priceZl"
              name="priceZl"
              type="number"
              step="0.01"
              min="0.01"
              required
              defaultValue={initialData ? (initialData.priceCents / 100).toFixed(2) : undefined}
              placeholder="200.00"
              className={inputClasses}
            />
          </div>
          {type === "PHYSICAL" && (
            <div>
              <label htmlFor="stock" className={labelClasses}>Stan magazynowy</label>
              <input
                id="stock"
                name="stock"
                type="number"
                min="0"
                required
                defaultValue={initialData?.stock ?? undefined}
                placeholder="10"
                className={inputClasses}
              />
            </div>
          )}
          {type === "VOUCHER" && (
            <div>
              <label htmlFor="voucherValidDays" className={labelClasses}>
                Ważność <span className="text-stone-400 font-normal">(dni)</span>
              </label>
              <input
                id="voucherValidDays"
                name="voucherValidDays"
                type="number"
                min="1"
                defaultValue={initialData?.voucherValidDays ?? 365}
                placeholder="365"
                className={inputClasses}
              />
            </div>
          )}
          <div>
            <label htmlFor="order" className={labelClasses}>Kolejność</label>
            <input
              id="order"
              name="order"
              type="number"
              min={0}
              defaultValue={initialData?.order ?? 0}
              className={inputClasses}
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <input
            id="active"
            name="active"
            type="checkbox"
            defaultChecked={initialData?.active ?? true}
            className="w-4 h-4 rounded border-heather-300 text-heather-500 focus:ring-heather-400"
          />
          <label htmlFor="active" className="text-sm text-stone-600">Widoczny w sklepie</label>
        </div>
      </div>

      <div className={cardClasses}>
        <span className="section-label block mb-1">Zdjęcie i opis</span>

        <div>
          <label htmlFor="image" className={labelClasses}>Link do zdjęcia</label>
          <input
            id="image"
            name="image"
            type="text"
            required
            defaultValue={initialData?.image}
            placeholder="https://... albo /products/nazwa.png"
            className={`${inputClasses} font-mono`}
          />
        </div>

        <div>
          <label htmlFor="imageAlt" className={labelClasses}>Opis zdjęcia (alt)</label>
          <input
            id="imageAlt"
            name="imageAlt"
            type="text"
            required
            defaultValue={initialData?.imageAlt}
            className={inputClasses}
          />
        </div>

        <div>
          <label htmlFor="description" className={labelClasses}>Opis produktu</label>
          <textarea
            id="description"
            name="description"
            required
            rows={4}
            defaultValue={initialData?.description}
            className={inputClasses}
          />
        </div>
      </div>

      {state?.success === false && (
        <p className="text-sm text-red-600 bg-red-50 rounded-2xl px-4 py-3">{state.error}</p>
      )}

      <div className="flex items-center gap-4">
        <button type="submit" disabled={pending} className="blob-btn text-sm disabled:opacity-60">
          {pending ? "Zapisywanie…" : mode === "create" ? "Dodaj produkt" : "Zapisz zmiany"}
        </button>
        <a href="/admin/produkty" className="text-sm text-stone-500 hover:text-heather-700 transition-colors duration-300">
          Anuluj
        </a>
      </div>
    </form>
  );
}
