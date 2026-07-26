"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

function FadeUp({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.8, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-end pb-20 pt-16 overflow-hidden">
      {/* Background image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1600&q=80"
          alt="Warsztaty artystyczne NURT"
          fill
          priority
          className="object-cover object-center"
        />
        {/* Gradient overlay - morning mist feel */}
        <div className="absolute inset-0 bg-gradient-to-t from-white via-white/70 to-white/10" />
        <div className="absolute inset-0 bg-gradient-to-r from-white/60 via-transparent to-transparent" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-6 w-full">
        <div className="max-w-xl">
          <FadeUp delay={0.1}>
            <span className="section-label block mb-6">Warsztaty Artystyczne</span>
          </FadeUp>

          <FadeUp delay={0.25}>
            <h1 className="font-serif text-5xl md:text-7xl font-semibold text-stone-900 leading-[1.1] mb-6">
              Tak jak nurt
              <br />
              <em className="text-heather-600 not-italic">rzeki.</em>
            </h1>
          </FadeUp>

          <FadeUp delay={0.4}>
            <p className="text-stone-500 text-lg leading-relaxed mb-10 max-w-md">
              Przestrzeń odkrywania, eksperymentowania i rozwijania własnej
              kreatywności poprzez różnorodne techniki plastyczne i rękodzielnicze.
            </p>
          </FadeUp>

          <FadeUp delay={0.55}>
            <div className="flex items-center gap-4 flex-wrap">
              <Link href="/warsztaty-i-kursy" className="blob-btn">
                Odkryj warsztaty
              </Link>
              <Link
                href="/grafik"
                className="text-stone-600 text-sm font-medium flex items-center gap-2
                           hover:text-heather-700 transition-colors duration-300"
              >
                <span>Zobacz grafik</span>
                <span className="text-heather-400">→</span>
              </Link>
            </div>
          </FadeUp>
        </div>

        {/* Floating tag */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.7, ease: "easeOut" }}
          className="absolute right-6 bottom-0 hidden lg:flex items-center gap-3 bg-white/80 backdrop-blur-sm rounded-3xl px-6 py-4 border border-heather-100 shadow-sm"
        >
          <div className="w-2 h-2 rounded-full bg-heather-400 animate-pulse" />
          <span className="text-sm text-stone-600 font-medium">
            Najbliższy warsztat - sprawdź grafik
          </span>
        </motion.div>
      </div>

      {/* Organic bottom divider */}
      <div className="absolute bottom-0 left-0 right-0 z-10">
        <svg
          viewBox="0 0 1440 60"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full"
          preserveAspectRatio="none"
        >
          <path
            d="M0,40 C240,10 480,60 720,35 C960,10 1200,55 1440,30 L1440,60 L0,60 Z"
            fill="white"
            opacity="0.9"
          />
        </svg>
      </div>
    </section>
  );
}
