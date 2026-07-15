"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const techniques = [
  "Linoryt",
  "Sitodruk",
  "Malowanie na tekstyliach",
  "Rzeźba",
  "Tworzenie biżuterii",
  "Malarstwo",
  "Rysunek",
  "Ceramika",
];

const tagShapes = [
  "52% 48% 55% 45% / 48% 56% 44% 52%",
  "44% 56% 48% 52% / 55% 45% 58% 42%",
  "60% 40% 52% 48% / 44% 56% 46% 54%",
  "48% 52% 44% 56% / 58% 42% 52% 48%",
  "55% 45% 60% 40% / 50% 50% 44% 56%",
  "42% 58% 50% 50% / 46% 54% 55% 45%",
  "50% 50% 46% 54% / 52% 48% 58% 42%",
  "58% 42% 52% 48% / 44% 56% 50% 50%",
];

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
      initial={{ opacity: 0, y: 22 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 22 }}
      transition={{ delay, duration: 0.7, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export default function AboutNurt() {
  return (
    <section className="py-24 md:py-32 bg-white overflow-hidden">
      <div className="max-w-6xl mx-auto px-6">

        {/* Label */}
        <FadeUp className="mb-6">
          <span className="section-label">O nas</span>
        </FadeUp>

        {/* Title */}
        <FadeUp delay={0.05} className="mb-14">
          <h2 className="font-serif text-4xl md:text-5xl font-semibold text-stone-900 leading-[1.15]">
            <span className="text-heather-600">NURT</span> Warsztaty Artystyczne
          </h2>
        </FadeUp>

        {/* Paragraph 1 — lead */}
        <FadeUp delay={0.1} className="mb-16 max-w-3xl">
          <p className="text-xl md:text-2xl text-stone-700 font-serif leading-relaxed">
            Tak jak nurt rzeki nieustannie zmienia swój bieg, tak twórczość
            prowadzi nas wciąż nowymi ścieżkami. Warsztaty Artystyczne NURT
            to przestrzeń odkrywania, eksperymentowania i rozwijania własnej
            kreatywności poprzez różnorodne techniki plastyczne i rękodzielnicze.
          </p>
        </FadeUp>

        {/* Paragraphs 2 & 3 — two columns */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
          <FadeUp delay={0.15}>
            <p className="text-stone-500 text-lg leading-relaxed">
              Podczas naszych warsztatów będziesz odkrywać nowe możliwości
              wyrażania siebie. Poznasz różnorodne techniki artystyczne. Od
              linorytu i sitodruku, przez malowanie na tekstyliach, rzeźbę i
              tworzenie biżuterii, aż po malarstwo, rysunek, ceramikę i wiele
              innych. Każda z nich może stać się początkiem fascynującej
              twórczej podróży.
            </p>

            {/* Techniques — decorative chips echoing the paragraph above */}
            <div className="flex flex-wrap gap-2.5 mt-6">
              {techniques.map((tech, i) => (
                <span
                  key={tech}
                  className="blob-tag block text-xs"
                  style={{ borderRadius: tagShapes[i % tagShapes.length] }}
                >
                  {tech}
                </span>
              ))}
            </div>
          </FadeUp>

          <FadeUp delay={0.2}>
            <p className="text-stone-500 text-lg leading-relaxed">
              NURT to miejsce dla osób, które chcą tworzyć, rozwijać swoje
              umiejętności i czerpać radość z procesu twórczego.{" "}
              <span className="text-stone-700 font-medium">
                Nie trzeba mieć doświadczenia.
              </span>{" "}
              Wystarczy ciekawość, otwartość i chęć odkrywania. Bo
              kreatywność, podobnie jak woda nigdy nie stoi w miejscu, a
              każda stworzona praca jest wyjątkowa i niepowtarzalna.
            </p>
          </FadeUp>
        </div>

        {/* Organic heather divider */}
        <div className="my-16 md:my-20">
          <svg viewBox="0 0 800 12" fill="none" className="w-full max-w-2xl mx-auto">
            <path
              d="M0,6 C120,2 240,10 360,5 C480,0 600,9 720,5 C760,3 780,7 800,6"
              stroke="url(#aboutGrad)"
              strokeWidth="1.5"
              strokeLinecap="round"
              fill="none"
            />
            <defs>
              <linearGradient id="aboutGrad" x1="0" y1="0" x2="800" y2="0" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#b5cfe2" stopOpacity="0" />
                <stop offset="30%" stopColor="#6294b5" />
                <stop offset="70%" stopColor="#6294b5" />
                <stop offset="100%" stopColor="#b5cfe2" stopOpacity="0" />
              </linearGradient>
            </defs>
          </svg>
        </div>

        {/* Paragraph 4 — closing statement */}
        <FadeUp delay={0.1} className="max-w-2xl mx-auto text-center">
          <p className="font-serif text-2xl md:text-3xl text-stone-800 leading-snug italic">
            NURT to nie tylko miejsce, w którym odbywają się nasze warsztaty.
            To także otwarta przestrzeń dla innych twórców. Można tu
            zorganizować własne spotkania, wydarzenia, wystawę czy inny
            projekt artystyczny.
          </p>
        </FadeUp>

      </div>
    </section>
  );
}
