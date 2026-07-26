import Hero from "@/components/sections/Hero";
import UpcomingSessionsHome from "@/components/sections/UpcomingSessionsHome";
import AboutNurt from "@/components/sections/AboutNurt";
import { getUpcomingSessions } from "@/lib/sessions";
import type { GrafikSession } from "@/components/sections/GrafikListing";

export const revalidate = 300; // ISR - odśwież co 5 min; sama rezerwacja i tak jest walidowana transakcyjnie w bazie

export default async function HomePage() {
  const sessions = await getUpcomingSessions();

  const upcoming: GrafikSession[] = sessions.slice(0, 3).map((s) => ({
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

  return (
    <>
      <Hero />
      <UpcomingSessionsHome sessions={upcoming} />
      <AboutNurt />
    </>
  );
}
