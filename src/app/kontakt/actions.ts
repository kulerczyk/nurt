"use server";

import { inquirySchema } from "@/lib/schemas/inquiry";
import { createInquiry } from "@/lib/inquiries";
import { sendInquiryEmails } from "@/lib/email";

export type InquiryFormState = { success: true } | { success: false; error: string } | undefined;

export async function submitInquiry(formData: FormData): Promise<InquiryFormState> {
  const raw = {
    type: formData.get("type"),
    name: formData.get("name"),
    email: formData.get("email"),
    phone: formData.get("phone"),
    message: formData.get("message"),
    workshopSlug: formData.get("workshopSlug"),
    workshopTitle: formData.get("workshopTitle"),
    companyName: formData.get("companyName"),
    groupSize: formData.get("groupSize"),
    preferredDate: formData.get("preferredDate"),
    budget: formData.get("budget"),
  };

  const parsed = inquirySchema.safeParse(raw);

  if (!parsed.success) {
    const firstIssue = parsed.error.issues[0];
    return { success: false, error: firstIssue?.message ?? "Sprawdź poprawność formularza." };
  }

  const data = parsed.data;

  const input = {
    type: data.type,
    name: data.name,
    email: data.email,
    phone: data.phone || undefined,
    message: data.message,
    workshopSlug: data.workshopSlug || undefined,
    workshopTitle: data.workshopTitle || undefined,
    ...(data.type === "CORPORATE"
      ? {
          companyName: data.companyName,
          groupSize: data.groupSize,
          preferredDate: data.preferredDate || undefined,
          budget: data.budget || undefined,
        }
      : {}),
  };

  try {
    await createInquiry(input);
  } catch (error) {
    console.error("[kontakt] Błąd zapisu zapytania do bazy:", error);
    return { success: false, error: "Coś poszło nie tak. Spróbuj ponownie za chwilę." };
  }

  await sendInquiryEmails(input);

  return { success: true };
}
