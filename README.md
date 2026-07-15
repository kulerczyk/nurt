# NURT — Warsztaty Artystyczne

Strona internetowa dla warsztatów artystycznych NURT — przestrzeni odkrywania,
eksperymentowania i rozwijania kreatywności poprzez różnorodne techniki
plastyczne i rękodzielnicze.

## Stack technologiczny

- [Next.js 15](https://nextjs.org/) (App Router)
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Framer Motion](https://www.framer.com/motion/)

## Rozwój lokalny

```bash
npm install
npm run dev
```

Otwórz [http://localhost:3000](http://localhost:3000) w przeglądarce.

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
