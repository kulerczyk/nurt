"use client";

import { useActionState, useState, useTransition } from "react";
import {
  createSessionAction,
  setSessionStatusAction,
  deleteSessionAction,
  setBookingStatusAction,
  type SessionFormState,
} from "@/app/admin/(dashboard)/grafik/actions";
import type { UpcomingSession } from "@/lib/sessions";
import type { Booking } from "@/generated/prisma/client";

const inputClasses =
  "w-full px-4 py-2.5 rounded-2xl border border-heather-200 text-sm bg-white " +
  "focus:outline-none focus:ring-2 focus:ring-heather-400 focus:border-heather-400 transition-all duration-300";
const labelClasses = "block text-sm font-medium text-stone-600 mb-1.5";

function formatDateTime(date: Date): string {
  return new Intl.DateTimeFormat("pl-PL", { weekday: "short", day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" }).format(date);
}

interface WorkshopOption {
  id: string;
  shortTitle: string;
}

function NewSessionForm({ workshops }: { workshops: WorkshopOption[] }) {
  const [state, formAction, pending] = useActionState<SessionFormState, FormData>(createSessionAction, undefined);

  return (
    <form action={formAction} className="bg-white rounded-3xl border border-heather-100 p-6 mb-8 space-y-4">
      <span className="section-label block mb-1">Nowy termin</span>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="workshopId" className={labelClasses}>Warsztat</label>
          <select id="workshopId" name="workshopId" required className={inputClasses} defaultValue="">
            <option value="" disabled>Wybierz warsztat</option>
            {workshops.map((w) => (
              <option key={w.id} value={w.id}>{w.shortTitle}</option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="capacity" className={labelClasses}>Liczba miejsc</label>
          <input id="capacity" name="capacity" type="number" min={1} max={100} required defaultValue={10} className={inputClasses} />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="date" className={labelClasses}>Data</label>
          <input id="date" name="date" type="date" required className={inputClasses} />
        </div>
        <div>
          <label htmlFor="time" className={labelClasses}>Godzina</label>
          <input id="time" name="time" type="time" required className={inputClasses} />
        </div>
      </div>

      <div>
        <label htmlFor="location" className={labelClasses}>Miejsce <span className="text-stone-400 font-normal">(opcjonalnie)</span></label>
        <input id="location" name="location" type="text" className={inputClasses} placeholder="np. Pracownia NURT, ul. Przykładowa 1" />
      </div>

      <div>
        <label htmlFor="notes" className={labelClasses}>Notatka wewnętrzna <span className="text-stone-400 font-normal">(opcjonalnie, niewidoczna publicznie)</span></label>
        <textarea id="notes" name="notes" rows={2} className={inputClasses} />
      </div>

      {state?.success === false && (
        <p className="text-sm text-red-600 bg-red-50 rounded-2xl px-4 py-2.5">{state.error}</p>
      )}
      {state?.success === true && (
        <p className="text-sm text-heather-700 bg-heather-50 rounded-2xl px-4 py-2.5">Termin dodany.</p>
      )}

      <button type="submit" disabled={pending} className="blob-btn text-sm disabled:opacity-60">
        {pending ? "Zapisywanie…" : "Dodaj termin"}
      </button>
    </form>
  );
}

function BookingStatusBadge({ status }: { status: Booking["status"] }) {
  const confirmed = status === "CONFIRMED";
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${confirmed ? "bg-heather-100 text-heather-700" : "bg-stone-100 text-stone-400"}`}>
      {confirmed ? "Potwierdzona" : "Anulowana"}
    </span>
  );
}

function BookingRow({ booking }: { booking: Booking }) {
  const [isPending, startTransition] = useTransition();
  const toggle = () => {
    const next = booking.status === "CONFIRMED" ? "CANCELLED" : "CONFIRMED";
    startTransition(async () => { await setBookingStatusAction(booking.id, next); });
  };

  return (
    <div className="flex items-center gap-3 py-2 text-sm border-b border-heather-100/60 last:border-0">
      <div className="flex-1 min-w-0">
        <span className="font-medium text-stone-700">{booking.name}</span>
        <span className="text-stone-400"> · {booking.seats} {booking.seats === 1 ? "miejsce" : "miejsca"} · </span>
        <a href={`mailto:${booking.email}`} className="text-heather-600 hover:underline">{booking.email}</a>
        {booking.phone && <span className="text-stone-400"> · {booking.phone}</span>}
      </div>
      <BookingStatusBadge status={booking.status} />
      <button
        type="button"
        onClick={toggle}
        disabled={isPending}
        className="text-xs font-medium text-heather-700 hover:underline disabled:opacity-50 whitespace-nowrap"
      >
        {booking.status === "CONFIRMED" ? "Anuluj" : "Przywróć"}
      </button>
    </div>
  );
}

function SessionRow({ session, bookings }: { session: UpcomingSession; bookings: Booking[] }) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const isPast = session.startAt.getTime() < Date.now();
  const isCancelled = session.status === "CANCELLED";

  const toggleCancelled = () => {
    startTransition(async () => {
      await setSessionStatusAction(session.id, isCancelled ? "SCHEDULED" : "CANCELLED");
    });
  };

  const remove = () => {
    if (!confirm("Usunąć ten termin wraz ze wszystkimi rezerwacjami? Tej operacji nie można cofnąć.")) return;
    startTransition(async () => { await deleteSessionAction(session.id); });
  };

  return (
    <div className="border-b border-heather-50 last:border-0">
      <button type="button" onClick={() => setOpen((v) => !v)} className="w-full flex items-center gap-4 px-6 py-4 text-left hover:bg-heather-50/50 transition-colors duration-200">
        <span className={`text-heather-400 transition-transform duration-300 ${open ? "rotate-90" : ""}`}>›</span>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-medium text-stone-800">{session.workshopShortTitle}</span>
            {isCancelled && <span className="text-xs px-2 py-0.5 rounded-full bg-red-50 text-red-500 font-medium">Anulowany</span>}
            {isPast && !isCancelled && <span className="text-xs px-2 py-0.5 rounded-full bg-stone-100 text-stone-400 font-medium">Miniony</span>}
          </div>
          <p className="text-sm text-stone-400 mt-0.5">{formatDateTime(session.startAt)}</p>
        </div>

        <span className="text-xs text-stone-500 whitespace-nowrap">
          {session.bookedSeats}/{session.capacity} miejsc
        </span>
      </button>

      {open && (
        <div className="px-6 pb-5 pl-16 -mt-1 space-y-3">
          {session.location && <p className="text-sm text-stone-500">Miejsce: {session.location}</p>}

          <div className="rounded-2xl bg-heather-50/60 border border-heather-100 p-4">
            <span className="text-xs font-medium text-stone-500 uppercase tracking-wide">Uczestnicy</span>
            {bookings.length === 0 ? (
              <p className="text-sm text-stone-400 mt-2">Brak rezerwacji na ten termin.</p>
            ) : (
              <div className="mt-2">
                {bookings.map((b) => <BookingRow key={b.id} booking={b} />)}
              </div>
            )}
          </div>

          <div className="flex gap-3">
            <button type="button" onClick={toggleCancelled} disabled={isPending} className="text-xs font-medium text-heather-700 border border-heather-300 rounded-full px-4 py-1.5 hover:bg-heather-500 hover:text-white hover:border-heather-500 transition-all duration-300 disabled:opacity-50">
              {isCancelled ? "Przywróć termin" : "Anuluj termin"}
            </button>
            <button type="button" onClick={remove} disabled={isPending} className="text-xs font-medium text-red-500 border border-red-200 rounded-full px-4 py-1.5 hover:bg-red-500 hover:text-white hover:border-red-500 transition-all duration-300 disabled:opacity-50">
              Usuń
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

interface Props {
  workshops: WorkshopOption[];
  sessions: UpcomingSession[];
  bookingsBySession: Record<string, Booking[]>;
}

export default function SessionsManager({ workshops, sessions, bookingsBySession }: Props) {
  return (
    <div>
      <NewSessionForm workshops={workshops} />

      {sessions.length === 0 ? (
        <div className="bg-white rounded-3xl border border-heather-100 p-12 text-center">
          <p className="text-stone-400 text-sm">Brak terminów — dodaj pierwszy powyżej.</p>
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-heather-100 overflow-hidden">
          {sessions.map((session) => (
            <SessionRow key={session.id} session={session} bookings={bookingsBySession[session.id] ?? []} />
          ))}
        </div>
      )}
    </div>
  );
}
