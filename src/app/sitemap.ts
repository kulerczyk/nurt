import type { MetadataRoute } from "next";
import { getAllWorkshops } from "@/lib/workshops";
import { getSiteUrl } from "@/lib/site-url";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = getSiteUrl();
  const workshops = await getAllWorkshops();

  const staticRoutes: MetadataRoute.Sitemap = [
    "",
    "/warsztaty",
    "/kursy-certyfikowane",
    "/eventy",
    "/grafik",
    "/sklep",
    "/informacje",
    "/kontakt",
  ].map((path) => ({
    url: `${base}${path}`,
    lastModified: new Date(),
    changeFrequency: path === "" || path === "/grafik" ? "daily" : "weekly",
    priority: path === "" ? 1 : path === "/warsztaty" || path === "/grafik" ? 0.9 : 0.7,
  }));

  const workshopRoutes: MetadataRoute.Sitemap = workshops.map((w) => ({
    url: `${base}/warsztaty/${w.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  return [...staticRoutes, ...workshopRoutes];
}
