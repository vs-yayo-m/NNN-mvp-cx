// ============================================================================
// HeroBanner — hero section with brand tagline and primary CTA.
// ============================================================================

import Link from "next/link";
import { ArrowRight, UtensilsCrossed } from "lucide-react";

export default function HeroBanner() {
  return (
    <section className="relative overflow-hidden rounded-xl2 bg-gradient-to-br from-brand-500 to-brand-600 px-6 py-10 sm:py-14 text-cream-100">
      <div className="relative z-10 max-w-md">
        <p className="text-sm font-medium text-brand-100 mb-2">
          Butwal · Restaurant · Cloud Kitchen · Bar
        </p>
        <h1 className="font-display text-3xl sm:text-4xl font-semibold leading-tight">
          Good food, ordered in seconds.
        </h1>
        <p className="mt-3 text-brand-50/90 text-sm sm:text-base">
          Momo, biryani, pizza, and a full bar menu — delivered hot or ready for pickup.
        </p>
        <Link
          href="/menu"
          className="inline-flex items-center gap-2 mt-6 rounded-full bg-cream-100 px-6 py-3 font-semibold text-brand-600 hover:bg-cream-200 transition-colors"
        >
          Order Now
          <ArrowRight className="h-4 w-4" strokeWidth={2.25} aria-hidden />
        </Link>
      </div>
      <UtensilsCrossed
        className="absolute -right-8 -bottom-10 h-64 w-64 text-cream-100/10 rotate-12"
        strokeWidth={1}
        aria-hidden
      />
    </section>
  );
}
