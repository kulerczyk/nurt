import { Resend } from "resend";
import type { CreateInquiryInput } from "@/lib/inquiries";

interface BookingEmailInput {
  name: string;
  email: string;
  phone?: string;
  seats: number;
  workshopTitle: string;
  startAt: Date;
}

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

const FROM = process.env.CONTACT_FROM_EMAIL || "NURT <onboarding@resend.dev>";
const ADMIN_EMAIL = process.env.CONTACT_ADMIN_EMAIL;

function contextLines(input: CreateInquiryInput): string {
  const lines: string[] = [];
  if (input.workshopTitle) lines.push(`Warsztat: ${input.workshopTitle}`);
  if (input.type === "CORPORATE") {
    if (input.companyName) lines.push(`Firma: ${input.companyName}`);
    if (input.groupSize) lines.push(`Liczba osób: ${input.groupSize}`);
    if (input.preferredDate) lines.push(`Preferowany termin: ${input.preferredDate}`);
    if (input.budget) lines.push(`Budżet: ${input.budget}`);
  }
  if (input.phone) lines.push(`Telefon: ${input.phone}`);
  return lines.join("\n");
}

// Wysyłka e-maili jest "best effort" — brak klucza Resend albo błąd API
// nie może zablokować zapisu zapytania do bazy (to najważniejsza część).
export async function sendInquiryEmails(input: CreateInquiryInput): Promise<void> {
  if (!resend) {
    console.warn("[email] RESEND_API_KEY nie ustawiony — pomijam wysyłkę e-maili (zapytanie zapisane w bazie).");
    return;
  }

  const subject = input.type === "CORPORATE"
    ? `Nowe zapytanie grupowe/firmowe od ${input.name}`
    : `Nowe pytanie od ${input.name}${input.workshopTitle ? ` — ${input.workshopTitle}` : ""}`;

  const context = contextLines(input);

  try {
    if (ADMIN_EMAIL) {
      await resend.emails.send({
        from: FROM,
        to: ADMIN_EMAIL,
        replyTo: input.email,
        subject,
        text: [
          `Od: ${input.name} <${input.email}>`,
          context,
          "",
          "Wiadomość:",
          input.message,
        ].filter(Boolean).join("\n"),
      });
    } else {
      console.warn("[email] CONTACT_ADMIN_EMAIL nie ustawiony — pomijam powiadomienie do administratora.");
    }

    await resend.emails.send({
      from: FROM,
      to: input.email,
      subject: "Dziękujemy za wiadomość — NURT Warsztaty Artystyczne",
      text: [
        `Cześć ${input.name},`,
        "",
        "Dziękujemy za kontakt z NURT. Otrzymaliśmy Twoją wiadomość i odpowiemy najszybciej, jak możemy.",
        "",
        "Twoja wiadomość:",
        input.message,
        "",
        "Do usłyszenia,",
        "Zespół NURT",
      ].join("\n"),
    });
  } catch (error) {
    console.error("[email] Błąd podczas wysyłki powiadomienia:", error);
  }
}

function formatSessionDate(date: Date): string {
  return new Intl.DateTimeFormat("pl-PL", {
    weekday: "long", day: "2-digit", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit",
  }).format(date);
}

export async function sendBookingEmails(input: BookingEmailInput): Promise<void> {
  if (!resend) {
    console.warn("[email] RESEND_API_KEY nie ustawiony — pomijam wysyłkę e-maili o rezerwacji.");
    return;
  }

  const when = formatSessionDate(input.startAt);

  try {
    if (ADMIN_EMAIL) {
      await resend.emails.send({
        from: FROM,
        to: ADMIN_EMAIL,
        replyTo: input.email,
        subject: `Nowa rezerwacja: ${input.workshopTitle} — ${input.name}`,
        text: [
          `Warsztat: ${input.workshopTitle}`,
          `Termin: ${when}`,
          `Liczba miejsc: ${input.seats}`,
          "",
          `Osoba: ${input.name} <${input.email}>`,
          input.phone ? `Telefon: ${input.phone}` : "",
        ].filter(Boolean).join("\n"),
      });
    } else {
      console.warn("[email] CONTACT_ADMIN_EMAIL nie ustawiony — pomijam powiadomienie do administratora.");
    }

    await resend.emails.send({
      from: FROM,
      to: input.email,
      subject: `Potwierdzenie rezerwacji — ${input.workshopTitle}`,
      text: [
        `Cześć ${input.name},`,
        "",
        `Twoje miejsce na warsztacie „${input.workshopTitle}” jest zarezerwowane.`,
        "",
        `Termin: ${when}`,
        `Liczba miejsc: ${input.seats}`,
        "",
        "Do zobaczenia na warsztacie!",
        "Zespół NURT",
      ].join("\n"),
    });
  } catch (error) {
    console.error("[email] Błąd podczas wysyłki potwierdzenia rezerwacji:", error);
  }
}
