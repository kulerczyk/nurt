"use client";

import { useEffect, useRef } from "react";
import { useCart } from "@/components/shop/CartProvider";

// Zamówienie zostało już utworzone po stronie serwera (niezależnie od tego, czy
// płatność jest jeszcze przetwarzana), więc koszyk klienta można bezpiecznie wyczyścić.
export default function ClearCartOnMount() {
  const { clear } = useCart();
  const cleared = useRef(false);

  useEffect(() => {
    if (cleared.current) return;
    cleared.current = true;
    clear();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
}
