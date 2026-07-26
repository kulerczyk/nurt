import type { Metadata } from "next";
import { getUpcomingSessions } from "@/lib/sessions";
import GrafikListing, { type GrafikSession } from "@/components/sections/GrafikListing";

export const dynamic = "force-dynamic"; // dostępność miejsc musi być zawsze aktualna

export const metadata: Metadata = {
  title: "Grafik",
  description: "Sprawdź najbliższe terminy warsztatów NURT i zarezerwuj swoje miejsce online.",
};

export default async function GrafikPage() {
  const sessions = await getUpcomingSessions();

  const data: GrafikSession[] = sessions.map((s) => ({
    id: s.id,
    workshopSlug: s.workshopSlug,
    workshopTitle: s.workshopTitle,
    workshopShortTitle: s.workshopShortTitle,
    workshopImage: s.workshopImage,
    startAtISO: s.startAt.toISOString(),
    location: s.location,
    capacity: s.capacity,
    bookedSeats: s.bookedSeats,
    spotsLeft: s.spotsLeft,
  }));

  return <GrafikListing sessions={data} />;
}
