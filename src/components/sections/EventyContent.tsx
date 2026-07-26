"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import ContactForm from "@/components/sections/ContactForm";
import type { Workshop } from "@/lib/workshops";

function FadeUp({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay, duration: 0.7, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

const offerCards = [
  {
    title: "Integracje i eventy firmowe",
    text: "Warsztat kreatywny to naturalna alternatywa dla klasycznej integracji - zespół wspólnie tworzy, rozmawia i odpoczywa od ekranów. Dopasowujemy technikę, długość i formę spotkania do wielkości grupy i charakteru wydarzenia.",
  },
  {
    title: "Oferta indywidualna",
    text: "Prywatne warsztaty dla dwóch osób, wieczór panieński, urodziny albo spotkanie w gronie znajomych - jeśli szukasz czegoś kameralnego i dopasowanego do okazji, przygotujemy propozycję specjalnie dla Was.",
  },
];

export default function EventyContent({ offerings }: { offerings: Workshop[] }) {
  return (
    <div className="pt-28 pb-24">
      <div className="max-w-6xl mx-auto px-6">

        {/* Header */}
        <div className="mb-16 max-w-2xl">
          <motion.span className="section-label block mb-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6 }}>
            Oferta
          </motion.span>
          <motion.h1
            className="font-serif text-5xl md:text-6xl font-semibold text-stone-900 leading-[1.1] mb-6"
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1, duration: 0.8, ease: "easeOut" }}
          >
            Eventy i oferta indywidualna
          </motion.h1>
          <motion.p
            className="text-stone-500 text-lg leading-relaxed"
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.7, ease: "easeOut" }}
          >
            NURT to nie tylko miejsce naszych warsztatów - to także otwarta przestrzeń dla
            grup firmowych, prywatnych spotkań i wydarzeń kreatywnych szytych na miarę.
          </motion.p>
        </div>

        {/* Two offer cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-20">
          {offerCards.map((card, i) => (
            <FadeUp key={card.title} delay={i * 0.1}>
              <div className="h-full rounded-3xl bg-white border border-heather-100 p-8">
                <span
                  className="inline-block w-10 h-10 mb-5 bg-heather-100"
                  style={{ borderRadius: "62% 38% 54% 46% / 44% 58% 42% 56%" }}
                />
                <h3 className="font-serif text-xl font-semibold text-stone-900 mb-3">{card.title}</h3>
                <p className="text-stone-500 leading-relaxed">{card.text}</p>
              </div>
            </FadeUp>
          ))}
        </div>

        {/* Optional: specific EVENT-category offerings, if any exist */}
        {offerings.length > 0 && (
          <div className="mb-20">
            <FadeUp><h2 className="font-serif text-2xl font-semibold text-stone-800 mb-6">Gotowe propozycje</h2></FadeUp>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {offerings.map((w, i) => (
                <FadeUp key={w.slug} delay={i * 0.06}>
                  <Link
                    href={`/warsztaty/${w.slug}`}
                    className="group block rounded-3xl overflow-hidden border border-heather-100 hover:border-heather-300 hover:shadow-lg hover:shadow-heather-100/60 transition-all duration-500 bg-white h-full"
                  >
                    <div className="relative h-44 overflow-hidden">
                      <Image src={w.image} alt={w.imageAlt} fill className="object-cover object-center group-hover:scale-105 transition-transform duration-700" />
                      <div className="absolute inset-0 bg-gradient-to-t from-white/60 to-transparent" />
                    </div>
                    <div className="p-6">
                      <h3 className="font-serif text-lg font-semibold text-stone-800 group-hover:text-heather-800 transition-colors duration-300 mb-2">{w.shortTitle}</h3>
                      <p className="text-sm text-stone-500 leading-relaxed line-clamp-2">{w.intro}</p>
                    </div>
                  </Link>
                </FadeUp>
              ))}
            </div>
          </div>
        )}

        {/* Corporate inquiry form */}
        <FadeUp>
          <div className="rounded-4xl bg-white border border-heather-100 shadow-sm shadow-heather-100/40 p-6 md:p-10 max-w-3xl mx-auto">
            <span className="section-label block mb-3">Opowiedz nam o wydarzeniu</span>
            <h2 className="font-serif text-2xl md:text-3xl font-semibold text-stone-900 mb-6">Zapytaj o wolny termin</h2>
            <ContactForm defaultType="CORPORATE" />
          </div>
        </FadeUp>

      </div>
    </div>
  );
}
