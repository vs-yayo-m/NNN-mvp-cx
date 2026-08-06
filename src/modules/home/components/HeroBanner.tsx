// /src/modules/home/components/HeroBanner.tsx

import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function HeroBanner() {
  return (
    <section className="relative isolate -mx-4 h-[86vh] min-h-[560px] w-screen overflow-hidden sm:-mx-6 sm:h-[92vh] lg:mx-0 lg:h-[90vh] lg:w-full">
      {/* Background video — full bleed, no frame */}
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
        className="absolute inset-0 bg-gradient-to-t from-ink-900 via-ink-900/35 to-transparent"
        aria-hidden
      />
      <div
        className="absolute inset-0 bg-gradient-to-r from-ink-900/55 via-transparent to-transparent"
        aria-hidden
      />

      {/* Content */}
      <div className="relative z-10 flex h-full flex-col justify-end px-5 pb-10 sm:px-10 sm:pb-14 lg:px-16 lg:pb-16">
        <p className="font-body text-[0.7rem] font-semibold uppercase tracking-[0.32em] text-cream-100/70">
          Butwal — No. 1 Food Delivery Restaurant
        </p>

        <h1 className="mt-3 font-display text-[3.1rem] font-medium leading-[0.92] tracking-tight text-cream-100 sm:text-[5rem] lg:text-[6.5rem]">
          Order now.
          <br />
          <span className="italic text-gold-400">Nom nom</span> now.
        </h1>

        <p className="mt-5 max-w-[26rem] font-body text-[0.95rem] leading-relaxed text-cream-100/75 sm:text-base">
          Momo, biryani, wood-fired pizza and a full bar — cooked to order,
          delivered hot across Butwal.
        </p>

        <Link
          href="/menu"
          className="group mt-8 inline-flex w-fit items-center gap-3 border-b border-cream-100/40 pb-1.5 font-display text-lg font-medium text-cream-100 transition-colors hover:border-gold-400 hover:text-gold-400 sm:text-xl"
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
