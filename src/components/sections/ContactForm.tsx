"use client";

import { useActionState, useState, useEffect } from "react";
import { submitInquiry, type InquiryFormState } from "@/app/(site)/kontakt/actions";

const budgetOptions = [
  { value: "", label: "Wybierz zakres (opcjonalnie)" },
  { value: "do 2000 zł", label: "do 2000 zł" },
  { value: "2000-5000 zł", label: "2000-5000 zł" },
  { value: "5000-10000 zł", label: "5000-10000 zł" },
  { value: "ponad 10000 zł", label: "ponad 10000 zł" },
  { value: "nie wiem", label: "Nie wiem / proszę o kontakt" },
];

const inputClasses =
  "w-full px-4 py-2.5 rounded-2xl border border-heather-200 text-sm bg-white " +
  "focus:outline-none focus:ring-2 focus:ring-heather-400 focus:border-heather-400 " +
  "transition-all duration-300 placeholder:text-stone-400";

const labelClasses = "block text-sm font-medium text-stone-600 mb-1.5";

async function inquiryAction(_prev: InquiryFormState, formData: FormData): Promise<InquiryFormState> {
  return submitInquiry(formData);
}

interface Props {
  workshopSlug?: string;
  workshopTitle?: string;
  defaultType?: "INDIVIDUAL" | "CORPORATE";
  allowTypeToggle?: boolean;
  compact?: boolean;
  onSuccess?: () => void;
}

export default function ContactForm({
  workshopSlug,
  workshopTitle,
  defaultType = "INDIVIDUAL",
  allowTypeToggle = true,
  compact = false,
  onSuccess,
}: Props) {
  const [type, setType] = useState<"INDIVIDUAL" | "CORPORATE">(defaultType);
  const [state, formAction, pending] = useActionState<InquiryFormState, FormData>(inquiryAction, undefined);

  useEffect(() => {
    if (state?.success) onSuccess?.();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);

  if (state?.success) {
    return (
      <div className={`text-center ${compact ? "py-8" : "py-16"}`}>
        <div className="mx-auto mb-5 w-14 h-14 flex items-center justify-center bg-heather-100 text-heather-700"
             style={{ borderRadius: "62% 38% 54% 46% / 44% 58% 42% 56%" }}>
          <span className="text-2xl">✓</span>
        </div>
        <h3 className="font-serif text-xl font-semibold text-stone-900 mb-2">
          Wiadomość wysłana
        </h3>
        <p className="text-sm text-stone-500 max-w-sm mx-auto">
          Dziękujemy za kontakt - odpowiemy najszybciej, jak możemy, zwykle w ciągu 1-2 dni roboczych.
        </p>
      </div>
    );
  }

  return (
    <form action={formAction} className={compact ? "space-y-4" : "space-y-5"}>
      <input type="hidden" name="type" value={type} />
      {workshopSlug && <input type="hidden" name="workshopSlug" value={workshopSlug} />}
      {workshopTitle && <input type="hidden" name="workshopTitle" value={workshopTitle} />}

      {allowTypeToggle && (
        <div className="inline-flex bg-heather-50 rounded-full p-1 border border-heather-100">
          {(["INDIVIDUAL", "CORPORATE"] as const).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setType(t)}
              className={[
                "px-4 py-2 text-sm font-medium rounded-full transition-all duration-300",
                type === t ? "bg-heather-400 text-white" : "text-heather-700 hover:text-heather-900",
              ].join(" ")}
            >
              {t === "INDIVIDUAL" ? "Zapytanie indywidualne" : "Grupa / firma"}
            </button>
          ))}
        </div>
      )}

      {workshopTitle && (
        <p className="text-sm text-heather-700 bg-heather-50 border border-heather-100 rounded-2xl px-4 py-2.5">
          Pytanie dotyczące warsztatu: <span className="font-medium">{workshopTitle}</span>
        </p>
      )}

      <div className={`grid ${compact ? "grid-cols-1" : "grid-cols-1 sm:grid-cols-2"} gap-4`}>
        <div>
          <label htmlFor="name" className={labelClasses}>Imię i nazwisko</label>
          <input id="name" name="name" type="text" required className={inputClasses} placeholder="Jan Kowalski" />
        </div>
        <div>
          <label htmlFor="email" className={labelClasses}>E-mail</label>
          <input id="email" name="email" type="email" required className={inputClasses} placeholder="jan@przykład.pl" />
        </div>
      </div>

      <div>
        <label htmlFor="phone" className={labelClasses}>Telefon <span className="text-stone-400 font-normal">(opcjonalnie)</span></label>
        <input id="phone" name="phone" type="tel" className={inputClasses} placeholder="+48 600 000 000" />
      </div>

      {type === "CORPORATE" && (
        <>
          <div className={`grid ${compact ? "grid-cols-1" : "grid-cols-1 sm:grid-cols-2"} gap-4`}>
            <div>
              <label htmlFor="companyName" className={labelClasses}>Nazwa firmy</label>
              <input id="companyName" name="companyName" type="text" required className={inputClasses} placeholder="Nazwa Sp. z o.o." />
            </div>
            <div>
              <label htmlFor="groupSize" className={labelClasses}>Liczba uczestników</label>
              <input id="groupSize" name="groupSize" type="number" min={1} max={500} required className={inputClasses} placeholder="np. 12" />
            </div>
          </div>
          <div className={`grid ${compact ? "grid-cols-1" : "grid-cols-1 sm:grid-cols-2"} gap-4`}>
            <div>
              <label htmlFor="preferredDate" className={labelClasses}>Preferowany termin <span className="text-stone-400 font-normal">(opcjonalnie)</span></label>
              <input id="preferredDate" name="preferredDate" type="text" className={inputClasses} placeholder="np. połowa września" />
            </div>
            <div>
              <label htmlFor="budget" className={labelClasses}>Budżet <span className="text-stone-400 font-normal">(opcjonalnie)</span></label>
              <select id="budget" name="budget" className={inputClasses} defaultValue="">
                {budgetOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>
          </div>
        </>
      )}

      <div>
        <label htmlFor="message" className={labelClasses}>Wiadomość</label>
        <textarea
          id="message"
          name="message"
          required
          rows={compact ? 3 : 5}
          className={inputClasses}
          placeholder={type === "CORPORATE"
            ? "Opowiedz nam o Waszym wydarzeniu - okazja, oczekiwania, cokolwiek, co pomoże nam przygotować dobrą propozycję."
            : "Napisz, co chciałbyś/chciałabyś wiedzieć…"}
        />
      </div>

      {state?.success === false && (
        <p className="text-sm text-red-600 bg-red-50 rounded-2xl px-4 py-2.5">{state.error}</p>
      )}

      <button type="submit" disabled={pending} className="blob-btn w-full justify-center disabled:opacity-60">
        {pending ? "Wysyłanie…" : "Wyślij wiadomość"}
      </button>
    </form>
  );
}
