import { z } from "zod";

const baseFields = {
  name: z.string().trim().min(2, "Podaj imię i nazwisko."),
  email: z.string().trim().email("Podaj poprawny adres e-mail."),
  phone: z.string().trim().optional().or(z.literal("")),
  message: z.string().trim().min(10, "Wiadomość jest za krótka — napisz kilka słów więcej."),
  workshopSlug: z.string().trim().optional().or(z.literal("")),
  workshopTitle: z.string().trim().optional().or(z.literal("")),
};

export const individualInquirySchema = z.object({
  type: z.literal("INDIVIDUAL"),
  ...baseFields,
});

export const corporateInquirySchema = z.object({
  type: z.literal("CORPORATE"),
  ...baseFields,
  companyName: z.string().trim().min(2, "Podaj nazwę firmy."),
  groupSize: z.coerce.number().int().min(1, "Podaj liczbę uczestników.").max(500),
  preferredDate: z.string().trim().optional().or(z.literal("")),
  budget: z.string().trim().optional().or(z.literal("")),
});

export const inquirySchema = z.discriminatedUnion("type", [
  individualInquirySchema,
  corporateInquirySchema,
]);

export type InquiryFormValues = z.infer<typeof inquirySchema>;
