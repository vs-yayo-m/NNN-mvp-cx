// /src/modules/home/components/HeroBanner.tsx

import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function HeroBanner() {
  return (
    <section
      className="relative isolate w-full overflow-hidden
        aspect-[3/4] sm:aspect-[16/10] lg:aspect-[21/9]
        max-h-[46rem]"
    >
      {/* Background video — deliberate aspect-ratio per breakpoint instead
          of a vh guess, so object-cover crops predictably on every screen
          rather than however much vertical space happens to be left. */}
      <video
        className="absolute inset-0 h-full w-full object-cover"
        src="https://b.zmtcdn.com/data/file_assets/2627bbed9d6c068e50d2aadcca11ddbb1743095810.mp4"
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        aria-hidden
      />

      {/* Single, quiet scrim — strongest low-left where the type sits */}
      <div
        className="absolute inset-0 bg-gradient-to-t from-ink-900 via-ink-900/30 to-transparent"
        aria-hidden
      />
      <div
        className="absolute inset-0 bg-gradient-to-r from-ink-900/50 via-transparent to-transparent"
        aria-hidden
      />

      {/* Content */}
      <div className="relative z-10 flex h-full flex-col justify-end px-5 pb-9 sm:px-10 sm:pb-12 lg:px-16 lg:pb-14">
        <p className="font-body text-[0.68rem] font-semibold uppercase tracking-[0.32em] text-cream-100/70">
          Butwal — No. 1 Food Delivery Restaurant
        </p>

        <h1 className="mt-3 font-display text-[2.75rem] font-medium leading-[0.92] tracking-tight text-cream-100 sm:text-[4.5rem] lg:text-[6rem]">
          Order now.
          <br />
          <span className="italic text-gold-400">Nom nom</span> now.
        </h1>

        <p className="mt-4 max-w-[24rem] font-body text-[0.9rem] leading-relaxed text-cream-100/75 sm:text-base">
          Momo, biryani, wood-fired pizza and a full bar — cooked to order,
          delivered hot across Butwal.
        </p>

        <Link
          href="/menu"
          className="group mt-7 inline-flex w-fit items-center gap-3 border-b border-cream-100/40 pb-1.5 font-display text-lg font-medium text-cream-100 transition-colors hover:border-gold-400 hover:text-gold-400 sm:text-xl"
        >
          View the menu
          <ArrowRight
            className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1.5"
            strokeWidth={2}
            aria-hidden
          />
        </Link>
      </div>
    </section>
  );
}
