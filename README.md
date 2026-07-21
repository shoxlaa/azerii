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
├── app/            # Routes & pages (App Router) — (frontend) and (payload) groups
├── collections/    # Payload CMS collections
├── components/     # Reusable UI components
├── constants/      # Constants: colors, product statuses, tech types, menu, socials
├── hooks/          # Custom React hooks
├── i18n/           # EN/RU translation dictionaries & locale config
├── lib/            # Utilities: EUR price formatting, data client
├── server/         # Server-only logic: orders, contact form, mail
├── types/          # TypeScript types: Product, Category, Order, Locale, …
├── public/         # Static assets
├── payload.config.ts  # Payload CMS config (Postgres, S3 storage, Lexical)
└── proxy.ts        # Locale cookie handling (Next 16 replaces middleware)
```

> **Note on `proxy.ts`:** Next.js 16 deprecated the `middleware` file
> convention and renamed it to **`proxy`** (exported function `proxy`,
> defaulting to the Node.js runtime). This project uses `proxy.ts`
> accordingly.
>
> It seeds the locale cookie with `DEFAULT_LOCALE` on the first visit (or when
> the stored value is invalid) so the language switcher's choice survives
> reloads. The locale is **not** reflected in the URL and nothing is
> redirected — the cookie is the only carrier.

### Folder details

- **`app/`** — App Router entry point. Two route groups: `(frontend)` for the
  storefront and `(payload)` for the CMS admin UI, REST and GraphQL handlers.
- **`collections/`** — Payload CMS collections: `Products`, `Orders`, `Users`,
  `Media`, `MuseumItems` and `DailyVisits`.
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

- Prices are stored as **decimal EUR** (`numeric(10,2)`, e.g. `499.99`) and
  formatted for display with `formatPrice()` from `lib/format.ts`. Computed
  totals go through `roundMoney()` to stay exact to the cent.
- The `@/*` import alias maps to the project root.

## Status

The storefront is implemented end to end:

- **Catalog** — listing at `app/(frontend)/catalog/` and product pages at
  `catalog/[slug]/`, backed by `getProductsSafe()` from `lib/data.ts`.
- **Cart & checkout** — `useCart` (Zustand, persisted) with `CartView`,
  `CheckoutForm` and `validateCheckout()`.
- **Orders** — `createOrder()` in `server/orders.ts` computes the total,
  persists the order and sends buyer and seller notification e-mails,
  recording the delivery outcome on the order.
- **Museum, search, contact** and the **styleguide** page are live.
