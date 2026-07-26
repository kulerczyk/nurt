import type { Metadata } from "next";
import EventyContent from "@/components/sections/EventyContent";
import { getWorkshopsByCategory } from "@/lib/workshops";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Eventy i oferta indywidualna",
  description:
    "Integracje firmowe, eventy kreatywne dla grup i spersonalizowana oferta indywidualna w pracowni NURT.",
};

export default async function EventyPage() {
  const eventOfferings = await getWorkshopsByCategory("EVENT");
  return <EventyContent offerings={eventOfferings} />;
}
