"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { workshopSchema } from "@/lib/schemas/workshop";
import {
  createWorkshop,
  updateWorkshop,
  deleteWorkshop,
  isSlugTaken,
  countSessionsForWorkshop,
} from "@/lib/workshops";

export type WorkshopFormState = { success: true } | { success: false; error: string } | undefined;

function parseWorkshopFormData(formData: FormData) {
  let sections: unknown = [];
  let highlights: unknown = [];
  try {
    sections = JSON.parse(String(formData.get("sectionsJson") ?? "[]"));
  } catch {
    sections = [];
  }
  try {
    highlights = JSON.parse(String(formData.get("highlightsJson") ?? "[]"));
  } catch {
    highlights = [];
  }

  return {
    slug: formData.get("slug"),
    shortTitle: formData.get("shortTitle"),
    title: formData.get("title"),
    tagline: formData.get("tagline"),
    image: formData.get("image"),
    imageAlt: formData.get("imageAlt"),
    imageBg: formData.get("imageBg"),
    imagePosition: formData.get("imagePosition"),
    color: formData.get("color"),
    intro: formData.get("intro"),
    sections,
    closing: formData.get("closing"),
    highlights,
    order: formData.get("order"),
  };
}

function revalidateWorkshopPages() {
  revalidatePath("/admin");
  revalidatePath("/admin/grafik");
  revalidatePath("/");
  revalidatePath("/warsztaty");
  revalidatePath("/warsztaty/[slug]", "page");
}

export async function createWorkshopAction(_prev: WorkshopFormState, formData: FormData): Promise<WorkshopFormState> {
  const parsed = workshopSchema.safeParse(parseWorkshopFormData(formData));
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "Sprawdź poprawność formularza." };
  }

  if (await isSlugTaken(parsed.data.slug)) {
    return { success: false, error: `Warsztat o adresie „${parsed.data.slug}” już istnieje — wybierz inny.` };
  }

  try {
    await createWorkshop(parsed.data);
  } catch (error) {
    console.error("[admin/warsztaty] Błąd tworzenia warsztatu:", error);
    return { success: false, error: "Nie udało się zapisać warsztatu. Spróbuj ponownie." };
  }

  revalidateWorkshopPages();
  redirect("/admin");
}

export async function updateWorkshopAction(
  id: string,
  _prev: WorkshopFormState,
  formData: FormData
): Promise<WorkshopFormState> {
  const parsed = workshopSchema.safeParse(parseWorkshopFormData(formData));
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "Sprawdź poprawność formularza." };
  }

  if (await isSlugTaken(parsed.data.slug, id)) {
    return { success: false, error: `Warsztat o adresie „${parsed.data.slug}” już istnieje — wybierz inny.` };
  }

  try {
    await updateWorkshop(id, parsed.data);
  } catch (error) {
    console.error("[admin/warsztaty] Błąd edycji warsztatu:", error);
    return { success: false, error: "Nie udało się zapisać zmian. Spróbuj ponownie." };
  }

  revalidateWorkshopPages();
  redirect("/admin");
}

export async function deleteWorkshopAction(id: string): Promise<{ success: true } | { success: false; error: string }> {
  const sessionsCount = await countSessionsForWorkshop(id);
  if (sessionsCount > 0) {
    return {
      success: false,
      error: `Nie można usunąć — ten warsztat ma ${sessionsCount} ${sessionsCount === 1 ? "termin" : "terminów"} w grafiku (wraz z ewentualnymi rezerwacjami). Usuń najpierw te terminy w zakładce „Grafik”.`,
    };
  }

  try {
    await deleteWorkshop(id);
  } catch (error) {
    console.error("[admin/warsztaty] Błąd usuwania warsztatu:", error);
    return { success: false, error: "Nie udało się usunąć warsztatu." };
  }

  revalidateWorkshopPages();
  return { success: true };
}
