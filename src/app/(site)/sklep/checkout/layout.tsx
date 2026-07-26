import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Zamówienie",
  description: "Finalizacja zamówienia w sklepie NURT.",
  robots: { index: false, follow: false },
};

export default function CheckoutLayout({ children }: { children: React.ReactNode }) {
  return children;
}
