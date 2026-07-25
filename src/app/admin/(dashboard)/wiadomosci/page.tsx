import { getAllInquiries } from "@/lib/inquiries";
import InquiriesTable from "@/components/admin/InquiriesTable";

export const dynamic = "force-dynamic";

export default async function AdminWiadomosciPage() {
  const inquiries = await getAllInquiries();
  const newCount = inquiries.filter((i) => i.status === "NEW").length;

  return (
    <div>
      <span className="section-label block mb-2">Panel</span>
      <h1 className="font-serif text-3xl font-semibold text-stone-900 mb-1">Wiadomości</h1>
      <p className="text-sm text-stone-400 mb-8">
        {newCount > 0 ? `${newCount} nowych zapytań` : "Wszystkie zapytania obsłużone"}
      </p>

      <InquiriesTable inquiries={inquiries} />
    </div>
  );
}
