import type { Metadata } from "next";
import WorkshopsListing from "@/components/sections/WorkshopsListing";

export const metadata: Metadata = {
  title: "Warsztaty — NURT Warsztaty Artystyczne",
  description:
    "Poznaj wszystkie techniki artystyczne dostępne w NURT. Malarstwo, ceramika, linoryt, sitodruk, biżuteria i wiele więcej.",
};

export default function WarsztatyPage() {
  return <WorkshopsListing />;
}
