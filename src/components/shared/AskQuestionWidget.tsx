"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ContactForm from "@/components/sections/ContactForm";

interface Props {
  workshopSlug: string;
  workshopTitle: string;
  className?: string;
}

// Widget kontekstowy — pozwala zadać pytanie o konkretny warsztat bez
// opuszczania strony. Zawsze typu INDIVIDUAL (zapytania grupowe mają
// osobny, bardziej szczegółowy formularz na /kontakt).
export default function AskQuestionWidget({ workshopSlug, workshopTitle, className = "" }: Props) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={[
          "inline-flex items-center justify-center gap-2 text-sm font-medium",
          "text-heather-700 border border-heather-300 rounded-full px-5 py-2.5",
          "hover:bg-heather-500 hover:text-white hover:border-heather-500",
          "transition-all duration-300",
          className,
        ].join(" ")}
      >
        Zadaj pytanie
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
                  <span className="section-label block mb-1.5">Zadaj pytanie</span>
                  <h3 className="font-serif text-xl font-semibold text-stone-900">
                    Napisz do nas
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  aria-label="Zamknij"
                  className="w-8 h-8 flex items-center justify-center rounded-full text-stone-400 hover:bg-heather-50 hover:text-heather-700 transition-all duration-300"
                >
                  ✕
                </button>
              </div>

              <ContactForm
                workshopSlug={workshopSlug}
                workshopTitle={workshopTitle}
                allowTypeToggle={false}
                compact
                onSuccess={() => {
                  setTimeout(() => setOpen(false), 2200);
                }}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
