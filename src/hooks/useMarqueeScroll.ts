// "use client";

import { useCallback, useEffect, useRef, useState } from "react";

interface UseMarqueeScrollOptions {
  /** Pixels per second the track drifts when idle. Higher = faster. */
  speed?: number;
  /** Ms of inactivity after manual interaction before auto-scroll resumes. */
  resumeDelay?: number;
  /** Disable entirely (e.g. too few items, or reduced-motion). */
  enabled?: boolean;
}

/**
 * Industry-standard infinite marquee: native horizontal scroll (so touch,
 * trackpad, mouse-wheel, and drag all work exactly the way the browser
 * already handles them) PLUS a requestAnimationFrame loop that nudges
 * `scrollLeft` forward at a constant speed when idle.
 *
 * The list must be rendered TWICE by the caller inside the scrollable
 * container. Once scrollLeft passes the width of one full set, we subtract
 * that width — an invisible wrap, no flash, no snap-back.
 */
export function useMarqueeScroll<T extends HTMLElement>({
  speed = 40,
  resumeDelay = 2000,
  enabled = true,
}: UseMarqueeScrollOptions = {}) {
  const containerRef = useRef<T | null>(null);
  const [isPaused, setIsPaused] = useState(false);

  const rafRef = useRef<number | null>(null);
  const lastTsRef = useRef<number | null>(null);
  const resumeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pausedRef = useRef(false);
  const setWidthRef = useRef(0);
  const reducedMotionRef = useRef(false);

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

  const measure = useCallback(() => {
    const el = containerRef.current;
    if (!el) return;
    setWidthRef.current = el.scrollWidth / 2;
  }, []);

  useEffect(() => {
    if (!enabled) return;
    if (typeof window !== "undefined") {
      reducedMotionRef.current = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;
    }
    const el = containerRef.current;
    if (!el) return;

    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);

    const step = (ts: number) => {
      rafRef.current = requestAnimationFrame(step);
      if (reducedMotionRef.current) return; // manual scroll only
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
      if (resumeTimerRef.current) clearTimeout(resumeTimerRef.current);
    };
  }, [enabled, speed, measure]);

  // Keep scrollLeft within [0, setWidth) even if native momentum scroll
  // overshoots the rAF wrap window during a fast manual swipe.
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

  return { containerRef, interactionHandlers, isPaused };
}
