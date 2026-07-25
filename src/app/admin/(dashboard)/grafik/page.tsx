import { getAllWorkshops } from "@/lib/workshops";
import { getAllSessionsForAdmin } from "@/lib/sessions";
import { getAllBookingsGroupedBySession } from "@/lib/bookings";
import SessionsManager from "@/components/admin/SessionsManager";

export const dynamic = "force-dynamic";

export default async function AdminGrafikPage() {
  const [workshops, sessions, bookingsBySession] = await Promise.all([
    getAllWorkshops(),
    getAllSessionsForAdmin(),
    getAllBookingsGroupedBySession(),
  ]);

  return (
    <div>
      <span className="section-label block mb-2">Panel</span>
      <h1 className="font-serif text-3xl font-semibold text-stone-900 mb-8">Grafik i rezerwacje</h1>

      <SessionsManager
        workshops={workshops.map((w) => ({ id: w.id, shortTitle: w.shortTitle }))}
        sessions={sessions}
        bookingsBySession={bookingsBySession}
      />
    </div>
  );
}
