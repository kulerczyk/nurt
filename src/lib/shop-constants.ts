// Bez zależności serwerowych (Prisma itd.) - bezpieczne do importu zarówno
// w komponentach klienckich (podgląd ceny w koszyku), jak i w lib/orders.ts
// (rzeczywiste przeliczenie zamówienia po stronie serwera).
export const FLAT_SHIPPING_CENTS = 1500;
