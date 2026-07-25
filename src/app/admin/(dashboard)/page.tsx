import { getAllWorkshops } from "@/lib/workshops";

export const dynamic = "force-dynamic"; // panel admina zawsze ma widzieć aktualny stan bazy

export default async function AdminDashboardPage() {
  const workshops = await getAllWorkshops();

  return (
    <div>
      <span className="section-label block mb-2">Panel</span>
      <h1 className="font-serif text-3xl font-semibold text-stone-900 mb-8">Warsztaty</h1>

      <div className="bg-white rounded-3xl border border-heather-100 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-heather-100 text-left text-stone-400 text-xs uppercase tracking-wide">
              <th className="px-6 py-3 font-medium">Nazwa</th>
              <th className="px-6 py-3 font-medium">Slug</th>
              <th className="px-6 py-3 font-medium">Kolor</th>
            </tr>
          </thead>
          <tbody>
            {workshops.map((w) => (
              <tr key={w.slug} className="border-b border-heather-50 last:border-0 hover:bg-heather-50/50 transition-colors duration-200">
                <td className="px-6 py-3.5 font-medium text-stone-800">{w.shortTitle}</td>
                <td className="px-6 py-3.5 text-stone-400 font-mono text-xs">{w.slug}</td>
                <td className="px-6 py-3.5">
                  <span className="inline-block w-3 h-3 rounded-full bg-heather-400" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="text-sm text-stone-400 mt-6">
        Edytowanie treści warsztatów z panelu — w następnej fazie.
      </p>
    </div>
  );
}
