"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

interface Props {
  newInquiriesCount: number;
}

const links = [
  { href: "/admin", label: "Warsztaty" },
  { href: "/admin/grafik", label: "Grafik" },
  { href: "/admin/produkty", label: "Produkty" },
  { href: "/admin/zamowienia", label: "Zamówienia" },
  { href: "/admin/wiadomosci", label: "Wiadomości" },
];

export default function AdminNav({ newInquiriesCount }: Props) {
  const pathname = usePathname();

  return (
    <nav className="flex items-center gap-1">
      {links.map((link) => {
        const active =
          pathname === link.href ||
          (link.href === "/admin" && pathname.startsWith("/admin/warsztaty")) ||
          (link.href === "/admin/produkty" && pathname.startsWith("/admin/produkty")) ||
          (link.href === "/admin/zamowienia" && pathname.startsWith("/admin/zamowienia"));
        return (
          <Link
            key={link.href}
            href={link.href}
            className={[
              "relative px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-300",
              active ? "bg-heather-400 text-white" : "text-stone-600 hover:bg-heather-50 hover:text-heather-800",
            ].join(" ")}
          >
            {link.label}
            {link.href === "/admin/wiadomosci" && newInquiriesCount > 0 && (
              <span
                className={[
                  "ml-1.5 inline-flex items-center justify-center min-w-[1.25rem] h-5 px-1 rounded-full text-xs font-semibold",
                  active ? "bg-white text-heather-700" : "bg-heather-100 text-heather-700",
                ].join(" ")}
              >
                {newInquiriesCount}
              </span>
            )}
          </Link>
        );
      })}
    </nav>
  );
}
