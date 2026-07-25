"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import BookingWidget from "@/components/shared/BookingWidget";
import type { GrafikSession } from "@/components/sections/GrafikListing";

function FadeUp({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 22 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay, duration: 0.7, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function formatWhen(date: Date): string {
  const label = new Intl.DateTimeFormat("pl-PL", { weekday: "short", day: "2-digit", month: "long", hour: "2-digit", minute: "2-digit" }).format(date);
  return label.charAt(0).toUpperCase() + label.slice(1);
}

function HomeSessionCard({ session, delay }: { session: GrafikSession; delay: number }) {
  const startAt = new Date(session.startAtISO);

  return (
    <FadeUp delay={delay}>
      <div className="group rounded-3xl bg-white border border-heather-100 overflow-hidden hover:border-heather-300 hover:shadow-md hover:shadow-heather-100 transition-all duration-500 h-full flex flex-col">
        <div className="relative h-40 overflow-hidden">
          <Image
            src={session.workshopImage}
            alt={session.workshopTitle}
            fill
            className="object-cover object-center group-hover:scale-105 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-white/70 to-transparent" />
        </div>

        <div className="p-5 flex flex-col flex-1">
          <Link
            href={`/warsztaty/${session.workshopSlug}`}
            className="font-serif text-lg font-semibold text-stone-800 hover:text-heather-800 transition-colors duration-300"
          >
            {session.workshopShortTitle}
          </Link>
          <p className="text-sm text-heather-700 font-medium mt-1">{formatWhen(startAt)}</p>
          <p className="text-xs text-stone-400 mt-1">{session.spotsLeft} wolnych miejsc</p>

          <div className="mt-4 pt-1">
            <BookingWidget
              sessionId={session.id}
              workshopTitle={session.workshopTitle}
              whenLabel={formatWhen(startAt)}
              spotsLeft={session.spotsLeft}
            />
          </div>
        </div>
      </div>
    </FadeUp>
  );
}

export default function UpcomingSessionsHome({ sessions }: { sessions: GrafikSession[] }) {
  if (sessions.length === 0) return null;

  return (
    <section className="pt-24 md:pt-28 pb-8 md:pb-12 bg-white">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 mb-10">
          <div>
            <FadeUp><span className="section-label">Grafik</span></FadeUp>
            <FadeUp delay={0.05} className="mt-3">
              <h2 className="font-serif text-3xl md:text-4xl font-semibold text-stone-900">
                Najbliższe terminy
              </h2>
            </FadeUp>
          </div>
          <FadeUp delay={0.1}>
            <Link
              href="/grafik"
              className="inline-flex items-center gap-2 text-sm font-medium text-heather-700 hover:text-heather-900 transition-colors duration-300 whitespace-nowrap"
            >
              Zobacz cały grafik <span>→</span>
            </Link>
          </FadeUp>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {sessions.map((session, i) => (
            <HomeSessionCard key={session.id} session={session} delay={i * 0.08} />
          ))}
        </div>
      </div>
    </section>
  );
}
