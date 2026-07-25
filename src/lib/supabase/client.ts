import { createBrowserClient } from "@supabase/ssr";

// Klient Supabase do użytku w komponentach klienckich ("use client").
// Używa publicznego anon key — bezpieczny do ujawnienia w przeglądarce,
// bo dostęp do danych i tak kontrolują polityki RLS w bazie.
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
