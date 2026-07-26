"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import BookingWidget from "@/components/shared/BookingWidget";

export interface GrafikSession {
  id: string;
  workshopSlug: string;
  workshopTitle: string;
  workshopShortTitle: string;
  workshopImage: string;
  startAtISO: string;
  location: string | null;
  capacity: number;
  bookedSeats: number;
  spotsLeft: number;
}

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

function formatWhen(date: Date): string {
  return new Intl.DateTimeFormat("pl-PL", { weekday: "long", day: "2-digit", month: "long", hour: "2-digit", minute: "2-digit" }).format(date);
}

function monthGroupLabel(date: Date): string {
  const label = new Intl.DateTimeFormat("pl-PL", { month: "long", year: "numeric" }).format(date);
  return label.charAt(0).toUpperCase() + label.slice(1);
}

function SessionCard({ session, delay }: { session: GrafikSession; delay: number }) {
  const startAt = new Date(session.startAtISO);
  const fillPct = session.capacity > 0 ? Math.min(100, Math.round((session.bookedSeats / session.capacity) * 100)) : 0;

  return (
    <FadeUp delay={delay}>
      <div className="rounded-3xl bg-white border border-heather-100 overflow-hidden hover:border-heather-300 hover:shadow-md hover:shadow-heather-100 transition-all duration-500 flex flex-col sm:flex-row">
        <div className="relative w-full sm:w-40 h-32 sm:h-auto flex-shrink-0">
          <Image src={session.workshopImage} alt={session.workshopTitle} fill className="object-cover object-center" />
        </div>

        <div className="flex-1 p-5 flex flex-col sm:flex-row sm:items-center gap-4">
          <div className="flex-1 min-w-0">
            <Link href={`/warsztaty/${session.workshopSlug}`} className="font-serif text-lg font-semibold text-stone-800 hover:text-heather-800 transition-colors duration-300">
              {session.workshopShortTitle}
            </Link>
            <p className="text-sm text-heather-700 font-medium mt-1 capitalize">{formatWhen(startAt)}</p>
            {session.location && <p className="text-xs text-stone-400 mt-1">{session.location}</p>}

            <div className="mt-3 flex items-center gap-2 max-w-[160px]">
              <div className="flex-1 h-1.5 rounded-full bg-heather-100 overflow-hidden">
                <div className="h-full bg-heather-400 rounded-full transition-all duration-500" style={{ width: `${fillPct}%` }} />
              </div>
              <span className="text-xs text-stone-400 whitespace-nowrap">{session.spotsLeft} wolnych</span>
            </div>
          </div>

          <div className="w-full sm:w-48 flex-shrink-0">
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

export default function GrafikListing({ sessions }: { sessions: GrafikSession[] }) {
  const groups = new Map<string, GrafikSession[]>();
  for (const session of sessions) {
    const key = monthGroupLabel(new Date(session.startAtISO));
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key)!.push(session);
  }

  return (
    <div className="pt-28 pb-24">
      <div className="max-w-4xl mx-auto px-6">

        <div className="mb-16 max-w-2xl">
          <motion.span className="section-label block mb-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6 }}>
            Grafik
          </motion.span>
          <motion.h1
            className="font-serif text-4xl md:text-5xl font-semibold text-stone-900 leading-[1.1]"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
          >
            Najbliższe terminy
          </motion.h1>
          <motion.p
            className="mt-5 text-lg text-stone-500 leading-relaxed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.7 }}
          >
            Wybierz warsztat i zarezerwuj miejsce - potwierdzenie dostaniesz od razu na e-mail.
          </motion.p>
        </div>

        {sessions.length === 0 ? (
          <FadeUp>
            <div className="rounded-3xl bg-heather-50 border border-heather-100 p-12 text-center">
              <p className="text-stone-500">
                Obecnie nie mamy zaplanowanych terminów - zajrzyj tu wkrótce albo{" "}
                <Link href="/kontakt" className="text-heather-700 font-medium hover:underline">napisz do nas</Link>, jeśli chcesz zapytać o najbliższą okazję.
              </p>
            </div>
          </FadeUp>
        ) : (
          <div className="space-y-12">
            {Array.from(groups.entries()).map(([month, monthSessions], groupIdx) => (
              <div key={month}>
                <FadeUp delay={groupIdx * 0.05} className="mb-5">
                  <span className="section-label">{month}</span>
                </FadeUp>
                <div className="space-y-4">
                  {monthSessions.map((session, i) => (
                    <SessionCard key={session.id} session={session} delay={i * 0.06} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
