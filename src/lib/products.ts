import { cache } from "react";
import { prisma } from "@/lib/db";
import type { Product as ProductRow, ProductType } from "@/generated/prisma/client";

export interface Product {
  id: string;
  slug: string;
  name: string;
  description: string;
  image: string;
  imageAlt: string;
  type: ProductType;
  priceCents: number;
  stock: number | null;
  voucherValidDays: number | null;
  active: boolean;
  order: number;
}

function toProduct(row: ProductRow): Product {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    description: row.description,
    image: row.image,
    imageAlt: row.imageAlt,
    type: row.type,
    priceCents: row.priceCents,
    stock: row.stock,
    voucherValidDays: row.voucherValidDays,
    active: row.active,
    order: row.order,
  };
}

// cache() memoizuje w ramach jednego requestu (RSC) — bezpieczne przy
// wielokrotnym odczycie tych samych danych na jednej stronie.
export const getActiveProducts = cache(async (): Promise<Product[]> => {
  const rows = await prisma.product.findMany({
    where: { active: true },
    orderBy: { order: "asc" },
  });
  return rows.map(toProduct);
});

export const getProductBySlug = cache(async (slug: string): Promise<Product | undefined> => {
  const row = await prisma.product.findUnique({ where: { slug } });
  return row ? toProduct(row) : undefined;
});

export async function getProductById(id: string): Promise<Product | undefined> {
  const row = await prisma.product.findUnique({ where: { id } });
  return row ? toProduct(row) : undefined;
}

export async function getManyProductsByIds(ids: string[]): Promise<Product[]> {
  if (ids.length === 0) return [];
  const rows = await prisma.product.findMany({ where: { id: { in: ids } } });
  return rows.map(toProduct);
}

// --- Zarządzanie z panelu admina ---

export async function getAllProductsForAdmin(): Promise<Product[]> {
  const rows = await prisma.product.findMany({ orderBy: { order: "asc" } });
  return rows.map(toProduct);
}

export interface ProductInput {
  slug: string;
  name: string;
  description: string;
  image: string;
  imageAlt: string;
  type: ProductType;
  priceCents: number;
  stock?: number;
  voucherValidDays?: number;
  active: boolean;
  order: number;
}

export async function isProductSlugTaken(slug: string, excludeId?: string): Promise<boolean> {
  const row = await prisma.product.findUnique({ where: { slug }, select: { id: true } });
  if (!row) return false;
  return row.id !== excludeId;
}

export async function createProduct(input: ProductInput): Promise<Product> {
  const row = await prisma.product.create({ data: input });
  return toProduct(row);
}

export async function updateProduct(id: string, input: ProductInput): Promise<Product> {
  const row = await prisma.product.update({ where: { id }, data: input });
  return toProduct(row);
}

export async function deleteProduct(id: string): Promise<void> {
  await prisma.product.delete({ where: { id } });
}

export async function countOrderItemsForProduct(id: string): Promise<number> {
  return prisma.orderItem.count({ where: { productId: id } });
}

// Zmniejsza stan magazynowy — używane przy oznaczaniu zamówienia jako opłacone.
// Bezpieczne wielokrotne wywołanie: jeśli stock jest null (brak śledzenia), nic nie robi.
export async function decrementStock(productId: string, quantity: number): Promise<void> {
  await prisma.product.updateMany({
    where: { id: productId, stock: { not: null } },
    data: { stock: { decrement: quantity } },
  });
}
