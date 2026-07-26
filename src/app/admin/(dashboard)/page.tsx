import Link from "next/link";
import { getAllWorkshops } from "@/lib/workshops";
import WorkshopsTable from "@/components/admin/WorkshopsTable";

export const dynamic = "force-dynamic"; // panel admina zawsze ma widzieć aktualny stan bazy

export default async function AdminDashboardPage() {
  const workshops = await getAllWorkshops();

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <span className="section-label block mb-2">Panel</span>
          <h1 className="font-serif text-3xl font-semibold text-stone-900">Warsztaty</h1>
        </div>
        <Link href="/admin/warsztaty/nowy" className="blob-btn text-sm">
          + Dodaj warsztat
        </Link>
      </div>

      {workshops.length === 0 ? (
        <div className="bg-white rounded-3xl border border-heather-100 p-12 text-center">
          <p className="text-stone-400 text-sm">Brak warsztatów - dodaj pierwszy powyżej.</p>
        </div>
      ) : (
        <WorkshopsTable workshops={workshops} />
      )}
    </div>
  );
}
