import { notFound } from "next/navigation";
import WorkshopForm from "@/components/admin/WorkshopForm";
import { getWorkshopById } from "@/lib/workshops";
import { updateWorkshopAction } from "@/app/admin/(dashboard)/warsztaty/actions";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditWorkshopPage({ params }: Props) {
  const { id } = await params;
  const workshop = await getWorkshopById(id);
  if (!workshop) notFound();

  const boundAction = updateWorkshopAction.bind(null, id);

  return (
    <div>
      <span className="section-label block mb-2">Panel</span>
      <h1 className="font-serif text-3xl font-semibold text-stone-900 mb-8">
        Edytuj: {workshop.shortTitle}
      </h1>

      <WorkshopForm mode="edit" initialData={workshop} action={boundAction} />
    </div>
  );
}
