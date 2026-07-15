import { notFound } from "next/navigation";
import { getWorkshop, getAllSlugs } from "@/lib/workshops";
import WorkshopPageContent from "@/components/sections/WorkshopPageContent";
import type { Metadata } from "next";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const workshop = getWorkshop(slug);
  if (!workshop) return {};
  return {
    title: `${workshop.title} — NURT Warsztaty Artystyczne`,
    description: workshop.intro,
  };
}

export default async function WorkshopPage({ params }: Props) {
  const { slug } = await params;
  const workshop = getWorkshop(slug);
  if (!workshop) notFound();

  return <WorkshopPageContent workshop={workshop} />;
}
