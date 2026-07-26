import type { Metadata } from "next";
import "../globals.css";

// Osobny root layout dla /admin - panel ma własną nawigację (AdminNav) i nie
// pokazuje publicznego Navbara/Footera strony, żeby nie było dwóch, mylących
// się nawigacji (np. dwóch linków "Grafik" prowadzących w różne miejsca).
export const metadata: Metadata = {
  title: "Panel",
  robots: { index: false, follow: false },
};

export default function AdminRootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pl">
      <body className="min-h-screen bg-white">{children}</body>
    </html>
  );
}
