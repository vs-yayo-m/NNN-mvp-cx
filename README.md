# Nom Nom Now Customer MVP

Next.js 15 prototype for the Butwal customer ordering flow. Data is localStorage-backed; Groq routes fall back locally if `GROQ_API_KEY` is missing.

## Run
`npm install && npm run dev`

## Images
Menu data accepts either external URLs or local files such as `/menu/momo.jpg`. `next.config.ts` currently uses unoptimized images so arbitrary demo URLs and local paths both work; tighten this later with explicit `remotePatterns`.

## Demo timings
Order tracking advances at 0s, 10s, 25s, and 45s in `src/modules/order-tracking/components/OrderStatusStepper.tsx`.
