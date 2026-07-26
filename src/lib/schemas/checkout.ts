import { z } from "zod";

export const cartItemSchema = z.object({
  productId: z.string().trim().min(1),
  quantity: z.coerce.number().int().min(1).max(20),
});

export const checkoutSchema = z
  .object({
    customerName: z.string().trim().min(2, "Podaj imię i nazwisko."),
    customerEmail: z.string().trim().email("Podaj poprawny adres e-mail."),
    customerPhone: z.string().trim().optional().or(z.literal("")),
    deliveryMethod: z.enum(["PICKUP", "COURIER"]),
    shippingAddress: z.string().trim().max(500).optional().or(z.literal("")),
    notes: z.string().trim().max(1000).optional().or(z.literal("")),
    voucherRecipientName: z.string().trim().max(120).optional().or(z.literal("")),
    voucherMessage: z.string().trim().max(500).optional().or(z.literal("")),
    items: z.array(cartItemSchema).min(1, "Koszyk jest pusty."),
  })
  .refine((data) => data.deliveryMethod !== "COURIER" || (data.shippingAddress?.trim().length ?? 0) > 5, {
    message: "Podaj adres dostawy.",
    path: ["shippingAddress"],
  });

export type CheckoutFormValues = z.infer<typeof checkoutSchema>;
