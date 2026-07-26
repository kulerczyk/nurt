import { z } from "zod";

export const productSchema = z
  .object({
    slug: z
      .string()
      .trim()
      .min(2, "Slug musi mieć przynajmniej 2 znaki.")
      .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug może zawierać tylko małe litery, cyfry i myślniki."),
    name: z.string().trim().min(2, "Podaj nazwę produktu."),
    description: z.string().trim().min(10, "Opis jest za krótki."),
    image: z.string().trim().min(1, "Podaj link do zdjęcia (URL albo ścieżkę w /public)."),
    imageAlt: z.string().trim().min(2, "Podaj opis alternatywny zdjęcia."),
    type: z.enum(["VOUCHER", "PHYSICAL"]),
    priceZl: z.coerce.number().min(0.01, "Podaj cenę większą od zera."),
    stock: z.coerce.number().int().min(0).optional(),
    voucherValidDays: z.coerce.number().int().min(1).optional(),
    active: z.coerce.boolean().default(true),
    order: z.coerce.number().int().min(0).default(0),
  })
  .refine((data) => data.type !== "PHYSICAL" || data.stock !== undefined, {
    message: "Podaj stan magazynowy dla produktu fizycznego.",
    path: ["stock"],
  });

export type ProductFormValues = z.infer<typeof productSchema>;
