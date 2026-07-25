import { prisma } from "@/lib/db";
import type { WorkshopSession, SessionStatus } from "@/generated/prisma/client";

export interface UpcomingSession {
  id: string;
  workshopSlug: string;
  workshopTitle: string;
  workshopShortTitle: string;
  workshopColor: string;
  workshopImage: string;
  startAt: Date;
  endAt: Date | null;
  capacity: number;
  bookedSeats: number;
  spotsLeft: number;
  location: string | null;
  status: SessionStatus;
}

function withAvailability(
  session: WorkshopSession & {
    workshop: { slug: string; title: string; shortTitle: string; color: string; image: string };
    bookings: { seats: number }[];
  }
): UpcomingSession {
  const bookedSeats = session.bookings.reduce((sum, b) => sum + b.seats, 0);
  return {
    id: session.id,
    workshopSlug: session.workshop.slug,
    workshopTitle: session.workshop.title,
    workshopShortTitle: session.workshop.shortTitle,
    workshopColor: session.workshop.color,
    workshopImage: session.workshop.image,
    startAt: session.startAt,
    endAt: session.endAt,
    capacity: session.capacity,
    bookedSeats,
    spotsLeft: Math.max(0, session.capacity - bookedSeats),
    location: session.location,
    status: session.status,
  };
}

// Publiczny grafik — tylko przyszłe, zaplanowane terminy, posortowane chronologicznie.
export async function getUpcomingSessions(): Promise<UpcomingSession[]> {
  const rows = await prisma.workshopSession.findMany({
    where: { status: "SCHEDULED", startAt: { gte: new Date() } },
    orderBy: { startAt: "asc" },
    include: {
      workshop: { select: { slug: true, title: true, shortTitle: true, color: true, image: true } },
      bookings: { where: { status: "CONFIRMED" }, select: { seats: true } },
    },
  });
  return rows.map(withAvailability);
}

// Najbliższy zaplanowany termin dla konkretnego warsztatu — używane w karcie
// "Najbliższy termin" na podstronie warsztatu.
export async function getNextSessionForWorkshop(workshopSlug: string): Promise<UpcomingSession | undefined> {
  const row = await prisma.workshopSession.findFirst({
    where: { status: "SCHEDULED", startAt: { gte: new Date() }, workshop: { slug: workshopSlug } },
    orderBy: { startAt: "asc" },
    include: {
      workshop: { select: { slug: true, title: true, shortTitle: true, color: true, image: true } },
      bookings: { where: { status: "CONFIRMED" }, select: { seats: true } },
    },
  });
  return row ? withAvailability(row) : undefined;
}

export async function getSessionById(id: string): Promise<UpcomingSession | undefined> {
  const row = await prisma.workshopSession.findUnique({
    where: { id },
    include: {
      workshop: { select: { slug: true, title: true, shortTitle: true, color: true, image: true } },
      bookings: { where: { status: "CONFIRMED" }, select: { seats: true } },
    },
  });
  return row ? withAvailability(row) : undefined;
}

// Panel admina — wszystkie terminy (też przeszłe/anulowane), z liczbą rezerwacji.
export async function getAllSessionsForAdmin() {
  const rows = await prisma.workshopSession.findMany({
    orderBy: { startAt: "desc" },
    include: {
      workshop: { select: { slug: true, title: true, shortTitle: true, color: true, image: true } },
      bookings: { where: { status: "CONFIRMED" }, select: { seats: true } },
    },
  });
  return rows.map(withAvailability);
}

export interface CreateSessionInput {
  workshopId: string;
  startAt: Date;
  endAt?: Date;
  capacity: number;
  location?: string;
  notes?: string;
}

export async function createSession(input: CreateSessionInput) {
  return prisma.workshopSession.create({ data: input });
}

export async function updateSessionStatus(id: string, status: SessionStatus) {
  await prisma.workshopSession.update({ where: { id }, data: { status } });
}

export async function deleteSession(id: string) {
  await prisma.workshopSession.delete({ where: { id } });
}
