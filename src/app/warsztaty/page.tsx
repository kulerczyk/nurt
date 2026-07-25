import type { Metadata } from "next";
import WorkshopsListing from "@/components/sections/WorkshopsListing";
import { getAllWorkshops } from "@/lib/workshops";

export const revalidate = 3600; // ISR — odśwież listę co godzinę, admin może wywołać odświeżenie na żądanie

export const metadata: Metadata = {
  title: "Warsztaty — NURT Warsztaty Artystyczne",
  description:
    "Poznaj wszystkie techniki artystyczne dostępne w NURT. Malarstwo, ceramika, linoryt, sitodruk, biżuteria i wiele więcej.",
};

export default async function WarsztatyPage() {
  const workshops = await getAllWorkshops();
  return <WorkshopsListing workshops={workshops} />;
}
