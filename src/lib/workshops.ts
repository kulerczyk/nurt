import { cache } from "react";
import { prisma } from "@/lib/db";
import type { Workshop as WorkshopRow } from "@/generated/prisma/client";

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
  intro: string;
  sections: WorkshopSection[];
  closing: string;
  highlights: string[];
}

// Mapuje wiersz z bazy (Prisma) na domenowy typ Workshop używany przez UI —
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
    intro: row.intro,
    sections: (row.sections as unknown as WorkshopSection[]) ?? [],
    closing: row.closing,
    highlights: row.highlights,
  };
}

// cache() memoizuje wywołanie w ramach jednego requestu (React Server Components) —
// layout i strona mogą bezpiecznie odpytać te same dane bez podwójnego zapytania do bazy.
export const getAllWorkshops = cache(async (): Promise<Workshop[]> => {
  const rows = await prisma.workshop.findMany({ orderBy: { order: "asc" } });
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

export async function getOtherWorkshops(currentSlug: string, limit = 3): Promise<Workshop[]> {
  const rows = await prisma.workshop.findMany({
    where: { slug: { not: currentSlug } },
    orderBy: { order: "asc" },
    take: limit,
  });
  return rows.map(toWorkshop);
}
