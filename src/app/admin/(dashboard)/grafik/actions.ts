"use server";

import { revalidatePath } from "next/cache";
import { createSession, updateSessionStatus, deleteSession } from "@/lib/sessions";
import { setBookingStatus } from "@/lib/bookings";
import type { SessionStatus, BookingStatus } from "@/generated/prisma/client";

export type SessionFormState = { success: true } | { success: false; error: string } | undefined;

export async function createSessionAction(
  _prev: SessionFormState,
  formData: FormData
): Promise<SessionFormState> {
  const workshopId = String(formData.get("workshopId") ?? "");
  const date = String(formData.get("date") ?? "");
  const time = String(formData.get("time") ?? "");
  const capacityRaw = String(formData.get("capacity") ?? "");
  const location = String(formData.get("location") ?? "").trim();
  const notes = String(formData.get("notes") ?? "").trim();

  if (!workshopId) return { success: false, error: "Wybierz warsztat." };
  if (!date || !time) return { success: false, error: "Podaj datę i godzinę terminu." };

  const startAt = new Date(`${date}T${time}`);
  if (Number.isNaN(startAt.getTime())) return { success: false, error: "Nieprawidłowa data lub godzina." };

  const capacity = Number.parseInt(capacityRaw, 10);
  if (!Number.isFinite(capacity) || capacity < 1) return { success: false, error: "Podaj poprawną liczbę miejsc." };

  try {
    await createSession({
      workshopId,
      startAt,
      capacity,
      location: location || undefined,
      notes: notes || undefined,
    });
  } catch (error) {
    console.error("[admin/grafik] Błąd tworzenia terminu:", error);
    return { success: false, error: "Nie udało się zapisać terminu. Spróbuj ponownie." };
  }

  revalidatePublicSessionPages();
  return { success: true };
}

function revalidatePublicSessionPages() {
  revalidatePath("/admin/grafik");
  revalidatePath("/grafik");
  revalidatePath("/");
  revalidatePath("/warsztaty/[slug]", "page");
}

export async function setSessionStatusAction(id: string, status: SessionStatus) {
  await updateSessionStatus(id, status);
  revalidatePublicSessionPages();
}

export async function deleteSessionAction(id: string) {
  await deleteSession(id);
  revalidatePublicSessionPages();
}

export async function setBookingStatusAction(id: string, status: BookingStatus) {
  await setBookingStatus(id, status);
  revalidatePublicSessionPages();
}
