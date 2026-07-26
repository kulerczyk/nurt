# NURT - Warsztaty Artystyczne

Strona internetowa dla warsztatów artystycznych NURT - przestrzeni odkrywania,
eksperymentowania i rozwijania kreatywności poprzez różnorodne techniki
plastyczne i rękodzielnicze.

## Stack technologiczny

- [Next.js 15](https://nextjs.org/) (App Router)
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Framer Motion](https://www.framer.com/motion/)
- [Prisma](https://www.prisma.io/) + [Supabase](https://supabase.com/) (Postgres, Auth)
- [Resend](https://resend.com/) (e-maile transakcyjne) + [Zod](https://zod.dev/) (walidacja formularzy)

## Konfiguracja bazy danych (Supabase)

Strona wymaga działającej bazy Postgres, zanim `npm run dev`/`npm run build` zadziała.

1. Utwórz projekt na [supabase.com](https://supabase.com) (region np. Frankfurt - najbliżej PL)
2. W panelu projektu kliknij zielony przycisk **Connect** (górna belka, przy nazwie projektu). Otworzy się okno z zakładkami różnych typów połączenia:
   - zakładka **Transaction pooler** (port `6543`) - skopiuj connection string → wklej jako `DATABASE_URL` w `.env`
   - zakładka **Session pooler** (port `5432`) - skopiuj connection string → wklej jako `DIRECT_URL` w `.env`
   - w skopiowanym stringu zamień `[YOUR-PASSWORD]` na hasło bazy, które ustawiłeś przy tworzeniu projektu (jeśli je zapomniałeś, możesz je zresetować w **Project Settings → Database → Database password**)
   - ⚠️ Nie używaj zakładki **Direct connection** (host `db.<ref>.supabase.co`) lokalnie/w CI bez wsparcia IPv6 - połączenie może się nie udać (`P1001`). **Session pooler** działa zawsze po IPv4 i jest w pełni wystarczający dla migracji Prismy.
3. **Project Settings → API** (lub **Project Settings → Data API**, w zależności od wersji dashboardu):
   - `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
   - `anon public` key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `service_role` key → `SUPABASE_SERVICE_ROLE_KEY` (tylko serwer, nigdy w kliencie!)
4. **Authentication → Users → Add user** - utwórz konto administratora (e-mail + hasło), którym będziesz się logować do `/admin`
5. Uruchom migracje i seed:

```bash
npm run db:migrate
npm run db:seed
```

## Konfiguracja e-maili (Resend) - opcjonalna, ale zalecana

Formularze kontaktowe (`/kontakt` + widget "Zadaj pytanie" na stronach warsztatów)
zapisują zapytania do bazy niezależnie od tego, czy e-mail jest skonfigurowany -
**bez Resend nic się nie wywali**, po prostu nie wyślą się powiadomienia i
w logach serwera zobaczysz ostrzeżenie. Żeby włączyć e-maile:

1. Załóż darmowe konto na [resend.com](https://resend.com) i wygeneruj klucz API (**API Keys → Create API Key**)
2. Wklej go jako `RESEND_API_KEY` w `.env`
3. Ustaw `CONTACT_ADMIN_EMAIL` na adres, na który mają przychodzić powiadomienia o nowych zapytaniach (to Twoja skrzynka)
4. Do testów lokalnych możesz zostawić `CONTACT_FROM_EMAIL="NURT <onboarding@resend.dev>"` - to testowy adres Resend, działa od razu, ale wysyła tylko na adres e-mail, którym zalogowałeś się do Resend
5. Przed produkcją: zweryfikuj własną domenę w Resend (**Domains → Add Domain**, kilka wpisów DNS) i zmień `CONTACT_FROM_EMAIL` na np. `"NURT <kontakt@twojadomena.pl>"` - inaczej maile do klientów będą trafiać do spamu albo w ogóle się nie wysyłać

## Sklep i płatności (Przelewy24) - opcjonalna, ale wymagana do prawdziwych płatności

Sklep (`/sklep`) działa od razu: katalog produktów (vouchery + rękodzieło), koszyk
i składanie zamówień. **Bez konfiguracji Przelewy24** zamówienia są zapisywane ze
statusem „oczekuje na płatność”, klient widzi informację, że skontaktujemy się w
sprawie płatności, a Ty w `/admin/zamowienia` możesz ręcznie oznaczyć zamówienie
jako opłacone (np. po przelewie bezpośrednim) - wtedy system sam wygeneruje kody
voucherów i wyśle e-mail z potwierdzeniem, dokładnie tak samo jak przy prawdziwej
płatności online.

Żeby włączyć prawdziwe płatności online:

1. Załóż konto na [przelewy24.pl](https://www.przelewy24.pl/) (do testów: [panel sandbox](https://sandbox.przelewy24.pl/))
2. W panelu sklepu znajdziesz: **ID sklepu (merchant ID)**, **ID punktu sprzedaży (POS ID)** - zwykle taki sam jak merchant ID, **klucz API** (Ustawienia → Klucze API) i **klucz CRC** (Ustawienia sklepu)
3. Wklej je do `.env` jako `P24_MERCHANT_ID`, `P24_POS_ID`, `P24_API_KEY`, `P24_CRC_KEY`
4. Zostaw `P24_SANDBOX="true"` do testów - płatności idą przez środowisko testowe P24 (karty/przelewy testowe, żadne prawdziwe pieniądze). Do produkcji zmień na `"false"` i użyj kluczy z panelu produkcyjnego (nie sandbox)
5. Ustaw `NEXT_PUBLIC_SITE_URL` na publiczny adres strony (np. `https://nurt.pl`) - P24 potrzebuje pełnego adresu https, żeby wysłać powiadomienie o płatności i przekierować klienta z powrotem. Na Vercel można to pominąć, wykorzystany zostanie automatyczny adres deploymentu
6. Pamiętaj o dodaniu tych samych zmiennych w ustawieniach projektu na Vercel (**Settings → Environment Variables**) - patrz sekcja o wdrożeniu

Stawka wysyłki kurierem jest ustawiona na stałe w `src/lib/shop-constants.ts`
(`FLAT_SHIPPING_CENTS`, domyślnie 15 zł) - zmień w jednym miejscu, jeśli cennik
się zmieni. Produkty fizyczne można też oferować wyłącznie z odbiorem osobistym
(bez dodatkowych kosztów) - klient wybiera opcję w checkoucie.

## Rozwój lokalny

```bash
npm install
npm run dev
```

Otwórz [http://localhost:3000](http://localhost:3000) w przeglądarce, panel administracyjny pod [http://localhost:3000/admin](http://localhost:3000/admin/login).

## Struktura projektu

```
src/
├── app/                      # strony (App Router)
│   ├── page.tsx              # strona główna
│   └── warsztaty/            # listing i podstrony warsztatów
├── components/
│   ├── layout/                # Navbar, Footer
│   └── sections/               # Hero, AboutNurt, WorkshopsListing...
└── lib/
    └── workshops.ts           # dane wszystkich warsztatów
```

## Build

```bash
npm run build
```
