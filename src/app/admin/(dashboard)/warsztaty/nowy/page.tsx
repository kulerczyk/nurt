import WorkshopForm from "@/components/admin/WorkshopForm";
import { createWorkshopAction } from "@/app/admin/(dashboard)/warsztaty/actions";

export default function NewWorkshopPage() {
  return (
    <div>
      <span className="section-label block mb-2">Panel</span>
      <h1 className="font-serif text-3xl font-semibold text-stone-900 mb-8">Nowy warsztat</h1>

      <WorkshopForm mode="create" action={createWorkshopAction} />
    </div>
  );
}
