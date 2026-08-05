# Nom Nom Now — Customer App (Phase A + Phase B Complete)

A full customer ordering app: Home → AI Search → Menu → Cart (with AI combo
suggestions) → Guest or Logged-in Checkout → Order Confirmation → Live Order
Tracking → OTP Login → Profile (Order History, Saved Addresses, Recurring
Orders). AI search and recommendations are powered by a real Groq API call
with automatic fallback if the key is missing or the request fails.

## Before your ownership demo — two things to do

### 1. Get a free Groq API key (takes about 2 minutes)

AI-powered search, "Recommended for You," the "Ask AI" panel, and cart combo
suggestions all use Groq's API. Without a key, the app still works completely
— it automatically falls back to local matching/popularity logic — but the
AI features are noticeably smarter with a real key connected.

1. Go to **console.groq.com/keys** and sign up (no credit card required).
2. Create a new API key and copy it.
3. In Vercel: open your project, then Settings, then Environment Variables,
   then add a variable named `GROQ_API_KEY` with your key as the value, then
   Save.
4. Redeploy (Vercel does this automatically on the next push, or you can
   trigger a redeploy manually from the Deployments tab).

Groq's free tier is generous enough for a live demo and typical daily use
(1,000 requests/day on the model this app uses). If you ever see AI features
acting generic, check that the key is set correctly and hasn't hit its
daily limit.

### 2. Replace the placeholder menu with your real menu

The real Nom Nom Now menu (exact items, variants, and prices) was not
available when this build was generated, so `src/data/menu.ts` currently
contains realistic placeholder dishes built to the same structure your real
menu will use.

1. Open `src/data/menu.ts`.
2. Replace each item's name, description, image, and variants with your
   real data. Keep the shape of each object exactly the same.
3. Keep a couple of items with `isAvailable: false` — this proves the
   "hidden when unavailable" rule during a demo.
4. Category labels/icons live in `src/data/categories.ts`. Icons are Lucide
   icon names, not emoji — see `src/lib/categoryIcons.tsx` for the full list
   of icon names available, or ask to add more.

## Adding your own images

Each menu item's image field accepts either:
- A full web address, e.g. "https://yoursite.com/photos/momo.jpg"
- A local file path, e.g. "/menu/momo.jpg" — place the actual image file in
  the public/menu/ folder in this repo, using the same filename.

If an image fails to load for any reason, the app automatically shows a
branded placeholder icon instead of a broken image.

## Running this project

You do not need a computer or terminal for day-to-day changes — edit files
directly on GitHub or in SPCk and Vercel will redeploy automatically.

If you (or a developer) ever want to run it locally:
```
npm install
npm run dev
```
Then open http://localhost:3000.

## Deploying to Vercel

1. Push this repo to GitHub.
2. In Vercel, "Add New Project" and import this GitHub repo.
3. Add the GROQ_API_KEY environment variable (see above) — optional but
   recommended.
4. Leave build settings at their defaults (Vercel auto-detects Next.js).
5. Deploy. Every future push to your main branch redeploys automatically.

## What's real vs. simulated

Real: the full UI, all cart/checkout/order logic, OTP login flow, order
status progression, promo code validation, veg/category filtering, saved
addresses, recurring order configuration, and — with a Groq key set — real
AI-powered search and recommendations.

Simulated by design: there is no real backend — cart, login sessions, order
history, saved addresses, and recurring orders all live in your browser's
localStorage. Payment methods (COD/eSewa/Khalti) are visual only, no real
transaction happens. OTP is not sent by real SMS — the code is shown on
screen (1234) since there's no SMS provider connected yet. Recurring orders
show the configuration and management UI only — no background job actually
places orders on a schedule.

Demo OTP code: always 1234, shown directly on the verification screen.

## AI features — how they work

- Search (/search, header search bar): understands typos and cuisine-style
  descriptions ("chiken biryani" finds chicken biryani). Only ever returns
  items that actually exist in your menu — a hallucinated dish can never
  reach the screen, because the server validates every result against
  data/menu.ts before responding.
- Recommended for You (home page): generic/popular items when logged out;
  genuinely personalized toward your most-ordered categories once someone
  has order history.
- Cart combo suggestions: suggests complementary items based on what's
  currently in the cart (e.g. a drink alongside Momo), like a good server
  would.
- "Not sure what to eat?" (home page): free-text mood/craving search
  ("something spicy and quick") that returns tappable, add-to-cart-ready
  suggestions.
- Fallback: every AI feature has a deterministic local fallback
  (lib/localSearch.ts, lib/localRecommend.ts) that activates automatically
  if Groq is unavailable, times out, or the API key is missing — the app
  never shows an error to the customer.

## Tunable timings

Order status auto-advances during tracking so a live demo visibly
progresses. These timings live in src/lib/orderStore.tsx under
STATUS_TIMELINE_SECONDS — currently: Preparing at 8s, Out for
Delivery/Ready for Pickup at 22s, Delivered/Completed at 40s after order
placement. Adjust these numbers before a real demo if you want more or less
time per stage.

## Design system

- Colors, fonts, spacing: defined once in tailwind.config.ts — never
  hardcoded in components. Primary brand color is a chili red-orange
  (brand-500), with a turmeric gold accent (gold-400) for specials/badges
  and a deep green (bar-900) reserved for the Bar category only.
- Icons: every icon in the app is a real vector icon from Lucide
  (lucide.dev) — no emoji anywhere in the UI. Instagram and TikTok's logos
  are hand-built SVG marks in src/components/icons/socialIcons.tsx since
  Lucide intentionally doesn't ship trademarked brand logos.
- Fonts: Fraunces (headings) plus Inter (body), self-hosted via next/font
  so they load reliably without a runtime Google Fonts request.

## Contact & social links

Your real contact info is wired into the desktop footer and the mobile
Profile page:
- WhatsApp: +977 970-505-9677
- Instagram: instagram.com/nomnomnowbtl
- TikTok: linked via short link
- Website: nomnomnow.com.np (marked "coming soon")

To update any of these, edit src/components/layout/Footer.tsx and
src/components/layout/ContactLinks.tsx (both use the same CONTACT object at
the top of each file).

## Project structure

```
src/
  app/            pages (routes) and API routes (ai-search, ai-recommend)
  components/     shared layout (Header, BottomNav, Footer, ContactLinks)
                  and brand icon SVGs
  modules/        feature components, grouped by domain:
                  home, menu, search, cart, checkout, auth,
                  order-tracking, recurring-orders
  data/           menu.ts, categories.ts, promoCodes.ts — YOUR CONTENT
  lib/            state management, Groq client, AI helpers, utilities
  types/          shared TypeScript type definitions
public/
  menu/           put your own food photos here (optional)
  logo/           put your logo file here
```

## Non-goals (intentionally not built)

No Admin app, no Delivery app, no real authentication/backend, no real
payment processing, no real SMS/OTP delivery, no multi-branch switching
(Butwal is the only location, structured so it's easy to extend later), no
native app, no automated recurring-order execution (configuration UI only).
