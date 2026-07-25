# NURT — Warsztaty Artystyczne

Strona internetowa dla warsztatów artystycznych NURT — przestrzeni odkrywania,
eksperymentowania i rozwijania kreatywności poprzez różnorodne techniki
plastyczne i rękodzielnicze.

## Stack technologiczny

- [Next.js 15](https://nextjs.org/) (App Router)
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Framer Motion](https://www.framer.com/motion/)
- [Prisma](https://www.prisma.io/) + [Supabase](https://supabase.com/) (Postgres, Auth)

## Konfiguracja bazy danych (Supabase)

Strona wymaga działającej bazy Postgres, zanim `npm run dev`/`npm run build` zadziała.

1. Utwórz projekt na [supabase.com](https://supabase.com) (region np. Frankfurt — najbliżej PL)
2. W panelu projektu kliknij zielony przycisk **Connect** (górna belka, przy nazwie projektu). Otworzy się okno z zakładkami różnych typów połączenia:
   - zakładka **Transaction pooler** (port `6543`) — skopiuj connection string → wklej jako `DATABASE_URL` w `.env`
   - zakładka **Session pooler** (port `5432`) — skopiuj connection string → wklej jako `DIRECT_URL` w `.env`
   - w skopiowanym stringu zamień `[YOUR-PASSWORD]` na hasło bazy, które ustawiłeś przy tworzeniu projektu (jeśli je zapomniałeś, możesz je zresetować w **Project Settings → Database → Database password**)
   - ⚠️ Nie używaj zakładki **Direct connection** (host `db.<ref>.supabase.co`) lokalnie/w CI bez wsparcia IPv6 — połączenie może się nie udać (`P1001`). **Session pooler** działa zawsze po IPv4 i jest w pełni wystarczający dla migracji Prismy.
3. **Project Settings → API** (lub **Project Settings → Data API**, w zależności od wersji dashboardu):
   - `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
   - `anon public` key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `service_role` key → `SUPABASE_SERVICE_ROLE_KEY` (tylko serwer, nigdy w kliencie!)
4. **Authentication → Users → Add user** — utwórz konto administratora (e-mail + hasło), którym będziesz się logować do `/admin`
5. Uruchom migracje i seed:

```bash
npm run db:migrate
npm run db:seed
```

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
