import { z } from "zod";

export const bookingSchema = z.object({
  sessionId: z.string().trim().min(1, "Brak wybranego terminu."),
  name: z.string().trim().min(2, "Podaj imię i nazwisko."),
  email: z.string().trim().email("Podaj poprawny adres e-mail."),
  phone: z.string().trim().optional().or(z.literal("")),
  seats: z.coerce.number().int().min(1, "Podaj liczbę miejsc.").max(20, "Maksymalnie 20 miejsc w jednej rezerwacji."),
  notes: z.string().trim().max(1000).optional().or(z.literal("")),
});

export type BookingFormValues = z.infer<typeof bookingSchema>;
