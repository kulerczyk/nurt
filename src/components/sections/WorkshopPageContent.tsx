"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import type { Workshop } from "@/lib/workshops";

function FadeUp({
  children,
  delay = 0,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
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

function OrganicDivider({ id }: { id: string }) {
  return (
    <svg viewBox="0 0 800 12" fill="none" className="w-full max-w-xl my-12">
      <path
        d="M0,6 C120,2 240,10 360,5 C480,0 600,9 720,5 C760,3 780,7 800,6"
        stroke={`url(#wg-${id})`}
        strokeWidth="1.5"
        strokeLinecap="round"
        fill="none"
      />
      <defs>
        <linearGradient id={`wg-${id}`} x1="0" y1="0" x2="800" y2="0" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#dce8f0" stopOpacity="0" />
          <stop offset="25%" stopColor="#6294b5" />
          <stop offset="75%" stopColor="#6294b5" />
          <stop offset="100%" stopColor="#dce8f0" stopOpacity="0" />
        </linearGradient>
      </defs>
    </svg>
  );
}

interface Props {
  workshop: Workshop;
  otherWorkshops: Workshop[];
}

export default function WorkshopPageContent({ workshop, otherWorkshops }: Props) {
  return (
    <article className="pt-16">
      {/* Hero */}
      <div className={`relative overflow-hidden ${workshop.imageBg === "light" ? "h-[60vh] min-h-[420px] max-h-[560px] bg-stone-50" : "h-[70vh] min-h-[480px] max-h-[680px]"}`}>
        <Image
          src={workshop.image}
          alt={workshop.imageAlt}
          fill
          priority
          className={workshop.imageBg === "light" ? "object-contain object-center p-8 md:p-16" : "object-cover object-center"}
          style={workshop.imagePosition ? { objectPosition: workshop.imagePosition } : {}}
        />
        {/* Gradient — jasne tło ma delikatniejszy overlay */}
        {workshop.imageBg === "light" ? (
          <>
            <div className="absolute inset-0 bg-gradient-to-t from-stone-50 via-stone-50/60 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-r from-stone-50/70 via-transparent to-transparent" />
          </>
        ) : (
          <>
            <div className="absolute inset-0 bg-gradient-to-t from-white via-white/50 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-r from-white/40 via-transparent to-transparent" />
          </>
        )}

        {/* Hero text */}
        <div className="absolute bottom-0 left-0 right-0 max-w-6xl mx-auto px-6 pb-12">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <Link
              href="/warsztaty"
              className="inline-flex items-center gap-2 text-xs text-heather-600 font-medium tracking-widest uppercase mb-6 hover:text-heather-800 transition-colors duration-300"
            >
              <span>←</span> Warsztaty
            </Link>
            <h1 className="font-serif text-4xl md:text-6xl font-semibold text-stone-900 leading-[1.1] max-w-2xl">
              {workshop.title}
            </h1>
            <p className="mt-3 text-heather-700 font-serif italic text-lg">
              {workshop.tagline}
            </p>
          </motion.div>
        </div>

        {/* Organic wave at bottom */}
        <div className="absolute bottom-0 left-0 right-0 z-10">
          <svg viewBox="0 0 1440 48" fill="none" className="w-full" preserveAspectRatio="none">
            <path
              d="M0,32 C200,8 400,48 600,28 C800,8 1100,44 1440,24 L1440,48 L0,48 Z"
              fill="white"
            />
          </svg>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-6 py-16 md:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">

          {/* Main text — 2 cols wide */}
          <div className="lg:col-span-2">

            {/* Intro */}
            <FadeUp>
              <p className="text-xl md:text-2xl text-stone-700 font-serif leading-relaxed font-medium">
                {workshop.intro}
              </p>
            </FadeUp>

            <OrganicDivider id="a" />

            {/* Sections */}
            {workshop.sections.map((section, i) => (
              <FadeUp key={i} delay={i * 0.08} className="mb-10">
                {section.heading && (
                  <h2 className="font-serif text-2xl font-semibold text-stone-900 mb-4">
                    {section.heading}
                  </h2>
                )}
                <p className="text-stone-500 text-lg leading-relaxed">{section.body}</p>
              </FadeUp>
            ))}

            <OrganicDivider id="b" />

            {/* Closing */}
            <FadeUp>
              <p className="text-lg text-stone-700 font-serif italic leading-relaxed">
                &ldquo;{workshop.closing}&rdquo;
              </p>
            </FadeUp>
          </div>

          {/* Sidebar — 1 col */}
          <div className="space-y-8">

            {/* What you'll learn */}
            <FadeUp>
              <div className="rounded-3xl bg-heather-50 border border-heather-100 p-6 sticky top-24">
                <span className="section-label block mb-5">Czego się nauczysz</span>
                <ul className="space-y-3">
                  {workshop.highlights.map((h) => (
                    <li key={h} className="flex items-start gap-3">
                      <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-heather-400 flex-shrink-0" />
                      <span className="text-sm text-stone-600 leading-snug">{h}</span>
                    </li>
                  ))}
                </ul>

                <div className="mt-8">
                  <svg viewBox="0 0 200 8" fill="none" className="w-full mb-6">
                    <path d="M0,4 C50,1 100,7 150,4 C170,2 185,5 200,4"
                      stroke="url(#sbGrad)" strokeWidth="1" strokeLinecap="round" fill="none" />
                    <defs>
                      <linearGradient id="sbGrad" x1="0" y1="0" x2="200" y2="0" gradientUnits="userSpaceOnUse">
                        <stop offset="0%" stopColor="#6294b5" />
                        <stop offset="100%" stopColor="#b5cfe2" stopOpacity="0.2" />
                      </linearGradient>
                    </defs>
                  </svg>

                  <Link href="/kontakt" className="blob-btn w-full justify-center text-sm">
                    Zapisz się na warsztat
                  </Link>

                  <p className="mt-3 text-center text-xs text-stone-400">
                    Masz pytania?{" "}
                    <Link href="/kontakt" className="text-heather-600 hover:underline">
                      Napisz do nas
                    </Link>
                  </p>
                </div>
              </div>
            </FadeUp>
          </div>
        </div>

        {/* Other workshops */}
        <div className="mt-24">
          <OrganicDivider id="c" />
          <FadeUp className="mb-10">
            <span className="section-label">Sprawdź też</span>
            <h3 className="font-serif text-3xl font-semibold text-stone-900 mt-2">
              Inne warsztaty
            </h3>
          </FadeUp>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {otherWorkshops.map((w, i) => (
              <FadeUp key={w.slug} delay={i * 0.1}>
                <Link
                  href={`/warsztaty/${w.slug}`}
                  className="group block rounded-3xl overflow-hidden border border-heather-100
                             hover:border-heather-300 hover:shadow-md hover:shadow-heather-100
                             transition-all duration-500"
                >
                  <div className="relative h-44 overflow-hidden">
                    <Image
                      src={w.image}
                      alt={w.imageAlt}
                      fill
                      className="object-cover object-center group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-white/70 to-transparent" />
                  </div>
                  <div className="p-5">
                    <h4 className="font-serif text-lg font-semibold text-stone-800 group-hover:text-heather-800 transition-colors duration-300">
                      {w.shortTitle}
                    </h4>
                    <p className="text-sm text-stone-500 mt-1 line-clamp-2">{w.intro}</p>
                    <span className="mt-3 inline-flex items-center gap-1.5 text-xs text-heather-600 font-medium">
                      Dowiedz się więcej <span>→</span>
                    </span>
                  </div>
                </Link>
              </FadeUp>
            ))}
          </div>
        </div>
      </div>
    </article>
  );
}
