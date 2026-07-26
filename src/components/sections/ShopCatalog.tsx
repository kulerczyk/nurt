"use client";

import { useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/components/shop/CartProvider";
import type { Product } from "@/lib/products";

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

function formatPln(cents: number): string {
  return `${(cents / 100).toFixed(2).replace(".", ",")} zł`;
}

function ProductCard({ product, delay }: { product: Product; delay: number }) {
  const { addItem, items } = useCart();
  const [added, setAdded] = useState(false);
  const inCart = items.find((i) => i.productId === product.id)?.quantity ?? 0;
  const outOfStock = product.type === "PHYSICAL" && product.stock !== null && product.stock <= inCart;

  const handleAdd = () => {
    addItem({
      productId: product.id,
      slug: product.slug,
      name: product.name,
      priceCents: product.priceCents,
      image: product.image,
      type: product.type,
      maxStock: product.stock,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 1600);
  };

  return (
    <FadeUp delay={delay}>
      <div className="group rounded-3xl overflow-hidden border border-heather-100 hover:border-heather-300 hover:shadow-lg hover:shadow-heather-100/60 transition-all duration-500 bg-white h-full flex flex-col">
        <div className="relative h-52 overflow-hidden">
          <Image
            src={product.image}
            alt={product.imageAlt}
            fill
            className="object-cover object-center group-hover:scale-105 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-white/60 to-transparent" />
          <span
            className="absolute top-4 left-4 px-3 py-1 text-xs font-medium text-heather-800 bg-white/90 border border-heather-200"
            style={{ borderRadius: "40% 60% 55% 45% / 55% 45% 55% 45%" }}
          >
            {product.type === "VOUCHER" ? "voucher" : "produkt"}
          </span>
        </div>

        <div className="p-6 flex flex-col flex-1">
          <h2 className="font-serif text-xl font-semibold text-stone-800 mb-2">{product.name}</h2>
          <p className="text-sm text-stone-500 leading-relaxed line-clamp-3 flex-1">{product.description}</p>

          <div className="mt-5 flex items-center justify-between gap-3">
            <span className="font-serif text-lg font-semibold text-heather-800">{formatPln(product.priceCents)}</span>

            {outOfStock ? (
              <span className="text-xs text-stone-400 font-medium">Brak w magazynie</span>
            ) : (
              <button
                type="button"
                onClick={handleAdd}
                className="blob-btn text-xs px-5 py-2"
                style={{ fontSize: "0.8rem" }}
              >
                {added ? "Dodano ✓" : "Dodaj do koszyka"}
              </button>
            )}
          </div>
        </div>
      </div>
    </FadeUp>
  );
}

export default function ShopCatalog({ vouchers, products }: { vouchers: Product[]; products: Product[] }) {
  return (
    <div className="pt-28 pb-24">
      <div className="max-w-6xl mx-auto px-6">

        <div className="mb-16 max-w-2xl">
          <motion.span className="section-label block mb-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6 }}>
            Sklep
          </motion.span>
          <motion.h1
            className="font-serif text-5xl md:text-6xl font-semibold text-stone-900 leading-[1.1] mb-6"
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1, duration: 0.8, ease: "easeOut" }}
          >
            Vouchery i rękodzieło
          </motion.h1>
          <motion.p
            className="text-stone-500 text-lg leading-relaxed"
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.7, ease: "easeOut" }}
          >
            Podaruj bliskim wstęp do świata rękodzieła albo zabierz kawałek pracowni NURT do domu.
          </motion.p>
        </div>

        {vouchers.length > 0 && (
          <div className="mb-20">
            <FadeUp><h2 className="font-serif text-2xl font-semibold text-stone-800 mb-6">Vouchery podarunkowe</h2></FadeUp>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {vouchers.map((p, i) => <ProductCard key={p.id} product={p} delay={i * 0.06} />)}
            </div>
          </div>
        )}

        {products.length > 0 && (
          <div>
            <FadeUp><h2 className="font-serif text-2xl font-semibold text-stone-800 mb-6">Produkty z pracowni</h2></FadeUp>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((p, i) => <ProductCard key={p.id} product={p} delay={i * 0.06} />)}
            </div>
          </div>
        )}

        {vouchers.length === 0 && products.length === 0 && (
          <FadeUp>
            <div className="rounded-3xl bg-heather-50 border border-heather-100 p-12 text-center">
              <p className="text-stone-500">Sklep jest w przygotowaniu — wróć wkrótce.</p>
            </div>
          </FadeUp>
        )}

        <FadeUp className="mt-20" delay={0.1}>
          <div className="rounded-3xl bg-heather-50 border border-heather-100 p-10 md:p-14 text-center">
            <span className="section-label block mb-4">Masz pytanie o zamówienie?</span>
            <h3 className="font-serif text-3xl md:text-4xl font-semibold text-stone-900 mb-4">Napisz do nas</h3>
            <p className="text-stone-500 max-w-lg mx-auto mb-8">
              Chętnie pomożemy dobrać voucher albo doradzimy przy wyborze produktu.
            </p>
            <Link href="/kontakt" className="blob-btn inline-flex">Skontaktuj się</Link>
          </div>
        </FadeUp>

      </div>
    </div>
  );
}
