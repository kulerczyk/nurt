import { notFound } from "next/navigation";
import { getWorkshop, getAllSlugs, getOtherWorkshops } from "@/lib/workshops";
import { getNextSessionForWorkshop } from "@/lib/sessions";
import WorkshopPageContent from "@/components/sections/WorkshopPageContent";
import type { Metadata } from "next";

interface Props {
  params: Promise<{ slug: string }>;
}

export const revalidate = 3600; // ISR — odśwież co godzinę

export async function generateStaticParams() {
  const slugs = await getAllSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const workshop = await getWorkshop(slug);
  if (!workshop) return {};
  return {
    title: `${workshop.title} — NURT Warsztaty Artystyczne`,
    description: workshop.intro,
  };
}

export default async function WorkshopPage({ params }: Props) {
  const { slug } = await params;
  const workshop = await getWorkshop(slug);
  if (!workshop) notFound();

  const [otherWorkshops, nextSession] = await Promise.all([
    getOtherWorkshops(slug, 3),
    getNextSessionForWorkshop(slug),
  ]);

  const nextSessionData = nextSession
    ? {
        id: nextSession.id,
        startAtISO: nextSession.startAt.toISOString(),
        spotsLeft: nextSession.spotsLeft,
        location: nextSession.location,
      }
    : null;

  return (
    <WorkshopPageContent
      workshop={workshop}
      otherWorkshops={otherWorkshops}
      nextSession={nextSessionData}
    />
  );
}
