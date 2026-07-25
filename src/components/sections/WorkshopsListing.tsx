"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
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

export default function WorkshopsListing({ workshops }: { workshops: Workshop[] }) {
  return (
    <div className="pt-28 pb-24">
      <div className="max-w-6xl mx-auto px-6">

        {/* Header */}
        <div className="mb-16 max-w-2xl">
          <motion.span
            className="section-label block mb-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
            Oferta
          </motion.span>
          <motion.h1
            className="font-serif text-5xl md:text-6xl font-semibold text-stone-900 leading-[1.1] mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.8, ease: "easeOut" }}
          >
            Nasze warsztaty
          </motion.h1>
          <motion.p
            className="text-stone-500 text-lg leading-relaxed"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.7, ease: "easeOut" }}
          >
            Od linorytu i sitodruku, przez ceramikę i biżuterię, aż po malarstwo i rzeźbę.
            Każda technika to nowa ścieżka — wybierz tę, która płynie z Twoim nurtem.
          </motion.p>
        </div>

        {/* Organic divider */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="mb-16"
        >
          <svg viewBox="0 0 800 12" fill="none" className="w-full max-w-lg">
            <path d="M0,6 C120,2 240,10 360,5 C480,0 600,9 720,5 C760,3 780,7 800,6"
              stroke="url(#listGrad)" strokeWidth="1.5" strokeLinecap="round" fill="none" />
            <defs>
              <linearGradient id="listGrad" x1="0" y1="0" x2="800" y2="0" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#6294b5" />
                <stop offset="70%" stopColor="#6294b5" />
                <stop offset="100%" stopColor="#b5cfe2" stopOpacity="0" />
              </linearGradient>
            </defs>
          </svg>
        </motion.div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {workshops.map((w, i) => (
            <FadeUp key={w.slug} delay={i * 0.06}>
              <Link
                href={`/warsztaty/${w.slug}`}
                className="group block rounded-3xl overflow-hidden border border-heather-100
                           hover:border-heather-300 hover:shadow-lg hover:shadow-heather-100/60
                           transition-all duration-500 bg-white h-full"
              >
                {/* Image */}
                <div className="relative h-52 overflow-hidden">
                  <Image
                    src={w.image}
                    alt={w.imageAlt}
                    fill
                    className="object-cover object-center group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-white/60 to-transparent" />
                </div>

                {/* Text */}
                <div className="p-6">
                  <h2 className="font-serif text-xl font-semibold text-stone-800 group-hover:text-heather-800 transition-colors duration-300 mb-2">
                    {w.shortTitle}
                  </h2>
                  <p className="text-sm text-stone-500 leading-relaxed line-clamp-3">
                    {w.intro}
                  </p>

                  <div className="mt-5 flex items-center justify-between">
                    <span className="text-xs text-heather-600 font-medium flex items-center gap-1.5 group-hover:gap-2.5 transition-all duration-300">
                      Dowiedz się więcej <span>→</span>
                    </span>
                    <span
                      className="px-3 py-1 text-xs font-medium text-heather-800 bg-heather-50 border border-heather-200
                                 transition-all duration-300 group-hover:bg-heather-100"
                      style={{ borderRadius: "40% 60% 55% 45% / 55% 45% 55% 45%" }}
                    >
                      warsztat
                    </span>
                  </div>
                </div>
              </Link>
            </FadeUp>
          ))}
        </div>

        {/* CTA banner */}
        <FadeUp className="mt-20" delay={0.1}>
          <div className="rounded-3xl bg-heather-50 border border-heather-100 p-10 md:p-14 text-center">
            <span className="section-label block mb-4">Nie wiesz od czego zacząć?</span>
            <h3 className="font-serif text-3xl md:text-4xl font-semibold text-stone-900 mb-4">
              Napisz do nas
            </h3>
            <p className="text-stone-500 max-w-lg mx-auto mb-8">
              Chętnie pomożemy dopasować warsztat do Twoich zainteresowań, grupy i terminu.
            </p>
            <Link href="/kontakt" className="blob-btn inline-flex">
              Skontaktuj się
            </Link>
          </div>
        </FadeUp>

      </div>
    </div>
  );
}
