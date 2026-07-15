# AZERII

Online store for **scale models of armored vehicles**.

Built with **Next.js (App Router)**, **TypeScript**, **Tailwind CSS**, and **ESLint**.

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Scripts

| Command         | Description                     |
| --------------- | ------------------------------- |
| `npm run dev`   | Start the dev server            |
| `npm run build` | Production build                |
| `npm run start` | Run the production build        |
| `npm run lint`  | Lint the project with ESLint    |

## Project structure

```
azerii/
├── app/            # Routes & pages (App Router)
├── components/     # Reusable UI components
├── constants/      # Constants: colors, product statuses, tech types, menu, socials
├── hooks/          # Custom React hooks
├── i18n/           # EN/RU translation dictionaries & locale config
├── lib/            # Utilities: EUR price formatting, data client
├── server/         # Server-only logic: orders, contact form, mail
├── types/          # TypeScript types: Product, Category, Order, Locale, …
├── public/         # Static assets
└── proxy.ts        # Locale handling & redirects (stub; Next 16 replaces middleware)
```

> **Note on `proxy.ts`:** Next.js 16 deprecated the `middleware` file
> convention and renamed it to **`proxy`** (exported function `proxy`,
> defaulting to the Node.js runtime). This project uses `proxy.ts`
> accordingly.

### Folder details

- **`app/`** — App Router entry point. Layouts, pages and route handlers.
- **`components/`** — Presentational, reusable components (e.g. `Badge`).
- **`constants/`** — Single source of truth for brand colors, the list of
  product statuses and their badge colors, tech types, categories, the
  navigation menu and social links.
- **`hooks/`** — Client-side React hooks (e.g. `useLocale`).
- **`i18n/`** — `config.ts` (supported locales), `dictionaries/{en,ru}.ts`
  and `index.ts` exposing `getDictionary(locale)`.
- **`lib/`** — Framework-agnostic helpers: `format.ts` (EUR price
  formatting via `Intl.NumberFormat`) and `data.ts` (data-access client).
- **`server/`** — Modules marked `server-only`: order creation, contact
  form handling and mail sending. Not importable from client components.
- **`types/`** — Domain model: `Locale`, `ProductStatus`, `TechType`,
  `CategoryType`, `Product`, `Order` and supporting interfaces.

## Internationalization

Two locales are supported: **English (`en`)** and **Russian (`ru`)**.
Dictionaries live in `i18n/dictionaries/`; retrieve one with
`getDictionary(locale)`.

## Conventions

- Prices are stored as **EUR cents** (integers) and formatted for display
  with `formatPrice()` from `lib/format.ts`.
- The `@/*` import alias maps to the project root.

> Catalog and product pages are **not** implemented yet — this is the
> scaffold only.
