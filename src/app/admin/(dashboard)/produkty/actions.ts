"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { productSchema } from "@/lib/schemas/product";
import {
  createProduct,
  updateProduct,
  deleteProduct,
  isProductSlugTaken,
  countOrderItemsForProduct,
  type ProductInput,
} from "@/lib/products";

export type ProductFormState = { success: true } | { success: false; error: string } | undefined;

function parseProductFormData(formData: FormData) {
  return {
    slug: formData.get("slug"),
    name: formData.get("name"),
    description: formData.get("description"),
    image: formData.get("image"),
    imageAlt: formData.get("imageAlt"),
    type: formData.get("type"),
    priceZl: formData.get("priceZl"),
    stock: formData.get("stock") || undefined,
    voucherValidDays: formData.get("voucherValidDays") || undefined,
    active: formData.get("active") === "on",
    order: formData.get("order"),
  };
}

function toProductInput(data: ReturnType<typeof productSchema.parse>): ProductInput {
  return {
    slug: data.slug,
    name: data.name,
    description: data.description,
    image: data.image,
    imageAlt: data.imageAlt,
    type: data.type,
    priceCents: Math.round(data.priceZl * 100),
    stock: data.type === "PHYSICAL" ? data.stock : undefined,
    voucherValidDays: data.type === "VOUCHER" ? data.voucherValidDays : undefined,
    active: data.active,
    order: data.order,
  };
}

function revalidateProductPages() {
  revalidatePath("/admin/produkty");
  revalidatePath("/sklep");
}

export async function createProductAction(_prev: ProductFormState, formData: FormData): Promise<ProductFormState> {
  const parsed = productSchema.safeParse(parseProductFormData(formData));
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "Sprawdź poprawność formularza." };
  }

  if (await isProductSlugTaken(parsed.data.slug)) {
    return { success: false, error: `Produkt o adresie „${parsed.data.slug}” już istnieje - wybierz inny.` };
  }

  try {
    await createProduct(toProductInput(parsed.data));
  } catch (error) {
    console.error("[admin/produkty] Błąd tworzenia produktu:", error);
    return { success: false, error: "Nie udało się zapisać produktu. Spróbuj ponownie." };
  }

  revalidateProductPages();
  redirect("/admin/produkty");
}

export async function updateProductAction(
  id: string,
  _prev: ProductFormState,
  formData: FormData
): Promise<ProductFormState> {
  const parsed = productSchema.safeParse(parseProductFormData(formData));
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "Sprawdź poprawność formularza." };
  }

  if (await isProductSlugTaken(parsed.data.slug, id)) {
    return { success: false, error: `Produkt o adresie „${parsed.data.slug}” już istnieje - wybierz inny.` };
  }

  try {
    await updateProduct(id, toProductInput(parsed.data));
  } catch (error) {
    console.error("[admin/produkty] Błąd edycji produktu:", error);
    return { success: false, error: "Nie udało się zapisać zmian. Spróbuj ponownie." };
  }

  revalidateProductPages();
  redirect("/admin/produkty");
}

export async function deleteProductAction(id: string): Promise<{ success: true } | { success: false; error: string }> {
  const usedInOrders = await countOrderItemsForProduct(id);
  if (usedInOrders > 0) {
    return {
      success: false,
      error: `Nie można usunąć - ten produkt występuje w ${usedInOrders} istniejących zamówieniach. Możesz go zamiast tego dezaktywować.`,
    };
  }

  try {
    await deleteProduct(id);
  } catch (error) {
    console.error("[admin/produkty] Błąd usuwania produktu:", error);
    return { success: false, error: "Nie udało się usunąć produktu." };
  }

  revalidateProductPages();
  return { success: true };
}
