import { z } from "zod";

export const workshopSectionSchema = z.object({
  heading: z.string().trim().optional(),
  body: z.string().trim().min(1, "Treść sekcji nie może być pusta."),
});

export const workshopSchema = z.object({
  slug: z
    .string()
    .trim()
    .min(2, "Slug musi mieć przynajmniej 2 znaki.")
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug może zawierać tylko małe litery, cyfry i myślniki (np. „linoryt” albo „malowanie-na-tkaninach”)."),
  shortTitle: z.string().trim().min(2, "Podaj krótką nazwę (widoczną w menu i na kartach)."),
  title: z.string().trim().min(2, "Podaj pełny tytuł warsztatu."),
  tagline: z.string().trim().min(2, "Podaj krótki podtytuł/hasło."),
  image: z.string().trim().min(1, "Podaj link do zdjęcia (URL albo ścieżkę w /public)."),
  imageAlt: z.string().trim().min(2, "Podaj opis alternatywny zdjęcia (dla dostępności/SEO)."),
  imageBg: z.enum(["light", "dark", ""]).optional().transform((v) => (v ? v : undefined)),
  imagePosition: z.string().trim().optional().transform((v) => (v ? v : undefined)),
  color: z.string().trim().min(1, "Wybierz kolor akcentu."),
  category: z.enum(["WARSZTAT", "KURS_CERTYFIKOWANY", "EVENT"]).default("WARSZTAT"),
  intro: z.string().trim().min(10, "Wstęp jest za krótki."),
  sections: z.array(workshopSectionSchema).min(1, "Dodaj przynajmniej jedną sekcję opisu."),
  closing: z.string().trim().min(5, "Podaj krótkie podsumowanie."),
  highlights: z.array(z.string().trim().min(1)).min(1, "Dodaj przynajmniej jeden punkt „czego się nauczysz”."),
  order: z.coerce.number().int().min(0).default(0),
});

export type WorkshopFormValues = z.infer<typeof workshopSchema>;
