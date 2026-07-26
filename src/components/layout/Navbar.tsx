"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "@/components/shop/CartProvider";

export interface NavWorkshop {
  slug: string;
  shortTitle: string;
}

const categories = [
  { label: "Wszystkie warsztaty", href: "/warsztaty" },
  { label: "Kursy Certyfikowane", href: "/kursy-certyfikowane" },
  { label: "Oferta indywidualna oraz Eventy", href: "/eventy" },
];

const navItems = [
  { label: "Warsztaty i kursy", href: "/warsztaty", hasMega: true },
  { label: "Sklep", href: "/sklep" },
  { label: "Informacje", href: "/informacje" },
  { label: "Grafik", href: "/grafik" },
];

const megaVariants = {
  hidden: {
    opacity: 0,
    y: -8,
    scale: 0.98,
    transition: { duration: 0.2, ease: "easeOut" as const },
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.35, ease: "easeOut" as const },
  },
};

function CartLink({ className = "" }: { className?: string }) {
  const { count } = useCart();
  return (
    <Link
      href="/sklep/koszyk"
      aria-label="Koszyk"
      className={`relative flex items-center justify-center w-10 h-10 rounded-full text-stone-700 hover:bg-heather-50 hover:text-heather-800 transition-all duration-300 ${className}`}
    >
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="9" cy="21" r="1" />
        <circle cx="20" cy="21" r="1" />
        <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
      </svg>
      {count > 0 && (
        <span className="absolute -top-0.5 -right-0.5 min-w-[1.1rem] h-[1.1rem] px-1 rounded-full bg-heather-500 text-white text-[0.65rem] font-semibold flex items-center justify-center">
          {count}
        </span>
      )}
    </Link>
  );
}

