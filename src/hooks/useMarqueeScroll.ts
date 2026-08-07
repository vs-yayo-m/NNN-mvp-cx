// src/hooks/useMarqueeScroll.ts


"use client";

import { useCallback, useEffect, useRef, useState } from "react";

interface UseMarqueeScrollOptions {
  /** Pixels per second the track drifts when idle. */
  speed?: number;
  /** Ms of inactivity after manual interaction before auto-scroll resumes. */
  resumeDelay?: number;
  /** Disable entirely (e.g. reduced-motion or < 2 items). */
  enabled?: boolean;
}

/**
 * Drives a seamless, infinitely-looping horizontal strip that is ALSO fully
 * manually scrollable (mouse drag, touch swipe, trackpad, wheel, keyboard).
 *
 * Strategy: the caller renders the item list TWICE back-to-back inside the
 * scroll container. We auto-advance `scrollLeft` with rAF at a constant
 * speed, and once the scroll position passes the width of one full set, we
 * silently subtract that width — producing an invisible, seamless wrap with
 * zero "snap back" flash. Manual interaction (pointer down, wheel, touch,
 * focus-within) pauses the drift immediately and resumes it after a short
 * idle delay, so the two modes never fight each other.
 */
export function useMarqueeScroll<T extends HTMLElement>({
  speed = 60,
  resumeDelay = 2200,
  enabled = true,
}: UseMarqueeScrollOptions = {}) {
  const containerRef = useRef<T | null>(null);
  const [isPaused, setIsPaused] = useState(false);

  const rafRef = useRef<number | null>(null);
  const lastTsRef = useRef<number | null>(null);
  const resumeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pausedRef = useRef(false);
  const setWidthRef = useRef(0);

  const pause = useCallback(() => {
    pausedRef.current = true;
    setIsPaused(true);
    if (resumeTimerRef.current) clearTimeout(resumeTimerRef.current);
  }, []);

  const scheduleResume = useCallback(() => {
    if (resumeTimerRef.current) clearTimeout(resumeTimerRef.current);
    resumeTimerRef.current = setTimeout(() => {
      pausedRef.current = false;
      setIsPaused(false);
      lastTsRef.current = null;
    }, resumeDelay);
  }, [resumeDelay]);

  // Measure the width of a single item-set (half of scrollWidth, since we
  // render the list twice) so we know when to wrap.
  const measure = useCallback(() => {
    const el = containerRef.current;
    if (!el) return;
    setWidthRef.current = el.scrollWidth / 2;
  }, []);

  useEffect(() => {
    if (!enabled) return;
    if (typeof window !== "undefined") {
      const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;
      if (prefersReducedMotion) return; // manual scroll only, no auto-drift
    }
    const el = containerRef.current;
    if (!el) return;

    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);

    const step = (ts: number) => {
      rafRef.current = requestAnimationFrame(step);
      if (pausedRef.current || !el) return;
      if (lastTsRef.current == null) {
        lastTsRef.current = ts;
        return;
      }
      const dt = (ts - lastTsRef.current) / 1000;
      lastTsRef.current = ts;

      el.scrollLeft += speed * dt;

      const setWidth = setWidthRef.current;
      if (setWidth > 0 && el.scrollLeft >= setWidth) {
        el.scrollLeft -= setWidth;
      }
    };
    rafRef.current = requestAnimationFrame(step);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      ro.disconnect();
    };
  }, [enabled, speed, measure]);

  // Manual interaction handlers — pause immediately, resume after idle.
  const interactionHandlers = enabled
    ? {
        onPointerDown: pause,
        onPointerUp: scheduleResume,
        onPointerCancel: scheduleResume,
        onWheel: () => {
          pause();
          scheduleResume();
        },
        onTouchStart: pause,
        onTouchEnd: scheduleResume,
        onFocus: pause,
        onBlur: scheduleResume,
        onMouseEnter: pause,
        onMouseLeave: scheduleResume,
      }
    : {};

  // Also keep scrollLeft sane if the user manually scrolls past a set
  // boundary (native momentum scroll can overshoot our rAF wrap window).
  useEffect(() => {
    if (!enabled) return;
    const el = containerRef.current;
    if (!el) return;
    const onScroll = () => {
      const setWidth = setWidthRef.current;
      if (setWidth <= 0) return;
      if (el.scrollLeft >= setWidth * 2) el.scrollLeft -= setWidth;
      else if (el.scrollLeft < 0) el.scrollLeft += setWidth;
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, [enabled]);

  return { containerRef, interactionHandlers, isPaused };
}
