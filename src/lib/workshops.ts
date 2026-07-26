import { cache } from "react";
import { prisma } from "@/lib/db";
import type { Workshop as WorkshopRow, WorkshopCategory, Prisma } from "@/generated/prisma/client";

export type { WorkshopCategory };

export interface WorkshopSection {
  heading?: string;
  body: string;
}

export interface Workshop {
  id: string;
  slug: string;
  shortTitle: string;
  title: string;
  tagline: string;
  image: string;
  imageAlt: string;
  imageBg?: "light" | "dark";
  imagePosition?: string;
  color: string;
  category: WorkshopCategory;
  intro: string;
  sections: WorkshopSection[];
  closing: string;
  highlights: string[];
  order: number;
}

// Mapuje wiersz z bazy (Prisma) na domenowy typ Workshop używany przez UI -
// komponenty nie muszą znać szczegółów kolumn/typów Prisma.
function toWorkshop(row: WorkshopRow): Workshop {
  return {
    id: row.id,
    slug: row.slug,
    shortTitle: row.shortTitle,
    title: row.title,
    tagline: row.tagline,
    image: row.image,
    imageAlt: row.imageAlt,
    imageBg: (row.imageBg as "light" | "dark" | null) ?? undefined,
    imagePosition: row.imagePosition ?? undefined,
    color: row.color,
    category: row.category,
    intro: row.intro,
    sections: (row.sections as unknown as WorkshopSection[]) ?? [],
    closing: row.closing,
    highlights: row.highlights,
    order: row.order,
  };
}

// cache() memoizuje wywołanie w ramach jednego requestu (React Server Components) -
// layout i strona mogą bezpiecznie odpytać te same dane bez podwójnego zapytania do bazy.
export const getAllWorkshops = cache(async (): Promise<Workshop[]> => {
  const rows = await prisma.workshop.findMany({ orderBy: { order: "asc" } });
  return rows.map(toWorkshop);
});

export const getWorkshopsByCategory = cache(async (category: WorkshopCategory): Promise<Workshop[]> => {
  const rows = await prisma.workshop.findMany({ where: { category }, orderBy: { order: "asc" } });
  return rows.map(toWorkshop);
});

export const getWorkshop = cache(async (slug: string): Promise<Workshop | undefined> => {
  const row = await prisma.workshop.findUnique({ where: { slug } });
  return row ? toWorkshop(row) : undefined;
});

export async function getAllSlugs(): Promise<string[]> {
  const rows = await prisma.workshop.findMany({ select: { slug: true } });
  return rows.map((r) => r.slug);
}

export async function getOtherWorkshops(
  currentSlug: string,
  limit = 3,
  category?: WorkshopCategory
): Promise<Workshop[]> {
  const rows = await prisma.workshop.findMany({
    where: { slug: { not: currentSlug }, ...(category ? { category } : {}) },
    orderBy: { order: "asc" },
    take: limit,
  });
  return rows.map(toWorkshop);
}

// --- Zarządzanie z panelu admina (bez cache - admin zawsze ma widzieć aktualny stan) ---

export interface WorkshopInput {
  slug: string;
  shortTitle: string;
  title: string;
  tagline: string;
  image: string;
  imageAlt: string;
  imageBg?: "light" | "dark";
  imagePosition?: string;
  color: string;
  category: WorkshopCategory;
  intro: string;
  sections: WorkshopSection[];
  closing: string;
  highlights: string[];
  order: number;
}

export async function getWorkshopById(id: string): Promise<Workshop | undefined> {
  const row = await prisma.workshop.findUnique({ where: { id } });
  return row ? toWorkshop(row) : undefined;
}

export async function isSlugTaken(slug: string, excludeId?: string): Promise<boolean> {
  const row = await prisma.workshop.findUnique({ where: { slug }, select: { id: true } });
  if (!row) return false;
  return row.id !== excludeId;
}

export async function createWorkshop(input: WorkshopInput): Promise<Workshop> {
  const { sections, ...rest } = input;
  const row = await prisma.workshop.create({
    data: { ...rest, sections: sections as unknown as Prisma.InputJsonValue },
  });
  return toWorkshop(row);
}

export async function updateWorkshop(id: string, input: WorkshopInput): Promise<Workshop> {
  const { sections, ...rest } = input;
  const row = await prisma.workshop.update({
    where: { id },
    data: { ...rest, sections: sections as unknown as Prisma.InputJsonValue },
  });
  return toWorkshop(row);
}

export async function deleteWorkshop(id: string): Promise<void> {
  await prisma.workshop.delete({ where: { id } });
}

export async function countSessionsForWorkshop(id: string): Promise<number> {
  return prisma.workshopSession.count({ where: { workshopId: id } });
}
