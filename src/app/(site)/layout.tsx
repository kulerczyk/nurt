import type { Metadata } from "next";
import "../globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { CartProvider } from "@/components/shop/CartProvider";
import { getWorkshopsByCategory } from "@/lib/workshops";
import { getSiteUrl } from "@/lib/site-url";

const siteUrl = getSiteUrl();

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "NURT - Warsztaty Artystyczne",
    template: "%s | NURT",
  },
  description:
    "Warsztaty artystyczne w Warszawie - linoryt, sitodruk, ceramika, malowanie na tekstyliach i więcej. Przestrzeń odkrywania i twórczości NURT.",
  keywords: [
    "warsztaty artystyczne",
    "warsztaty Warszawa",
    "linoryt",
    "sitodruk",
    "ceramika",
    "druk artystyczny",
    "kursy artystyczne",
    "NURT",
    "Konstruktorska",
  ],
  authors: [{ name: "NURT Warsztaty Artystyczne" }],
  openGraph: {
    title: "NURT - Warsztaty Artystyczne",
    description:
      "Przestrzeń odkrywania, eksperymentowania i rozwijania własnej kreatywności. Warsztaty w Warszawie.",
    type: "website",
    locale: "pl_PL",
    siteName: "NURT",
    url: siteUrl,
  },
  twitter: {
    card: "summary_large_image",
    title: "NURT - Warsztaty Artystyczne",
    description:
      "Warsztaty artystyczne w Warszawie - linoryt, sitodruk, ceramika i więcej.",
  },
  alternates: {
    canonical: "/",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default async function SiteLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const workshops = await getWorkshopsByCategory("WARSZTAT");
  const navWorkshops = workshops.map((w) => ({ slug: w.slug, shortTitle: w.shortTitle }));

  return (
    <html lang="pl">
      <body className="min-h-screen flex flex-col bg-white">
        <CartProvider>
          <Navbar workshops={navWorkshops} />
          <main className="flex-1">{children}</main>
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}
