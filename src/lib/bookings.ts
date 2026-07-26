import { prisma } from "@/lib/db";
import type { Booking, BookingStatus } from "@/generated/prisma/client";
import { redeemVoucherInTransaction } from "@/lib/vouchers";

export interface CreateBookingInput {
  sessionId: string;
  name: string;
  email: string;
  phone?: string;
  seats: number;
  notes?: string;
  voucherCode?: string;
}

export type CreateBookingResult =
  | { ok: true; booking: Booking; workshopTitle: string; startAt: Date }
  | {
      ok: false;
      reason:
        | "NOT_FOUND"
        | "CANCELLED"
        | "FULL"
        | "VOUCHER_NOT_FOUND"
        | "VOUCHER_ALREADY_REDEEMED"
        | "VOUCHER_EXPIRED"
        | "VOUCHER_CANCELLED";
    };

const VOUCHER_REASON_MAP = {
  not_found: "VOUCHER_NOT_FOUND",
  already_redeemed: "VOUCHER_ALREADY_REDEEMED",
  expired: "VOUCHER_EXPIRED",
  cancelled: "VOUCHER_CANCELLED",
} as const;

// Rzucany wewnątrz transakcji, żeby nieudana realizacja vouchera cofnęła też
// utworzoną w tej samej transakcji rezerwację (Prisma robi rollback przy wyjątku).
class VoucherRedemptionError extends Error {
  constructor(public readonly reason: (typeof VOUCHER_REASON_MAP)[keyof typeof VOUCHER_REASON_MAP]) {
    super(reason);
  }
}

// Transakcja: sprawdzenie dostępności, ewentualna realizacja vouchera i utworzenie
// rezerwacji muszą być atomowe, inaczej dwie równoczesne rezerwacje mogłyby razem
// przekroczyć pojemność terminu albo dwukrotnie zużyć ten sam kod vouchera.
export async function createBooking(input: CreateBookingInput): Promise<CreateBookingResult> {
  try {
    return await prisma.$transaction(async (tx) => {
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

      if (input.voucherCode) {
        const redemption = await redeemVoucherInTransaction(tx, input.voucherCode, booking.id);
        if (!redemption.ok) throw new VoucherRedemptionError(VOUCHER_REASON_MAP[redemption.reason]);
      }

      return { ok: true, booking, workshopTitle: session.workshop.title, startAt: session.startAt };
    });
  } catch (err) {
    if (err instanceof VoucherRedemptionError) return { ok: false, reason: err.reason };
    throw err;
  }
}

export async function getBookingsForSession(sessionId: string): Promise<Booking[]> {
  return prisma.booking.findMany({
    where: { sessionId },
    orderBy: { createdAt: "asc" },
  });
}

// Panel admina wyświetla wszystkie terminy naraz - wygodniej pobrać wszystkie
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
