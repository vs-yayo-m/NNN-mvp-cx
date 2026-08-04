# Nom Nom Now \u2014 Customer Web MVP

A frontend-only prototype of the Nom Nom Now customer ordering experience (Butwal, Main branch). Built to demonstrate the full customer journey to management before backend development begins.

## What this is

- Next.js 15 (App Router) + TypeScript + Tailwind CSS
- **No backend.** All state (cart, guest details, orders) lives in the browser via `localStorage`.
- Menu data is static, in `/data`, structured to map directly onto a future database schema.
- Order status on the tracking screen is **simulated from elapsed time** (see `lib/utils.ts \u2192 simulatedStatus`), since there is no kitchen/rider feed yet.

## Running it

```bash
npm install
npm run dev
```

Open http://localhost:3000. Best viewed at mobile width (this is a mobile-first PWA-style experience).

## Project structure

```
app/                    routes (home, menu, product, cart, checkout, orders, search)
components/             shared UI (Header, BottomNav, ProductCard, AISection, ...)
context/AppContext.tsx  cart + orders + guest state, persisted to localStorage
data/menu-data.ts       cloud kitchen / restaurant menu items
data/bar-data.ts        bar & beverage menu items
data/site-config.ts     branch info, categories, banners
lib/types.ts            shared TypeScript types
lib/utils.ts            pricing, search, AI-recommendation, order-status helpers
lib/storage.ts          localStorage read/write helpers
```

## Editing the menu

Everything customer-facing reads from `data/menu-data.ts` and `data/bar-data.ts`. To change what's on the menu:

- Edit price, `isAvailable`, `isPopular`, `isSpecialToday`, `isVeg`, `spiceLevel`, etc. directly on an item.
- **Images**: set `image` to either
  1. an external URL (e.g. an Unsplash or CDN link), or
  2. a local file placed in `/public` and referenced as `/your-file.jpg`.
  If `image` is left out, a placeholder is generated automatically.
- Setting `isAvailable: false` removes the item from the customer app entirely \u2014 this mirrors the real business rule that Admin controls visibility.

## What's intentionally mocked for the MVP

- **Guest checkout only**: name, phone, address collected at checkout, no login.
- **AI recommendations**: rule-based (same category / section / veg-match / popularity) in `recommendFor()` \u2014 swap for a real model later without changing the UI.
- **Order tracking**: status advances automatically based on time elapsed since the order was placed.
- **Recurring orders**: the checkbox at checkout stores the intent (`isRecurring`, `recurringTime`) on the order; no scheduler runs yet.

## Migrating toward production

This code is intentionally structured so the UI layer can be kept largely as-is:

1. Replace `data/menu-data.ts` / `data/bar-data.ts` reads with Supabase queries (same `MenuItem` shape).
2. Replace `context/AppContext.tsx` localStorage persistence with real API calls (cart \u2192 Supabase table, orders \u2192 orders table), keeping the same context interface so components don't change.
3. Replace `simulatedStatus()` with a realtime subscription to order status.
4. Add real authentication on top of the existing guest flow (guest-first, upgrade to account).
