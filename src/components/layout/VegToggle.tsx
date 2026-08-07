// src/components/layout/VegToggle.tsx
//
// Swiggy-style veg-only switch — a rounded-SQUARE track with a rounded-
// square knob (not a stretched oval pill). This replaces the previous pill
// version, which had a real geometry bug: a wide oval track (rounded-full
// on a non-square box) combined with a hardcoded knob offset that didn't
// actually match the track's inner width, so at the "on" position the
// knob overflowed past the track's edge instead of sitting flush inside
// it (visible in review screenshots — the white knob spilling outside the
// green track on the right side).
//
// Fix strategy: every dimension below is a plain number (not a guessed
// Tailwind spacing token) so the "on" translate distance is *computed*
// from the real geometry (track width - knob width - both insets) instead
// of eyeballed. That's the actual bug fix; everything else here is the
// requested visual upgrade on top of it.

"use client";

import { forwardRef } from "react";

type VegToggleProps = {
  isVegOnly: boolean;
  onToggle: () => void;
};

// All geometry in px, kept as named constants so the translate distance
// below is provably correct rather than a hand-tuned guess.
const TRACK_SIZE = 26; // square track, width === height
const TRACK_RADIUS = 8; // rounded-square, not rounded-full — the requested shape
const KNOB_SIZE = 16;
const INSET = 3; // fixed margin from the track edge, same at both resting positions
const KNOB_TRAVEL = TRACK_SIZE - KNOB_SIZE - INSET * 2; // remaining horizontal slack between the two resting positions

const VegToggle = forwardRef < HTMLButtonElement,
  VegToggleProps > (
    ({ isVegOnly, onToggle }, ref) => {
      return (
        <button
        ref={ref}
        type="button"
        role="switch"
        aria-checked={isVegOnly}
        aria-label={
          isVegOnly ? "Vegetarian only mode is on" : "Vegetarian only mode is off"
        }
        onClick={onToggle}
        className={`
          group relative flex items-center gap-1.5 shrink-0 rounded-xl
          border px-2 py-1.5 transition-all duration-200
          ${
            isVegOnly
              ? "border-veg-600/50 bg-gradient-to-b from-veg-50 to-white shadow-[0_1px_2px_rgba(0,0,0,0.05),0_0_0_3px_rgba(46,143,80,0.10)]"
              : "border-ink-900/[0.10] bg-white hover:border-ink-900/[0.20] shadow-[0_1px_2px_rgba(0,0,0,0.05)]"
          }
        `}
      >
        {/* Veg mark — the universal green-square-with-a-dot symbol, so the
            icon itself reads as "veg" at a glance rather than a generic
            leaf. Fills solid once active for a stronger on-state instead
            of just an outline. */}
        <span
          className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-[4px] border-[1.5px] transition-colors duration-200 ${
            isVegOnly
              ? "border-veg-600 bg-veg-600/10"
              : "border-ink-400 bg-transparent"
          }`}
          aria-hidden
        >
          <span
            className={`h-[7px] w-[7px] rounded-full transition-colors duration-200 ${
              isVegOnly ? "bg-veg-600" : "bg-ink-400"
            }`}
          />
        </span>

        <span
          className={`hidden sm:inline text-[11px] font-bold tracking-wide transition-colors duration-200 ${
            isVegOnly ? "text-veg-700" : "text-ink-500"
          }`}
        >
          VEG
        </span>

        {/* Track — rounded SQUARE (not a pill), exactly matching the
            Swiggy reference shape. Sized in real px via the constants
            above so the knob's travel distance is geometrically exact:
            it can never overflow the track regardless of future style
            tweaks, because KNOB_TRAVEL is derived from TRACK_SIZE and
            KNOB_SIZE rather than hardcoded. */}
        <span
          className={`relative shrink-0 transition-colors duration-200 ${
            isVegOnly
              ? "bg-gradient-to-b from-veg-500 to-veg-600"
              : "bg-ink-900/15"
          }`}
          style={{
            width: TRACK_SIZE,
            height: TRACK_SIZE,
            borderRadius: TRACK_RADIUS,
          }}
        >
          {/* Knob — also a rounded square, offset by the same INSET on
              every side at rest, sliding by exactly KNOB_TRAVEL when on.
              Carries its own shadow + ring so it reads as a raised
              physical piece sitting inside the track, not a flat color
              swap. */}
          <span
            className="absolute rounded-[5px] bg-white shadow-[0_1px_3px_rgba(0,0,0,0.35)] ring-1 ring-black/[0.04] transition-transform duration-200 ease-[cubic-bezier(0.34,1.56,0.64,1)]"
            style={{
              width: KNOB_SIZE,
              height: KNOB_SIZE,
              top: INSET,
              left: INSET,
              transform: isVegOnly
                ? `translateX(${KNOB_TRAVEL}px)`
                : "translateX(0px)",
            }}
          />
        </span>
      </button>
      );
    }
  );

VegToggle.displayName = "VegToggle";

export default VegToggle;