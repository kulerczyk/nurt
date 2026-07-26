import type { Metadata } from "next";
import ContactForm from "@/components/sections/ContactForm";

export const metadata: Metadata = {
  title: "Kontakt — NURT Warsztaty Artystyczne",
  description:
    "Masz pytanie o warsztaty, zapisy czy wydarzenie firmowe? Napisz do nas — odpowiadamy szybko i z sercem.",
};

export default function KontaktPage() {
  return (
    <div className="pt-28 pb-24">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-16">

          {/* Intro column */}
          <div className="lg:col-span-2 animate-fade-in">
            <span className="section-label block mb-4">Kontakt</span>
            <h1 className="font-serif text-4xl md:text-5xl font-semibold text-stone-900 leading-[1.1] mb-6">
              Napisz do nas
            </h1>
            <p className="text-lg text-stone-500 leading-relaxed mb-8">
              Masz pytanie o konkretny warsztat, termin zapisów albo szukasz przestrzeni
              na wydarzenie dla swojego zespołu? Wypełnij formularz — odpowiadamy zwykle
              w ciągu 1–2 dni roboczych.
            </p>

            <div className="rounded-3xl bg-heather-50 border border-heather-100 p-6">
              <span className="section-label block mb-3">Zapytania grupowe i firmowe</span>
              <p className="text-sm text-stone-600 leading-relaxed">
                Organizujesz integrację, event kreatywny albo szukasz warsztatu jako prezentu
                dla większej grupy? Przełącz formularz na &bdquo;Grupa / firma&rdquo; i podaj
                kilka dodatkowych szczegółów — dzięki temu przygotujemy dopasowaną propozycję.
              </p>
            </div>
          </div>

          {/* Form column */}
          <div className="lg:col-span-3">
            <div className="rounded-4xl bg-white border border-heather-100 shadow-sm shadow-heather-100/40 p-6 md:p-10">
              <ContactForm />
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
