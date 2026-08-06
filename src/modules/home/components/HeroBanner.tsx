// /src/modules/home/components/HeroBanner.tsx

import Link from "next/link";
import { ArrowRight, Star } from "lucide-react";

const DISH_STRIP = [
  "Momo",
  "Biryani",
  "Wood-fired Pizza",
  "Sizzlers",
  "Craft Cocktails",
  "Thukpa",
  "Tandoori Grill",
];

export default function HeroBanner() {
  return (
    <section className="relative isolate overflow-hidden rounded-xl2 text-cream-100">
      {/* Background video — looping food footage */}
      <video
        className="absolute inset-0 h-full w-full object-cover"
        src="https://b.zmtcdn.com/data/file_assets/2627bbed9d6c068e50d2aadcca11ddbb1743095925.mp4"
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        aria-hidden
      />

      {/* Scrim: anchors legibility without flattening the footage */}
      <div
        className="absolute inset-0 bg-gradient-to-t from-ink-900/90 via-ink-900/50 to-ink-900/10"
        aria-hidden
      />
      <div
        className="absolute inset-0 bg-gradient-to-r from-ink-900/70 via-ink-900/10 to-transparent"
        aria-hidden
      />

      {/* Content */}
      <div className="relative z-10 flex min-h-[26rem] flex-col justify-end px-6 py-8 sm:min-h-[32rem] sm:py-12">
        <div className="max-w-lg">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-cream-100/10 px-3 py-1 text-xs font-medium tracking-wide text-cream-100 ring-1 ring-inset ring-cream-100/25 backdrop-blur-sm">
            <Star className="h-3.5 w-3.5 fill-gold-400 text-gold-400" strokeWidth={0} aria-hidden />
            No. 1 Food Delivery Restaurant in Butwal
          </span>

          <h1 className="mt-4 font-display text-4xl font-semibold leading-[1.05] sm:text-6xl">
            Order Now.
            <br />
            <span className="text-gold-400">Nom Nom</span> Now.
          </h1>

          <p className="mt-4 max-w-sm text-sm text-cream-100/80 sm:text-base">
            Momo, biryani, pizza, and a full bar menu — delivered hot or ready for pickup, from Butwal&apos;s most-loved kitchen.
          </p>

          <div className="mt-7 flex flex-wrap items-center gap-4">
            <Link
              href="/menu"
              className="inline-flex items-center gap-2 rounded-full bg-brand-500 px-6 py-3 font-semibold text-cream-100 transition-colors hover:bg-brand-600"
            >
              Order Now
              <ArrowRight className="h-4 w-4" strokeWidth={2.25} aria-hidden />
            </Link>
            <span className="text-xs font-medium uppercase tracking-wider text-cream-100/60">
              Delivery &amp; pickup · Open daily
            </span>
          </div>
        </div>

        {/* Signature: looping strip of what's cooking, echoing the video's motion */}
        <div
          className="group relative mt-9 -mx-6 overflow-hidden border-t border-cream-100/15 sm:-mx-0 sm:rounded-full sm:border sm:bg-ink-900/25 sm:backdrop-blur-sm"
          aria-hidden
        >
          <div className="flex w-max animate-marquee gap-8 whitespace-nowrap py-3 pl-6 group-hover:[animation-play-state:paused] motion-reduce:animate-none">
            {[...DISH_STRIP, ...DISH_STRIP].map((dish, i) => (
              <span
                key={`${dish}-${i}`}
                className="text-xs font-medium uppercase tracking-[0.15em] text-cream-100/70"
              >
                {dish}
                <span className="ml-8 text-gold-400/70">•</span>
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