export default function Navbar({ workshops }: { workshops: NavWorkshop[] }) {
  const [megaOpen, setMegaOpen] = useState(false);
  const [activeItem, setActiveItem] = useState("Warsztaty i kursy");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileWorkshopsOpen, setMobileWorkshopsOpen] = useState(false);
  const closeTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const openMega = () => {
    if (closeTimeout.current) clearTimeout(closeTimeout.current);
    setMegaOpen(true);
  };

  const scheduleMegaClose = () => {
    closeTimeout.current = setTimeout(() => setMegaOpen(false), 140);
  };

  useEffect(() => {
    return () => {
      if (closeTimeout.current) clearTimeout(closeTimeout.current);
    };
  }, []);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-heather-100">
      <nav className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">

        {/* Logo */}
        <Link
          href="/"
          className="font-serif text-xl font-semibold tracking-widest text-stone-900 hover:text-heather-600 transition-colors duration-[400ms]"
          onClick={() => { setActiveItem(""); setMegaOpen(false); }}
        >
          NURT
        </Link>

        {/* Desktop Nav */}
        <ul className="hidden md:flex items-center gap-1" role="menubar">
          {navItems.map((item) => (
            <li
              key={item.label}
              role="none"
              className="relative"
              onMouseEnter={() => item.hasMega && openMega()}
              onMouseLeave={() => item.hasMega && scheduleMegaClose()}
            >
              <div
                className={[
                  "blob-pill cursor-pointer select-none whitespace-nowrap",
                  activeItem === item.label ? "active" : "",
                ].join(" ")}
                onClick={() => setActiveItem(item.label)}
              >
                <Link href={item.href} role="menuitem" style={{ color: "inherit" }}>
                  {item.label}
                </Link>
              </div>
            </li>
          ))}
        </ul>

        {/* CTA */}
        <div className="hidden md:flex items-center gap-2">
          <CartLink />
          <Link
            href="/kontakt"
            className="text-[0.875rem] font-medium text-heather-700 border border-heather-300 px-4 py-1.5 rounded-full
                       hover:bg-heather-500 hover:text-white hover:border-heather-500
                       transition-all duration-[400ms]"
          >
            Zapisz się
          </Link>
        </div>

        {/* Mobile: cart + hamburger */}
        <div className="md:hidden flex items-center">
          <CartLink />
          <button
            className="flex flex-col gap-1.5 p-2"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Menu"
          >
            <span className={`block w-5 h-0.5 bg-stone-800 transition-all duration-300 ${mobileOpen ? "rotate-45 translate-y-2" : ""}`} />
            <span className={`block w-5 h-0.5 bg-stone-800 transition-all duration-300 ${mobileOpen ? "opacity-0" : ""}`} />
            <span className={`block w-5 h-0.5 bg-stone-800 transition-all duration-300 ${mobileOpen ? "-rotate-45 -translate-y-2" : ""}`} />
          </button>
        </div>
      </nav>

      {/* Mega menu — full width panel */}
      <AnimatePresence>
        {megaOpen && (
          <motion.div
            variants={megaVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            className="absolute top-full left-0 right-0 bg-white border-b border-heather-100 shadow-lg shadow-heather-200/30"
            onMouseEnter={openMega}
            onMouseLeave={scheduleMegaClose}
          >
            <div className="max-w-6xl mx-auto px-6 py-8">
              <div className="grid grid-cols-3 gap-10">

                {/* Column 1 — Categories */}
                <div>
                  <p className="section-label mb-4">Oferta</p>
                  <ul className="space-y-1">
                    {categories.map((cat) => (
                      <li key={cat.label}>
                        <Link
                          href={cat.href}
                          onClick={() => setMegaOpen(false)}
                          className="block px-3 py-2.5 rounded-2xl text-sm font-medium text-stone-700
                                     hover:bg-heather-50 hover:text-heather-800
                                     transition-all duration-300"
                        >
                          {cat.label}
                        </Link>
                      </li>
                    ))}
                  </ul>

                  {/* Organic divider */}
                  <div className="my-5">
                    <svg viewBox="0 0 200 8" fill="none" className="w-full">
                      <path d="M0,4 C40,1 80,7 120,4 C160,1 180,6 200,4"
                        stroke="url(#navGrad)" strokeWidth="1" strokeLinecap="round" fill="none" />
                      <defs>
                        <linearGradient id="navGrad" x1="0" y1="0" x2="200" y2="0" gradientUnits="userSpaceOnUse">
                          <stop offset="0%" stopColor="#6294b5" />
                          <stop offset="100%" stopColor="#b5cfe2" stopOpacity="0.3" />
                        </linearGradient>
                      </defs>
                    </svg>
                  </div>

                  <Link
                    href="/kontakt"
                    onClick={() => setMegaOpen(false)}
                    className="blob-btn text-xs px-5 py-2 inline-flex"
                    style={{ fontSize: "0.8rem" }}
                  >
                    Zapisz się na warsztat
                  </Link>
                </div>

                {/* Column 2 — Workshops list (first 4) */}
                <div>
                  <p className="section-label mb-4">Techniki</p>
                  <ul className="space-y-0.5">
                    {workshops.slice(0, 4).map((w) => (
                      <li key={w.slug}>
                        <Link
                          href={`/warsztaty/${w.slug}`}
                          onClick={() => setMegaOpen(false)}
                          className="group flex items-center gap-3 px-3 py-2.5 rounded-2xl
                                     hover:bg-heather-50 transition-all duration-300"
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-heather-300 group-hover:bg-heather-500 transition-colors duration-300 flex-shrink-0" />
                          <span className="text-sm font-medium text-stone-700 group-hover:text-heather-800 transition-colors duration-300">
                            {w.shortTitle}
                          </span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Column 3 — Workshops list (last 4) */}
                <div>
                  <p className="section-label mb-4">Techniki</p>
                  <ul className="space-y-0.5">
                    {workshops.slice(4).map((w) => (
                      <li key={w.slug}>
                        <Link
                          href={`/warsztaty/${w.slug}`}
                          onClick={() => setMegaOpen(false)}
                          className="group flex items-center gap-3 px-3 py-2.5 rounded-2xl
                                     hover:bg-heather-50 transition-all duration-300"
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-heather-300 group-hover:bg-heather-500 transition-colors duration-300 flex-shrink-0" />
                          <span className="text-sm font-medium text-stone-700 group-hover:text-heather-800 transition-colors duration-300">
                            {w.shortTitle}
                          </span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>

              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="md:hidden overflow-hidden bg-white border-t border-heather-100"
          >
            <ul className="px-6 py-4 space-y-1">
              <li>
                <button
                  onClick={() => setMobileWorkshopsOpen(!mobileWorkshopsOpen)}
                  className="w-full text-left py-2.5 text-stone-700 font-medium border-b border-heather-100 flex items-center justify-between"
                >
                  Warsztaty i kursy
                  <span className={`transition-transform duration-300 text-heather-400 ${mobileWorkshopsOpen ? "rotate-180" : ""}`}>
                    ↓
                  </span>
                </button>
                <AnimatePresence>
                  {mobileWorkshopsOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: "easeOut" }}
                      className="overflow-hidden"
                    >
                      <div className="pl-4 py-2">
                        <p className="section-label mb-2">Oferta</p>
                        {categories.map((cat) => (
                          <Link
                            key={cat.label}
                            href={cat.href}
                            className="block py-1.5 text-sm text-stone-600"
                            onClick={() => setMobileOpen(false)}
                          >
                            {cat.label}
                          </Link>
                        ))}
                        <p className="section-label mt-3 mb-2">Techniki</p>
                        {workshops.map((w) => (
                          <Link
                            key={w.slug}
                            href={`/warsztaty/${w.slug}`}
                            className="block py-1.5 text-sm text-heather-700"
                            onClick={() => setMobileOpen(false)}
                          >
                            {w.shortTitle}
                          </Link>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </li>
              {navItems.slice(1).map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    className="block py-2.5 text-stone-700 font-medium border-b border-heather-100 last:border-0"
                    onClick={() => setMobileOpen(false)}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
              <li className="pt-3">
                <Link
                  href="/kontakt"
                  className="block text-center py-2.5 text-heather-700 border border-heather-300 rounded-full font-medium"
                  onClick={() => setMobileOpen(false)}
                >
                  Zapisz się
                </Link>
              </li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
