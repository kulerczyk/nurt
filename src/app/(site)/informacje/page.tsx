import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Informacje",
  description: "Najczęstsze pytania, zasady zapisów oraz dane kontaktowe pracowni NURT w Warszawie.",
};

const faqs = [
  {
    q: "Czy trzeba mieć wcześniejsze doświadczenie?",
    a: "Nie. Nasze warsztaty są otwarte zarówno dla początkujących, jak i osób już zaangażowanych artystycznie, które chcą poszerzyć swoje umiejętności. Wystarczy ciekawość i chęć tworzenia.",
  },
  {
    q: "Jak wygląda zapis na warsztat?",
    a: "Wybierz interesującą Cię technikę w zakładce „Warsztaty i kursy”, sprawdź nadchodzące terminy na stronie „Grafik” i zarezerwuj miejsce przez formularz. Potwierdzenie rezerwacji wysyłamy od razu na e-mail.",
  },
  {
    q: "Czy materiały są wliczone w cenę?",
    a: "Standardowo tak - wszystkie materiały i narzędzia potrzebne w trakcie warsztatu zapewniamy na miejscu. Szczegóły konkretnego warsztatu znajdziesz zawsze w jego opisie, a w razie wątpliwości chętnie doprecyzujemy to mailowo.",
  },
  {
    q: "Co jeśli nie mogę pojawić się na zarezerwowanym terminie?",
    a: "Napisz do nas jak najszybciej przez formularz kontaktowy albo mailowo - wspólnie znajdziemy inny termin lub uwolnimy miejsce dla kogoś z listy oczekujących.",
  },
  {
    q: "Organizujecie warsztaty dla grup i firm?",
    a: "Tak - integracje firmowe, eventy kreatywne oraz spotkania okolicznościowe organizujemy na indywidualnych zasadach. Szczegóły i formularz zapytania znajdziesz na stronie „Eventy”.",
  },
  {
    q: "Czy mogę wykorzystać pracownię na własne wydarzenie?",
    a: "NURT to również otwarta przestrzeń dla innych twórców - można tu zorganizować własne spotkanie, wystawę czy projekt artystyczny. Napisz do nas, opowiedz o pomyśle, a porozmawiamy o możliwościach.",
  },
];

export default function InformacjePage() {
  const address = "Konstruktorska 6, 02-673 Warszawa";
  const mapsHref = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent("NURT " + address)}`;

  return (
    <div className="pt-28 pb-24">
      <div className="max-w-4xl mx-auto px-6">

        <span className="section-label block mb-4">Informacje</span>
        <h1 className="font-serif text-5xl md:text-6xl font-semibold text-stone-900 leading-[1.1] mb-6">
          Dobrze wiedzieć
        </h1>
        <p className="text-stone-500 text-lg leading-relaxed mb-16 max-w-2xl">
          Odpowiedzi na najczęstsze pytania, zasady zapisów oraz dane kontaktowe pracowni.
          Jeśli czegoś tu nie znajdziesz, po prostu{" "}
          <Link href="/kontakt" className="text-heather-700 hover:underline">napisz do nas</Link>.
        </p>

        {/* FAQ */}
        <div className="mb-20">
          <h2 className="font-serif text-2xl font-semibold text-stone-800 mb-6">Najczęstsze pytania</h2>
          <div className="space-y-3">
            {faqs.map((item) => (
              <details key={item.q} className="group rounded-3xl bg-white border border-heather-100 open:border-heather-300 transition-colors duration-300">
                <summary className="cursor-pointer list-none flex items-center justify-between gap-4 px-6 py-4 font-medium text-stone-800">
                  {item.q}
                  <span className="text-heather-400 transition-transform duration-300 group-open:rotate-45 text-xl leading-none flex-shrink-0">+</span>
                </summary>
                <p className="px-6 pb-5 text-stone-500 leading-relaxed">{item.a}</p>
              </details>
            ))}
          </div>
        </div>

        {/* Location & contact */}
        <div className="rounded-4xl bg-heather-50 border border-heather-100 p-8 md:p-12">
          <span className="section-label block mb-4">Pracownia</span>
          <h2 className="font-serif text-2xl md:text-3xl font-semibold text-stone-900 mb-6">Odwiedź nas</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            <div>
              <p className="text-xs font-medium text-stone-400 uppercase tracking-wide mb-1.5">Adres</p>
              <a href={mapsHref} target="_blank" rel="noreferrer" className="text-stone-700 hover:text-heather-700 transition-colors duration-300 leading-relaxed">
                {address}
              </a>
            </div>
            <div>
              <p className="text-xs font-medium text-stone-400 uppercase tracking-wide mb-1.5">Kontakt</p>
              <a href="mailto:nataliatafel@gmail.com" className="block text-stone-700 hover:text-heather-700 transition-colors duration-300">
                nataliatafel@gmail.com
              </a>
              <a href="tel:+48516527527" className="block text-stone-700 hover:text-heather-700 transition-colors duration-300">
                +48 516 527 527
              </a>
            </div>
          </div>

          <div className="mt-8">
            <Link href="/kontakt" className="blob-btn inline-flex">Napisz do nas</Link>
          </div>
        </div>

      </div>
    </div>
  );
}
