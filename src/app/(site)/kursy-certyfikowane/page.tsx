import type { Metadata } from "next";
import Link from "next/link";
import WorkshopsListing from "@/components/sections/WorkshopsListing";
import { getWorkshopsByCategory } from "@/lib/workshops";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Kursy Certyfikowane",
  description:
    "Wielosesyjne kursy artystyczne NURT z zaświadczeniem ukończenia - dla osób, które chcą pogłębić wybraną technikę.",
};

function EmptyState() {
  return (
    <div className="rounded-3xl bg-heather-50 border border-heather-100 p-12 md:p-16 text-center max-w-2xl mx-auto">
      <span className="section-label block mb-4">Już wkrótce</span>
      <h3 className="font-serif text-2xl md:text-3xl font-semibold text-stone-900 mb-4">
        Przygotowujemy ofertę kursów certyfikowanych
      </h3>
      <p className="text-stone-500 leading-relaxed mb-8 max-w-lg mx-auto">
        Kursy certyfikowane to dłuższe, wielosesyjne programy pozwalające dogłębnie
        poznać wybraną technikę i zakończone zaświadczeniem ukończenia. Jeśli już teraz
        jesteś zainteresowany/a taką formą nauki, napisz do nas - chętnie doradzimy
        i poinformujemy Cię, gdy tylko ruszy zapisy.
      </p>
      <Link href="/kontakt" className="blob-btn inline-flex">Zapytaj o kursy</Link>
    </div>
  );
}

export default async function KursyCertyfikowanePage() {
  const courses = await getWorkshopsByCategory("KURS_CERTYFIKOWANY");

  return (
    <WorkshopsListing
      workshops={courses}
      eyebrow="Oferta"
      title="Kursy Certyfikowane"
      description="Wielosesyjne programy dla osób, które chcą pogłębić wybraną technikę i zakończyć naukę zaświadczeniem ukończenia kursu NURT."
      emptyState={<EmptyState />}
    />
  );
}
