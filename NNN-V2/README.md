# Nom Nom Now — Customer App (Phase A)

This is the Phase A build: a working, deployable customer ordering app covering
the full happy-path journey (Home → Menu → Cart → Guest Checkout →
Confirmation → Live Order Tracking → OTP Login → Profile). AI search and
recommendations use local logic in this phase — Groq is wired in Phase B.

## ⚠️ Before your ownership demo — replace the menu data

The real Nom Nom Now menu (exact items, variants, and prices) was not
available when this build was generated, so `src/data/menu.ts` currently
contains realistic **placeholder** dishes built to the same structure your
real menu will use. Before showing this to anyone outside your team:

1. Open `src/data/menu.ts`.
2. Replace each item's `name`, `description`, `image`, and `variants` with
   your real data. Keep the shape of each object exactly the same.
3. Keep a couple of items with `isAvailable: false` — this proves the
   "hidden when unavailable" rule during a demo.
4. Category labels/icons live in `src/data/categories.ts`.

## Adding your own images

Each menu item's `image` field accepts either:
- A full web address, e.g. `"https://yoursite.com/photos/momo.jpg"`
- A local file path, e.g. `"/menu/momo.jpg"` — place the actual image file
  in the `public/menu/` folder in this repo, using the same filename.

If an image fails to load for any reason, the app automatically shows a
branded placeholder instead of a broken image icon.

## Running this project

You do not need a computer or terminal for day-to-day changes — edit files
directly on GitHub or in SPCk and Vercel will redeploy automatically.

If you (or a developer) ever want to run it locally:
```
npm install
npm run dev
```
Then open `http://localhost:3000`.

## Deploying to Vercel

1. Push this repo to GitHub (already done if you're reading this there).
2. In Vercel, "Add New Project" → import this GitHub repo.
3. No environment variables are required for Phase A. Leave build settings
   at their defaults (Vercel auto-detects Next.js).
4. Deploy. Every future push to your main branch redeploys automatically.

## What's real vs. simulated in Phase A

- **Real:** the full UI, all cart/checkout/order logic, OTP login flow,
  order status progression, promo code validation, veg/category filtering.
- **Simulated (by design, per the blueprint):** there is no real backend —
  cart, login sessions, and order history all live in your browser's
  `localStorage`. Payment methods (COD/eSewa/Khalti) are visual only, no
  real transaction happens. OTP is not sent by real SMS — the code is shown
  on screen (`1234`) since there's no SMS provider connected yet.
- **Demo OTP code:** always `1234`, shown directly on the verification
  screen.

## Tunable timings

Order status auto-advances during tracking so a live demo visibly
progresses. These timings live in `src/lib/orderStore.ts` under
`STATUS_TIMELINE_SECONDS` — currently: Preparing at 8s, Out for
Delivery/Ready for Pickup at 22s, Delivered/Completed at 40s after order
placement. Adjust these numbers before a real demo if you want more or
less time per stage.

## What's coming in Phase B

Real Groq-powered AI search and recommendations, the full home page
(hero rails, "Ask AI" panel), saved addresses, recurring orders, promo
code UI polish, and payment method selection polish. Phase A is
structured so none of this requires rebuilding what's already here.

## Project structure

```
src/
  app/            → pages (routes), matches the URL structure directly
  components/     → shared layout (Header, BottomNav, Footer)
  modules/        → feature components (menu, cart, auth)
  data/           → menu.ts, categories.ts, promoCodes.ts — YOUR CONTENT
  lib/            → state management + helper functions
  types/          → shared TypeScript type definitions
public/
  menu/           → put your own food photos here (optional)
  logo/           → put your logo file here
```
