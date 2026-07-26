"use client";

import { useActionState, useState, useMemo } from "react";
import type { Workshop, WorkshopSection } from "@/lib/workshops";
import type { WorkshopFormState } from "@/app/admin/(dashboard)/warsztaty/actions";

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
  initialData?: Workshop;
  action: (prevState: WorkshopFormState, formData: FormData) => Promise<WorkshopFormState>;
}

export default function WorkshopForm({ mode, initialData, action }: Props) {
  const [state, formAction, pending] = useActionState<WorkshopFormState, FormData>(action, undefined);

  const [slug, setSlug] = useState(initialData?.slug ?? "");
  const [slugTouched, setSlugTouched] = useState(mode === "edit");

  const [sections, setSections] = useState<WorkshopSection[]>(
    initialData?.sections?.length ? initialData.sections : [{ heading: "", body: "" }]
  );
  const [highlights, setHighlights] = useState<string[]>(
    initialData?.highlights?.length ? initialData.highlights : [""]
  );

  const sectionsJson = useMemo(
    () => JSON.stringify(sections.filter((s) => s.body.trim().length > 0)),
    [sections]
  );
  const highlightsJson = useMemo(
    () => JSON.stringify(highlights.map((h) => h.trim()).filter(Boolean)),
    [highlights]
  );

  return (
    <form action={formAction} className="space-y-6">
      <input type="hidden" name="sectionsJson" value={sectionsJson} />
      <input type="hidden" name="highlightsJson" value={highlightsJson} />

      {/* Podstawowe informacje */}
      <div className={cardClasses}>
        <span className="section-label block mb-1">Podstawowe informacje</span>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="shortTitle" className={labelClasses}>Krótka nazwa</label>
            <input
              id="shortTitle"
              name="shortTitle"
              type="text"
              required
              defaultValue={initialData?.shortTitle}
              placeholder="np. Linoryt"
              className={inputClasses}
              onChange={(e) => {
                if (!slugTouched) setSlug(slugify(e.target.value));
              }}
            />
            <p className="text-xs text-stone-400 mt-1">Widoczna w menu, na kartach i w panelu.</p>
          </div>
          <div>
            <label htmlFor="title" className={labelClasses}>Pełny tytuł</label>
            <input
              id="title"
              name="title"
              type="text"
              required
              defaultValue={initialData?.title}
              placeholder="np. Warsztaty linorytu"
              className={inputClasses}
            />
          </div>
        </div>

        <div>
          <label htmlFor="slug" className={labelClasses}>
            Adres (slug) <span className="text-stone-400 font-normal">— część adresu strony, np. nurt.pl/warsztaty/<b>linoryt</b></span>
          </label>
          <input
            id="slug"
            name="slug"
            type="text"
            required
            value={slug}
            onChange={(e) => { setSlug(slugify(e.target.value)); setSlugTouched(true); }}
            placeholder="linoryt"
            className={`${inputClasses} font-mono`}
          />
        </div>

        <div>
          <label htmlFor="tagline" className={labelClasses}>Hasło / podtytuł</label>
          <input
            id="tagline"
            name="tagline"
            type="text"
            required
            defaultValue={initialData?.tagline}
            placeholder="np. Każda odbitka jest jedyna w swoim rodzaju."
            className={inputClasses}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="color" className={labelClasses}>Kolor akcentu</label>
            <select id="color" name="color" required defaultValue={initialData?.color ?? "heather-400"} className={inputClasses}>
              <option value="heather-400">Jasny (heather-400)</option>
              <option value="heather-500">Średni (heather-500)</option>
              <option value="heather-600">Ciemny (heather-600)</option>
            </select>
          </div>
          <div>
            <label htmlFor="order" className={labelClasses}>Kolejność wyświetlania</label>
            <input
              id="order"
              name="order"
              type="number"
              min={0}
              defaultValue={initialData?.order ?? undefined}
              placeholder="0"
              className={inputClasses}
            />
            <p className="text-xs text-stone-400 mt-1">Mniejsza liczba = wyżej na liście.</p>
          </div>
        </div>
      </div>

      {/* Zdjęcie */}
      <div className={cardClasses}>
        <span className="section-label block mb-1">Zdjęcie</span>

        <div>
          <label htmlFor="image" className={labelClasses}>Link do zdjęcia</label>
          <input
            id="image"
            name="image"
            type="text"
            required
            defaultValue={initialData?.image}
            placeholder="https://... albo /workshops/nazwa.png"
            className={`${inputClasses} font-mono`}
          />
          <p className="text-xs text-stone-400 mt-1">
            Wklej link do zdjęcia (np. z Unsplash) albo ścieżkę do pliku wgranego wcześniej do folderu <code>public/workshops</code>.
          </p>
        </div>

        <div>
          <label htmlFor="imageAlt" className={labelClasses}>Opis zdjęcia (alt)</label>
          <input
            id="imageAlt"
            name="imageAlt"
            type="text"
            required
            defaultValue={initialData?.imageAlt}
            placeholder="np. Dłutka i linoleum podczas warsztatów linorytu"
            className={inputClasses}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="imageBg" className={labelClasses}>Tło zdjęcia</label>
            <select id="imageBg" name="imageBg" defaultValue={initialData?.imageBg ?? ""} className={inputClasses}>
              <option value="">Domyślne (zdjęcie wypełnia przestrzeń)</option>
              <option value="light">Jasne — dla zdjęć produktowych na białym tle</option>
              <option value="dark">Ciemne</option>
            </select>
          </div>
          <div>
            <label htmlFor="imagePosition" className={labelClasses}>
              Pozycja zdjęcia <span className="text-stone-400 font-normal">(opcjonalnie)</span>
            </label>
            <input
              id="imagePosition"
              name="imagePosition"
              type="text"
              defaultValue={initialData?.imagePosition}
              placeholder="np. center top"
              className={inputClasses}
            />
          </div>
        </div>
      </div>

      {/* Treść */}
      <div className={cardClasses}>
        <span className="section-label block mb-1">Treść</span>

        <div>
          <label htmlFor="intro" className={labelClasses}>Wstęp</label>
          <textarea
            id="intro"
            name="intro"
            required
            rows={3}
            defaultValue={initialData?.intro}
            className={inputClasses}
          />
        </div>

        <div>
          <span className={labelClasses}>Sekcje opisu</span>
          <div className="space-y-3">
            {sections.map((section, i) => (
              <div key={i} className="rounded-2xl border border-heather-100 p-4 space-y-2">
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={section.heading ?? ""}
                    onChange={(e) => {
                      const next = [...sections];
                      next[i] = { ...next[i], heading: e.target.value };
                      setSections(next);
                    }}
                    placeholder="Nagłówek sekcji (opcjonalnie)"
                    className={`${inputClasses} flex-1`}
                  />
                  {sections.length > 1 && (
                    <button
                      type="button"
                      onClick={() => setSections(sections.filter((_, idx) => idx !== i))}
                      className="text-xs font-medium text-red-500 hover:underline whitespace-nowrap"
                    >
                      Usuń
                    </button>
                  )}
                </div>
                <textarea
                  value={section.body}
                  onChange={(e) => {
                    const next = [...sections];
                    next[i] = { ...next[i], body: e.target.value };
                    setSections(next);
                  }}
                  placeholder="Treść sekcji"
                  rows={3}
                  className={inputClasses}
                />
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={() => setSections([...sections, { heading: "", body: "" }])}
            className="mt-3 text-sm font-medium text-heather-700 hover:underline"
          >
            + Dodaj sekcję
          </button>
        </div>

        <div>
          <label htmlFor="closing" className={labelClasses}>Podsumowanie (ostatni akapit)</label>
          <textarea
            id="closing"
            name="closing"
            required
            rows={2}
            defaultValue={initialData?.closing}
            className={inputClasses}
          />
        </div>
      </div>

      {/* Czego się nauczysz */}
      <div className={cardClasses}>
        <span className="section-label block mb-1">Czego się nauczysz</span>
        <p className="text-xs text-stone-400 -mt-2">Krótkie punkty widoczne w bocznej karcie na podstronie warsztatu.</p>

        <div className="space-y-2">
          {highlights.map((highlight, i) => (
            <div key={i} className="flex items-center gap-2">
              <input
                type="text"
                value={highlight}
                onChange={(e) => {
                  const next = [...highlights];
                  next[i] = e.target.value;
                  setHighlights(next);
                }}
                placeholder="np. Projektowanie wzoru"
                className={`${inputClasses} flex-1`}
              />
              {highlights.length > 1 && (
                <button
                  type="button"
                  onClick={() => setHighlights(highlights.filter((_, idx) => idx !== i))}
                  className="text-xs font-medium text-red-500 hover:underline whitespace-nowrap"
                >
                  Usuń
                </button>
              )}
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={() => setHighlights([...highlights, ""])}
          className="text-sm font-medium text-heather-700 hover:underline"
        >
          + Dodaj punkt
        </button>
      </div>

      {state?.success === false && (
        <p className="text-sm text-red-600 bg-red-50 rounded-2xl px-4 py-3">{state.error}</p>
      )}

      <div className="flex items-center gap-4">
        <button type="submit" disabled={pending} className="blob-btn text-sm disabled:opacity-60">
          {pending ? "Zapisywanie…" : mode === "create" ? "Dodaj warsztat" : "Zapisz zmiany"}
        </button>
        <a href="/admin" className="text-sm text-stone-500 hover:text-heather-700 transition-colors duration-300">
          Anuluj
        </a>
      </div>
    </form>
  );
}
