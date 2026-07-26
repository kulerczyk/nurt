import type { Metadata } from "next";
import "../globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { CartProvider } from "@/components/shop/CartProvider";
import { getAllWorkshops } from "@/lib/workshops";

export const metadata: Metadata = {
  title: "NURT — Warsztaty Artystyczne",
  description:
    "Tak jak nurt rzeki nieustannie zmienia swój bieg, tak twórczość prowadzi nas wciąż nowymi ścieżkami. Odkryj warsztaty artystyczne NURT.",
  keywords: ["warsztaty artystyczne", "introligatorstwo", "druk artystyczny", "kursy", "Kraków"],
  openGraph: {
    title: "NURT — Warsztaty Artystyczne",
    description: "Przestrzeń odkrywania, eksperymentowania i rozwijania własnej kreatywności.",
    type: "website",
  },
};

export default async function SiteLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const workshops = await getAllWorkshops();
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
