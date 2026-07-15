import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pl">
      <body className="min-h-screen flex flex-col bg-white">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
