"use client";

import { useActionState, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { submitBooking, type BookingFormState } from "@/app/(site)/grafik/actions";

const inputClasses =
  "w-full px-4 py-2.5 rounded-2xl border border-heather-200 text-sm bg-white " +
  "focus:outline-none focus:ring-2 focus:ring-heather-400 focus:border-heather-400 transition-all duration-300";
const labelClasses = "block text-sm font-medium text-stone-600 mb-1.5";

async function bookingAction(_prev: BookingFormState, formData: FormData): Promise<BookingFormState> {
  return submitBooking(formData);
}

interface Props {
  sessionId: string;
  workshopTitle: string;
  whenLabel: string;
  spotsLeft: number;
}

export default function BookingWidget({ sessionId, workshopTitle, whenLabel, spotsLeft }: Props) {
  const [open, setOpen] = useState(false);
  const [state, formAction, pending] = useActionState<BookingFormState, FormData>(bookingAction, undefined);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    document.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [open]);

  const full = spotsLeft <= 0;

  return (
    <>
      <button
        type="button"
        onClick={() => !full && setOpen(true)}
        disabled={full}
        className={full ? "blob-btn w-full justify-center text-sm opacity-40 cursor-not-allowed" : "blob-btn w-full justify-center text-sm"}
      >
        {full ? "Brak wolnych miejsc" : "Zarezerwuj miejsce"}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="fixed inset-0 z-[100] flex items-center justify-center px-4 py-10 bg-stone-900/40 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, y: 16, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 12, scale: 0.97 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-4xl bg-white border border-heather-100 shadow-xl shadow-heather-900/10 p-6 md:p-8"
            >
              <div className="flex items-start justify-between mb-5">
                <div>
                  <span className="section-label block mb-1.5">Rezerwacja</span>
                  <h3 className="font-serif text-xl font-semibold text-stone-900">{workshopTitle}</h3>
                  <p className="text-sm text-stone-400 mt-1">{whenLabel}</p>
                </div>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  aria-label="Zamknij"
                  className="w-8 h-8 flex items-center justify-center rounded-full text-stone-400 hover:bg-heather-50 hover:text-heather-700 transition-all duration-300 flex-shrink-0"
                >
                  ✕
                </button>
              </div>

              {state?.success ? (
                <div className="text-center py-8">
                  <div className="mx-auto mb-5 w-14 h-14 flex items-center justify-center bg-heather-100 text-heather-700"
                       style={{ borderRadius: "62% 38% 54% 46% / 44% 58% 42% 56%" }}>
                    <span className="text-2xl">✓</span>
                  </div>
                  <h4 className="font-serif text-lg font-semibold text-stone-900 mb-2">Miejsce zarezerwowane</h4>
                  <p className="text-sm text-stone-500 max-w-sm mx-auto">
                    Wysłaliśmy potwierdzenie na Twój adres e-mail. Do zobaczenia na warsztacie!
                  </p>
                </div>
              ) : (
                <form action={formAction} className="space-y-4">
                  <input type="hidden" name="sessionId" value={sessionId} />

                  <div>
                    <label htmlFor="b-name" className={labelClasses}>Imię i nazwisko</label>
                    <input id="b-name" name="name" type="text" required className={inputClasses} placeholder="Jan Kowalski" />
                  </div>

                  <div>
                    <label htmlFor="b-email" className={labelClasses}>E-mail</label>
                    <input id="b-email" name="email" type="email" required className={inputClasses} placeholder="jan@przykład.pl" />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="b-phone" className={labelClasses}>Telefon <span className="text-stone-400 font-normal">(opcjonalnie)</span></label>
                      <input id="b-phone" name="phone" type="tel" className={inputClasses} placeholder="+48 600 000 000" />
                    </div>
                    <div>
                      <label htmlFor="b-seats" className={labelClasses}>Liczba miejsc</label>
                      <input id="b-seats" name="seats" type="number" min={1} max={spotsLeft} defaultValue={1} required className={inputClasses} />
                    </div>
                  </div>

                  <p className="text-xs text-stone-400">Wolnych miejsc: {spotsLeft}</p>

                  <div>
                    <label htmlFor="b-notes" className={labelClasses}>Wiadomość <span className="text-stone-400 font-normal">(opcjonalnie)</span></label>
                    <textarea id="b-notes" name="notes" rows={2} className={inputClasses} placeholder="Coś, o czym powinniśmy wiedzieć?" />
                  </div>

                  <div>
                    <label htmlFor="b-voucher" className={labelClasses}>
                      Kod vouchera <span className="text-stone-400 font-normal">(opcjonalnie)</span>
                    </label>
                    <input
                      id="b-voucher"
                      name="voucherCode"
                      type="text"
                      className={`${inputClasses} font-mono uppercase`}
                      placeholder="NURT-XXXX-XXXX"
                    />
                    <p className="text-xs text-stone-400 mt-1">
                      Masz voucher podarunkowy ze <a href="/sklep" className="text-heather-600 hover:underline">sklepu NURT</a>? Wpisz jego kod, żeby opłacić nim udział.
                    </p>
                  </div>

                  {state?.success === false && (
                    <p className="text-sm text-red-600 bg-red-50 rounded-2xl px-4 py-2.5">{state.error}</p>
                  )}

                  <button type="submit" disabled={pending} className="blob-btn w-full justify-center disabled:opacity-60">
                    {pending ? "Wysyłanie…" : "Potwierdź rezerwację"}
                  </button>
                </form>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
