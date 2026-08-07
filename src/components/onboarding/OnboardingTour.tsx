// src/components/onboarding/OnboardingTour.tsx
//
// Spotlight-style first-visit walkthrough for the header: veg toggle ->
// search bar (with a live typed demo) -> cart -> account -> a final
// "you're set" step with no target. Visually modeled on the Swiggy
// coachmark reference: dimmed backdrop, a bright cutout around the target,
// a small floating card with a headline, one short line of copy, and
// Got it / Next controls.
//
// This component owns positioning math (reads target DOMRects on every
// step change + on resize/scroll) but the actual step content and
// open/close state live in onboardingStore.ts. Header.tsx owns the target
// elements themselves and passes their refs in via the `targets` prop.
//
// MEASUREMENT ROBUSTNESS — this used to spotlight the wrong spot (e.g. the
// veg step's cutout landing in the top-left corner instead of on the
// toggle). Root cause: we measured the target's rect once, shortly after
// mount, but real pages keep shifting layout for a bit after that (web
// fonts swapping in, hero image finishing its load, the responsive
// desktop/mobile row toggling via a CSS breakpoint) — none of which fire a
// window `resize` or `scroll` event, so a stale rect from before that
// shift just sat there uncorrected. Fixed two ways below: (1) a
// ResizeObserver + MutationObserver-free polling fallback keeps
// re-measuring for a short settle window after each step change, not just
// once, and (2) we no longer trust a rect until it has a plausible
// non-zero size, so a too-early measurement can't paint a bogus
// zero-sized cutout in the corner.

"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { ArrowRight, Sparkles } from "lucide-react";
import { useOnboardingTour, type TourStepId } from "@/lib/onboardingStore";

export type TourTargetRefs = {
  // Veg toggle renders once for desktop and once for mobile (CSS-hidden,
  // not conditionally unmounted), so it needs multiple candidate refs —
  // see resolveVisibleTarget below for how we pick the one actually on
  // screen. Every other target only renders once.
  veg: React.RefObject<HTMLElement | null>[];
  search: React.RefObject<HTMLElement | null>;
  cart: React.RefObject<HTMLElement | null>;
  account: React.RefObject<HTMLElement | null>;
};

// Given a step id, resolve it to the single DOM element that should be
// spotlighted right now. Handles the veg toggle's dual desktop/mobile
// refs by picking whichever candidate currently has a non-zero rendered
// size (offsetParent is null for anything display:none'd by the
// responsive classes, which is exactly what CSS does to the inactive copy).
function resolveVisibleTarget(
  targets: TourTargetRefs,
  step: Exclude<TourStepId, "done">
): HTMLElement | null {
  if (step === "veg") {
    for (const ref of targets.veg) {
      const el = ref.current;
      if (el && el.offsetParent !== null) return el;
    }
    return null;
  }
  return targets[step].current;
}

const STEP_COPY: Record<
  TourStepId,
  { title: string; body: string; placement: "bottom" | "bottom-end" | "center" }
> = {
  veg: {
    title: "Veg mode",
    body: "Flip this on and every screen — home, menu, search — shows vegetarian dishes only.",
    placement: "bottom",
  },
  search: {
    title: "Search anything, fast",
    body: "Type a dish, a craving, or a drink and we'll surface it instantly as you type.",
    placement: "bottom",
  },
  cart: {
    title: "Your cart",
    body: "Everything you add lives here. The badge updates the moment you add an item.",
    placement: "bottom-end",
  },
  account: {
    title: "Your account",
    body: "Orders, saved addresses, and profile settings — all one tap away.",
    placement: "bottom-end",
  },
  done: {
    title: "You're all set",
    body: "That's the whole header. Go ahead and find something good to eat.",
    placement: "center",
  },
};

// Demo query typed into the real search input during the "search" step, so
// the tour visibly demonstrates the feature rather than just pointing at
// it. Restored to whatever the user had typed (usually nothing) once the
// step ends or the tour is skipped.
const SEARCH_DEMO_TEXT = "Nom Nom Now veg Special pizza";
const TYPE_SPEED_MS = 55;

