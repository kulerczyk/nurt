"use server";

import { revalidatePath } from "next/cache";
import { bookingSchema } from "@/lib/schemas/booking";
import { createBooking } from "@/lib/bookings";
import { sendBookingEmails } from "@/lib/email";

export type BookingFormState = { success: true } | { success: false; error: string } | undefined;

const reasonMessages: Record<string, string> = {
  NOT_FOUND: "Ten termin już nie istnieje. Odśwież stronę i spróbuj ponownie.",
  CANCELLED: "Ten termin został odwołany.",
  FULL: "Niestety, brakuje już tylu wolnych miejsc. Spróbuj zmniejszyć liczbę miejsc albo wybierz inny termin.",
};

export async function submitBooking(formData: FormData): Promise<BookingFormState> {
  const parsed = bookingSchema.safeParse({
    sessionId: formData.get("sessionId"),
    name: formData.get("name"),
    email: formData.get("email"),
    phone: formData.get("phone"),
    seats: formData.get("seats"),
    notes: formData.get("notes"),
  });

  if (!parsed.success) {
    const firstIssue = parsed.error.issues[0];
    return { success: false, error: firstIssue?.message ?? "Sprawdź poprawność formularza." };
  }

  const data = parsed.data;

  let result;
  try {
    result = await createBooking({
      sessionId: data.sessionId,
      name: data.name,
      email: data.email,
      phone: data.phone || undefined,
      seats: data.seats,
      notes: data.notes || undefined,
    });
  } catch (error) {
    console.error("[grafik] Błąd zapisu rezerwacji:", error);
    return { success: false, error: "Coś poszło nie tak. Spróbuj ponownie za chwilę." };
  }

  if (!result.ok) {
    return { success: false, error: reasonMessages[result.reason] ?? "Nie udało się zapisać rezerwacji." };
  }

  await sendBookingEmails({
    name: data.name,
    email: data.email,
    phone: data.phone || undefined,
    seats: data.seats,
    workshopTitle: result.workshopTitle,
    startAt: result.startAt,
  });

  revalidatePath("/grafik");
  revalidatePath("/");
  revalidatePath("/warsztaty/[slug]", "page");

  return { success: true };
}
