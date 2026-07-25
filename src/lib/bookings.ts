import { prisma } from "@/lib/db";
import type { Booking, BookingStatus } from "@/generated/prisma/client";

export interface CreateBookingInput {
  sessionId: string;
  name: string;
  email: string;
  phone?: string;
  seats: number;
  notes?: string;
}

export type CreateBookingResult =
  | { ok: true; booking: Booking; workshopTitle: string; startAt: Date }
  | { ok: false; reason: "NOT_FOUND" | "CANCELLED" | "FULL" };

// Transakcja: sprawdzenie dostępności i utworzenie rezerwacji muszą być atomowe,
// inaczej dwie równoczesne rezerwacje mogłyby razem przekroczyć pojemność terminu.
export async function createBooking(input: CreateBookingInput): Promise<CreateBookingResult> {
  return prisma.$transaction(async (tx) => {
    const session = await tx.workshopSession.findUnique({
      where: { id: input.sessionId },
      include: {
        workshop: { select: { title: true } },
        bookings: { where: { status: "CONFIRMED" }, select: { seats: true } },
      },
    });

    if (!session) return { ok: false, reason: "NOT_FOUND" };
    if (session.status === "CANCELLED") return { ok: false, reason: "CANCELLED" };

    const bookedSeats = session.bookings.reduce((sum, b) => sum + b.seats, 0);
    const spotsLeft = session.capacity - bookedSeats;
    if (input.seats > spotsLeft) return { ok: false, reason: "FULL" };

    const booking = await tx.booking.create({
      data: {
        sessionId: input.sessionId,
        name: input.name,
        email: input.email,
        phone: input.phone,
        seats: input.seats,
        notes: input.notes,
      },
    });

    return { ok: true, booking, workshopTitle: session.workshop.title, startAt: session.startAt };
  });
}

export async function getBookingsForSession(sessionId: string): Promise<Booking[]> {
  return prisma.booking.findMany({
    where: { sessionId },
    orderBy: { createdAt: "asc" },
  });
}

// Panel admina wyświetla wszystkie terminy naraz — wygodniej pobrać wszystkie
// rezerwacje jednym zapytaniem i pogrupować w pamięci niż odpytywać per wiersz.
export async function getAllBookingsGroupedBySession(): Promise<Record<string, Booking[]>> {
  const rows = await prisma.booking.findMany({ orderBy: { createdAt: "asc" } });
  return rows.reduce<Record<string, Booking[]>>((acc, booking) => {
    (acc[booking.sessionId] ??= []).push(booking);
    return acc;
  }, {});
}

export async function setBookingStatus(id: string, status: BookingStatus): Promise<void> {
  await prisma.booking.update({ where: { id }, data: { status } });
}