export default function OnboardingTour({ targets }: { targets: TourTargetRefs }) {
  const { active, stepIndex, currentStep, totalSteps, next, skipAll, maybeAutoStart } =
    useOnboardingTour();

  const [mounted, setMounted] = useState(false);
  const [rect, setRect] = useState<DOMRect | null>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
    // Defer to the next frame so the header has finished its first real
    // layout pass (fonts, responsive md: visibility, etc.) before we start
    // measuring target rects — starting synchronously on mount can catch
    // the veg toggle mid-layout and spotlight the wrong size/position for
    // one frame.
    const raf = requestAnimationFrame(() => maybeAutoStart());
    return () => cancelAnimationFrame(raf);
    // maybeAutoStart is a stable module-level function; intentionally not
    // re-running this on every render.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Recompute the highlighted target's rect whenever the active step
  // changes, and keep re-measuring it — not just once — for a short
  // "settle" window plus continuously via ResizeObserver, so late layout
  // shifts (web font swap, hero image finishing load, the responsive
  // desktop/mobile row flipping at a CSS breakpoint) can't leave us
  // pointing a stale rect at the wrong spot. None of those trigger a
  // window resize/scroll event, which is what the old resize/scroll-only
  // version relied on — that gap is what caused the veg step's spotlight
  // to land in the top-left corner instead of on the toggle.
  useLayoutEffect(() => {
    if (!active) {
      setRect(null);
      return;
    }

    if (currentStep === "done") {
      setRect(null);
      return;
    }

    let cancelled = false;
    let settleFrames = 0;
    const MAX_SETTLE_FRAMES = 30; // ~0.5s at 60fps — generous but bounded

    const measure = () => {
      if (cancelled) return;
      const el = resolveVisibleTarget(targets, currentStep);
      if (!el) {
        // Target not mounted/visible yet (e.g. still switching between
        // the desktop/mobile veg toggle copies) — keep retrying during
        // the settle window instead of painting a null/zero cutout.
        return;
      }
      const next = el.getBoundingClientRect();
      // Reject implausibly small rects (e.g. 0x0 from a mid-layout read)
      // rather than committing to them — a real header control is never
      // this small, so this can only be a premature measurement.
      if (next.width < 4 || next.height < 4) return;
      setRect((prev) => {
        if (
          prev &&
          Math.abs(prev.top - next.top) < 0.5 &&
          Math.abs(prev.left - next.left) < 0.5 &&
          Math.abs(prev.width - next.width) < 0.5 &&
          Math.abs(prev.height - next.height) < 0.5
        ) {
          return prev; // avoid redundant state churn once it's stable
        }
        return next;
      });
    };

    // Poll every frame for a bounded settle window to catch late shifts
    // that don't fire any DOM event we can listen for directly.
    const tick = () => {
      if (cancelled) return;
      measure();
      settleFrames += 1;
      if (settleFrames < MAX_SETTLE_FRAMES) {
        requestAnimationFrame(tick);
      }
    };
    requestAnimationFrame(tick);

    // After the settle window, fall back to event-driven re-measurement —
    // real user scroll/resize, plus a ResizeObserver on the target itself
    // for anything that changes its size/position without a window event
    // (e.g. sibling content pushing it, font metrics finishing to load).
    window.addEventListener("resize", measure);
    window.addEventListener("scroll", measure, true);

    let ro: ResizeObserver | null = null;
    const observedEl = resolveVisibleTarget(targets, currentStep);
    if (observedEl && "ResizeObserver" in window) {
      ro = new ResizeObserver(measure);
      ro.observe(observedEl);
      ro.observe(document.body);
    }

    return () => {
      cancelled = true;
      window.removeEventListener("resize", measure);
      window.removeEventListener("scroll", measure, true);
      ro?.disconnect();
    };
  }, [active, currentStep, targets]);

  // Drive the live typing demo into the real search input while the
  // "search" step is showing. Dispatches native input events so React's
  // controlled-input state (in SearchBar) updates exactly like real typing
  // would, then clears it back out on the way out of the step.
  useEffect(() => {
    if (!active || currentStep !== "search") return;
    const targetRef = targets.search;
    const container = targetRef.current;
    const input = container?.querySelector("input");
    if (!input) return;

    const nativeInputSetter = Object.getOwnPropertyDescriptor(
      window.HTMLInputElement.prototype,
      "value"
    )?.set;

    let i = 0;
    let cancelled = false;

    const setValue = (value: string) => {
      nativeInputSetter?.call(input, value);
      input.dispatchEvent(new Event("input", { bubbles: true }));
    };

    const typeNext = () => {
      if (cancelled) return;
      i += 1;
      setValue(SEARCH_DEMO_TEXT.slice(0, i));
      if (i < SEARCH_DEMO_TEXT.length) {
        setTimeout(typeNext, TYPE_SPEED_MS);
      }
    };

    input.focus();
    const startTimer = setTimeout(typeNext, 300);

    return () => {
      cancelled = true;
      clearTimeout(startTimer);
      setValue("");
      input.blur();
    };
  }, [active, currentStep, targets]);

  if (!mounted || !active) return null;

  const copy = STEP_COPY[currentStep];
  const isLastStep = stepIndex === totalSteps - 1;
  const padding = 10;

  const holeStyle: React.CSSProperties | null = rect
    ? {
        top: rect.top - padding,
        left: rect.left - padding,
        width: rect.width + padding * 2,
        height: rect.height + padding * 2,
      }
    : null;

  const cardStyle = getCardPosition(rect, copy.placement);

  return createPortal(
    <div className="fixed inset-0 z-[100]" role="dialog" aria-modal="true" aria-label="Header walkthrough">
      {/* Dimmed backdrop with a bright cutout around the current target.
          Implemented as a single element using an inset box-shadow "hole"
          trick so there's no separate overlay-with-cutout SVG/clip-path
          needed — one absolutely positioned div does both the dim and the
          spotlight ring. */}
      {holeStyle ? (
        <div
          className="absolute rounded-2xl transition-all duration-300 ease-out pointer-events-none"
          style={{
            ...holeStyle,
            boxShadow: "0 0 0 9999px rgba(17, 12, 9, 0.72)",
            outline: "2px solid rgba(255,255,255,0.9)",
            outlineOffset: "2px",
          }}
        />
      ) : (
        <div className="absolute inset-0 bg-ink-950/75 transition-opacity duration-300" />
      )}

      {/* Click-catcher so taps outside the card don't leak to the page
          underneath while the tour is active, without blocking the visual
          spotlight cutout above. */}
      <button
        type="button"
        aria-hidden
        tabIndex={-1}
        onClick={skipAll}
        className="absolute inset-0 cursor-default"
      />

      <div
        ref={cardRef}
        className="absolute w-[min(320px,calc(100vw-2rem))] rounded-2xl bg-white p-4 shadow-[0_24px_60px_-12px_rgba(0,0,0,0.35)] animate-fade-in"
        style={cardStyle}
      >
        <div className="flex items-start gap-2.5">
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-50 text-brand-500">
            <Sparkles className="h-4 w-4" strokeWidth={2} aria-hidden />
          </span>
          <div className="min-w-0 pt-0.5">
            <h3 className="text-[15px] font-semibold text-ink-900">{copy.title}</h3>
            <p className="mt-0.5 text-[13px] leading-snug text-ink-600">{copy.body}</p>
          </div>
        </div>

        <div className="mt-3.5 flex items-center justify-between">
          <div className="flex items-center gap-1" aria-hidden>
            {Array.from({ length: totalSteps }).map((_, i) => (
              <span
                key={i}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  i === stepIndex ? "w-4 bg-brand-500" : "w-1.5 bg-ink-900/[0.12]"
                }`}
              />
            ))}
          </div>

          <div className="flex items-center gap-3">
            {!isLastStep && (
              <button
                type="button"
                onClick={skipAll}
                className="text-xs font-medium text-ink-400 hover:text-ink-600 transition-colors"
              >
                Skip all
              </button>
            )}
            <button
              type="button"
              onClick={next}
              className="flex items-center gap-1 rounded-full bg-ink-900 px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-ink-800 transition-colors"
            >
              {isLastStep ? "Got it" : "Next"}
              {!isLastStep && <ArrowRight className="h-3 w-3" strokeWidth={2.5} aria-hidden />}
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}

function getCardPosition(
  rect: DOMRect | null,
  placement: "bottom" | "bottom-end" | "center"
): React.CSSProperties {
  const gap = 14;
  const viewportW = typeof window !== "undefined" ? window.innerWidth : 375;
  const viewportH = typeof window !== "undefined" ? window.innerHeight : 812;

  if (!rect || placement === "center") {
    return {
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
    };
  }

  const top = Math.min(rect.bottom + gap, viewportH - 180);

  if (placement === "bottom-end") {
    const right = Math.max(16, viewportW - rect.right);
    return { top, right };
  }

  // "bottom" — align left edge to target, but clamp so the card never
  // overflows the right edge of the viewport on narrow screens.
  const left = Math.min(rect.left, viewportW - 320 - 16);
  return { top, left: Math.max(16, left) };
}
