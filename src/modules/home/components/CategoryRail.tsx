// /src/modules/home/components/CategoryRail.tsx
"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { foodCategories, barCategories } from "@/data/categories";
import { useMarqueeScroll } from "@/hooks/useMarqueeScroll";
import type { Category } from "@/types";

interface CategoryRailProps {
  /** Which category id is currently active/selected, if any (e.g. from URL). */
  activeCategoryId?: string;
}

export default function CategoryRail({ activeCategoryId }: CategoryRailProps) {
  const allCategories = useMemo(
    () => [...foodCategories, ...barCategories],
    []
  );

  const { containerRef, interactionHandlers, isPaused } =
    useMarqueeScroll<HTMLDivElement>({
      speed: 60,
      resumeDelay: 2400,
      enabled: allCategories.length > 3,
    });

  // Render the list twice back-to-back for the seamless-loop illusion.
  const loopedCategories = [...allCategories, ...allCategories];

  return (
    <section
      aria-label="Browse categories"
      className="relative"
    >
      <div className="flex items-baseline justify-between mb-4 px-4">
        <h2 className="font-display text-[1.375rem] font-bold tracking-tight text-ink-900">
          What's on your mind? 
        </h2>
        <span className="text-xs font-medium text-ink-400">
          Swipe to explore
        </span>
      </div>

      <div className="relative">
        {/* Edge fades — signal there's more content off-screen, and hide the loop seam */}
        <div
          aria-hidden
          className="pointer-events-none absolute left-0 top-0 bottom-0 w-10 z-10 bg-gradient-to-r from-cream-50 to-transparent"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute right-0 top-0 bottom-0 w-10 z-10 bg-gradient-to-l from-cream-50 to-transparent"
        />

        <div
          ref={containerRef}
          role="list"
          tabIndex={0}
          aria-label="Category list, horizontally scrollable"
          className="flex gap-4 overflow-x-auto overscroll-x-contain no-scrollbar scroll-smooth px-4 py-1 cursor-grab active:cursor-grabbing [&::-webkit-scrollbar]:hidden"
          style={{ scrollbarWidth: "none" }}
          {...interactionHandlers}
        >
          {loopedCategories.map((cat, i) => (
            <CategoryTile
              key={`${cat.id}-${i}`}
              category={cat}
              isActive={cat.id === activeCategoryId}
              // Only the first copy of each item is a real tab stop / SEO
              // target; duplicates are presentational for the loop.
              ariaHidden={i >= allCategories.length}
            />
          ))}
        </div>
      </div>

      <span className="sr-only" role="status" aria-live="polite">
        {isPaused ? "Category scroll paused" : ""}
      </span>
    </section>
  );
}

function CategoryTile({
  category,
  isActive,
  ariaHidden,
}: {
  category: Category;
  isActive: boolean;
  ariaHidden: boolean;
}) {
  const [imgError, setImgError] = useState(false);
  const isBar = category.group === "bar";

  return (
    <Link
      href={`/menu?category=${category.id}`}
      role="listitem"
      aria-hidden={ariaHidden || undefined}
      tabIndex={ariaHidden ? -1 : 0}
      draggable={false}
      className={`
        group relative shrink-0 w-[7.5rem] aspect-[4/5] rounded-[1.25rem]
        overflow-hidden select-none
        ring-1 ring-black/5
        shadow-[0_1px_2px_rgba(20,12,4,0.06),0_8px_20px_-8px_rgba(20,12,4,0.18)]
        transition-[transform,box-shadow] duration-300 ease-out
        hover:-translate-y-1 hover:shadow-[0_4px_10px_rgba(20,12,4,0.1),0_20px_36px_-12px_rgba(20,12,4,0.30)]
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2
        ${isBar ? "focus-visible:ring-bar-900" : "focus-visible:ring-brand-500"}
        ${isActive ? (isBar ? "ring-2 ring-bar-900" : "ring-2 ring-brand-500") : ""}
      `}
    >
      {/* Photo layer */}
      <div className="absolute inset-0 bg-ink-100">
        {!imgError ? (
          <Image
            src={category.image}
            alt=""
            fill
            draggable={false}
            sizes="120px"
            className="object-cover transition-transform duration-500 ease-out group-hover:scale-110"
            onError={() => setImgError(true)}
          />
        ) : (
          // Graceful fallback if a hotlinked image ever fails to load
          <div
            className={`absolute inset-0 flex items-center justify-center text-3xl font-display font-bold ${
              isBar
                ? "bg-bar-900/10 text-bar-900"
                : "bg-brand-500/10 text-brand-500"
            }`}
          >
            {category.label.charAt(0)}
          </div>
        )}
      </div>

      {/* Cinematic scrim so the label is always legible over any photo */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-black/0" />

      {/* Subtle top sheen for a premium glassy feel */}
      <div className="absolute inset-x-0 top-0 h-10 bg-gradient-to-b from-white/25 to-transparent opacity-70" />

      {/* Active checkmark badge */}
      {isActive && (
        <div
          className={`absolute top-2 right-2 h-5 w-5 rounded-full flex items-center justify-center shadow-sm ${
            isBar ? "bg-bar-900" : "bg-brand-500"
          }`}
        >
          <svg
            viewBox="0 0 24 24"
            className="h-3 w-3 text-white"
            fill="none"
            stroke="currentColor"
            strokeWidth={3}
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M20 6 9 17l-5-5" />
          </svg>
        </div>
      )}

      {/* Bar-group ribbon */}
      {isBar && (
        <span className="absolute top-2 left-2 rounded-full bg-white/90 backdrop-blur px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide text-bar-900 shadow-sm">
          Bar
        </span>
      )}

      {/* Label */}
      <div className="absolute inset-x-0 bottom-0 p-2.5">
        <p className="font-display text-[0.9rem] font-bold leading-tight text-white drop-shadow-sm">
          {category.label}
        </p>
        {category.tagline && (
          <p className="mt-0.5 text-[10.5px] leading-snug text-white/75 line-clamp-1">
            {category.tagline}
          </p>
        )}
      </div>
    </Link>
  );
}
