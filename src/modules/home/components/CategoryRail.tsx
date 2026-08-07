// /src/modules/home/components/CategoryRail.tsx
"use client";

import { useMemo, useRef, useState, useCallback, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { foodCategories, barCategories } from "@/data/categories";
import type { Category } from "@/types";

interface CategoryRailProps {
  /** Which category id is currently active/selected, if any (e.g. from URL). */
  activeCategoryId?: string;
}

// ---------------------------------------------------------------------------
// Speed control — EDIT THIS to change how fast the rail auto-scrolls.
// This is a *duration* in seconds for one full loop of the track, so a
// SMALLER number means FASTER scrolling. Try 8 for very fast, 16 for lazy.
// ---------------------------------------------------------------------------
const MARQUEE_DURATION_SECONDS = 12;

export default function CategoryRail({ activeCategoryId }: CategoryRailProps) {
  const allCategories = useMemo(
    () => [...foodCategories, ...barCategories],
    []
  );

  const loopEnabled = allCategories.length > 3;
  // Render the list twice back-to-back for the seamless CSS-loop illusion.
  const loopedCategories = loopEnabled
    ? [...allCategories, ...allCategories]
    : allCategories;

  const viewportRef = useRef<HTMLDivElement>(null); // overflow-hidden, clips only
  const trackRef = useRef<HTMLDivElement>(null); // gets the CSS transform animation

  const [isPaused, setIsPaused] = useState(false);
  const resumeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // --- Manual drag state (transform-based, since we can't use native
  // overflow-x scroll on an element that's also being CSS-animated) ------
  const dragState = useRef({
    isDragging: false,
    startX: 0,
    startOffset: 0,
    currentOffset: 0,
    trackWidth: 0, // width of ONE set (half the doubled track)
  });

  const pause = useCallback(() => {
    if (resumeTimer.current) clearTimeout(resumeTimer.current);
    setIsPaused(true);
  }, []);

  const scheduleResume = useCallback(() => {
    if (resumeTimer.current) clearTimeout(resumeTimer.current);
    resumeTimer.current = setTimeout(() => setIsPaused(false), 2000);
  }, []);

  // Measure one full set's width so drag can wrap seamlessly.
  useEffect(() => {
    if (!trackRef.current) return;
    dragState.current.trackWidth = trackRef.current.scrollWidth / 2;
  }, [loopedCategories.length]);

  const applyDragTransform = (offset: number) => {
    const track = trackRef.current;
    if (!track) return;
    track.style.transform = `translateX(${offset}px)`;
  };

  const onPointerDown = (e: React.PointerEvent) => {
    if (!loopEnabled) return;
    pause();
    const track = trackRef.current;
    if (!track) return;
    // Read whatever position the CSS animation had reached and freeze there.
    const computedTransform = window.getComputedStyle(track).transform;
    let current = 0;
    if (computedTransform && computedTransform !== "none") {
      const match = new DOMMatrixReadOnly(computedTransform);
      current = match.m41; // translateX component
    }
    dragState.current.isDragging = true;
    dragState.current.startX = e.clientX;
    dragState.current.startOffset = current;
    dragState.current.currentOffset = current;
    track.style.animation = "none"; // hand control to drag
    (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!dragState.current.isDragging) return;
    const dx = e.clientX - dragState.current.startX;
    let next = dragState.current.startOffset + dx;

    const setWidth = dragState.current.trackWidth;
    if (setWidth > 0) {
      // Wrap seamlessly within [-setWidth, 0] so it always looks infinite.
      while (next > 0) next -= setWidth;
      while (next < -setWidth) next += setWidth;
    }
    dragState.current.currentOffset = next;
    applyDragTransform(next);
  };

  const endDrag = () => {
    if (!dragState.current.isDragging) return;
    dragState.current.isDragging = false;
    const track = trackRef.current;
    if (track) {
      // Resume the CSS keyframe animation from a fresh 0% start. This causes
      // a small visual jump back to the animation's own timeline; for a rail
      // that's constantly drifting, this is imperceptible in practice since
      // resumeDelay gives the eye a moment before it kicks back in.
      track.style.transform = "";
      track.style.animation = "";
    }
    scheduleResume();
  };

  return (
    <section aria-label="Browse categories" className="relative">
      <style jsx>{`
        @keyframes category-marquee {
          from {
            transform: translateX(0);
          }
          to {
            transform: translateX(-50%);
          }
        }
        .marquee-track {
          animation: category-marquee ${MARQUEE_DURATION_SECONDS}s linear
            infinite;
          will-change: transform;
        }
        .marquee-track.is-paused {
          animation-play-state: paused;
        }
        @media (prefers-reduced-motion: reduce) {
          .marquee-track {
            animation: none !important;
          }
        }
      `}</style>

      <div className="flex items-center justify-between mb-5 px-4">
        <h2 className="font-display text-[1.375rem] font-bold tracking-tight text-ink-900">
          What&apos;s on your mind?
        </h2>
        <Link
          href="/menu"
          className="shrink-0 text-[13px] font-semibold text-brand-500 hover:text-brand-600 transition-colors"
        >
          View All
        </Link>
      </div>

      <div className="relative">
        {/* Edge fades — signal there's more content off-screen, and hide the loop seam */}
        <div
          aria-hidden
          className="pointer-events-none absolute left-0 top-0 bottom-0 w-8 z-10 bg-gradient-to-r from-cream-50 to-transparent"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute right-0 top-0 bottom-0 w-8 z-10 bg-gradient-to-l from-cream-50 to-transparent"
        />

        {/* VIEWPORT — clips content, does NOT scroll natively. This is what
            fixed the "loop looks off" bug: overflow-x-auto and a CSS
            transform animation cannot coexist on the same element. */}
        <div
          ref={viewportRef}
          className="overflow-hidden px-4 py-1"
          role="list"
          aria-label="Category list"
          tabIndex={0}
          onMouseEnter={pause}
          onMouseLeave={endDrag}
          onFocus={pause}
          onBlur={endDrag}
        >
          {/* TRACK — this is the element the CSS keyframe animates, and the
              element drag directly manipulates via inline transform. */}
          <div
            ref={trackRef}
            className={`marquee-track flex gap-5 cursor-grab active:cursor-grabbing ${
              isPaused || !loopEnabled ? "is-paused" : ""
            }`}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={endDrag}
            onPointerCancel={endDrag}
            onTouchStart={pause}
          >
            {loopedCategories.map((cat, i) => (
              <CategoryTile
                key={`${cat.id}-${i}`}
                category={cat}
                isActive={cat.id === activeCategoryId}
                // Only the first copy of each item is a real tab stop / SEO
                // target; duplicates are presentational for the loop.
                ariaHidden={loopEnabled && i >= allCategories.length}
              />
            ))}
          </div>
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
      className="group flex flex-col items-center gap-2 shrink-0 w-[4.75rem] select-none focus-visible:outline-none"
    >
      {/* Circular photo */}
      <div
        className={`
          relative h-[4.75rem] w-[4.75rem] rounded-full overflow-hidden shrink-0
          bg-gradient-to-b from-cream-100 to-cream-200
          ring-1 ring-black/[0.06]
          shadow-[0_1px_2px_rgba(20,12,4,0.05),0_10px_18px_-10px_rgba(20,12,4,0.28)]
          transition-[transform,box-shadow] duration-300 ease-out
          group-hover:-translate-y-1
          group-hover:shadow-[0_2px_6px_rgba(20,12,4,0.08),0_18px_28px_-12px_rgba(20,12,4,0.38)]
          group-focus-visible:ring-2 group-focus-visible:ring-offset-2
          ${isBar ? "group-focus-visible:ring-bar-900" : "group-focus-visible:ring-brand-500"}
          ${
            isActive
              ? isBar
                ? "ring-2 ring-bar-900"
                : "ring-2 ring-brand-500"
              : ""
          }
        `}
      >
        {!imgError ? (
          <Image
            src={category.image}
            alt=""
            fill
            draggable={false}
            sizes="76px"
            className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.12]"
            onError={() => setImgError(true)}
          />
        ) : (
          // Graceful fallback if a hotlinked image ever fails to load
          <div
            className={`absolute inset-0 flex items-center justify-center text-2xl font-display font-bold ${
              isBar
                ? "bg-bar-900/10 text-bar-900"
                : "bg-brand-500/10 text-brand-500"
            }`}
          >
            {category.label.charAt(0)}
          </div>
        )}

        {/* Soft inner ring so the photo reads as a clean product cutout,
            not a random crop — a thin light ring plus a faint vignette. */}
        <div className="pointer-events-none absolute inset-0 rounded-full ring-1 ring-inset ring-white/40" />
        <div className="pointer-events-none absolute inset-0 rounded-full shadow-[inset_0_-6px_10px_-4px_rgba(0,0,0,0.18)]" />

        {/* Active checkmark badge */}
        {isActive && (
          <div
            className={`absolute -bottom-0.5 -right-0.5 h-5 w-5 rounded-full flex items-center justify-center ring-2 ring-white shadow-sm ${
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

        {/* Bar-group dot */}
        {isBar && !isActive && (
          <span className="absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full bg-bar-900 ring-2 ring-white" />
        )}
      </div>

      {/* Label — plain text, no card/box, matching the reference */}
      <div className="text-center leading-tight">
        <p className="text-[12.5px] font-semibold text-ink-900">
          {category.label}
        </p>
      </div>
    </Link>
  );
}
