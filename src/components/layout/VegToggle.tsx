// src/components/layout/VegToggle.tsx
//
// Matches the exact Swiggy reference the client provided: a small,
// self-contained white card with the "VEG" label stacked ABOVE a wide
// pill-shaped switch (not an inline row with the label beside the track,
// which is what earlier versions of this component did). Two states shown
// in the reference:
//   OFF — pill is light gray, knob sits on the LEFT with a green ring/dot
//   ON  — pill is solid green, knob sits on the RIGHT, white with a green
//         center dot
// The knob's own green dot (present in both states) is the detail that
// makes this read as "premium" rather than a stock switch — most default
// toggle components just move a plain white circle.

"use client";

import { forwardRef } from "react";

type VegToggleProps = {
  isVegOnly: boolean;
  onToggle: () => void;
};

// Pill geometry in real px, kept as named constants so KNOB_TRAVEL is
// computed rather than guessed — same reasoning as before: this makes it
// impossible for the knob to overflow the track regardless of future
// resizing, because the travel distance is always derived from the
// current TRACK/KNOB/INSET values instead of a hardcoded number.
const TRACK_WIDTH = 40;
const TRACK_HEIGHT = 22;
const KNOB_SIZE = 16;
const INSET = 3;
const KNOB_TRAVEL = TRACK_WIDTH - KNOB_SIZE - INSET * 2;

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
          group flex flex-col items-center justify-center gap-1.5 shrink-0
          rounded-2xl border px-3.5 py-2.5 transition-all duration-200
          ${
            isVegOnly
              ? "border-veg-600/40 bg-white shadow-[0_2px_8px_rgba(0,0,0,0.06),0_0_0_3px_rgba(46,143,80,0.10)]"
              : "border-ink-900/[0.08] bg-white hover:border-ink-900/[0.16] shadow-[0_2px_8px_rgba(0,0,0,0.06)]"
          }
        `}
      >
        <span
          className={`text-[11px] font-bold tracking-wide transition-colors duration-200 ${
            isVegOnly ? "text-veg-700" : "text-ink-700"
          }`}
        >
          VEG
        </span>

        {/* Track — wide pill (rounded-full), matching the reference
            exactly. Solid green fill when on, soft gray when off. */}
        <span
          className={`relative shrink-0 rounded-full transition-colors duration-300 ${
            isVegOnly ? "bg-veg-600" : "bg-ink-900/[0.12]"
          }`}
          style={{ width: TRACK_WIDTH, height: TRACK_HEIGHT }}
        >
          {/* Knob — carries its own small colored center dot in BOTH
              states (green ring on white in the off position, green dot
              on white in the on position) rather than being a flat plain
              circle, which is the detail that gives the reference its
              premium feel. */}
          <span
            className="absolute rounded-full bg-white shadow-[0_1px_3px_rgba(0,0,0,0.35)] ring-1 ring-black/[0.04] transition-transform duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] flex items-center justify-center"
            style={{
              width: KNOB_SIZE,
              height: KNOB_SIZE,
              top: INSET,
              left: INSET,
              transform: isVegOnly
                ? `translateX(${KNOB_TRAVEL}px)`
                : "translateX(0px)",
            }}
          >
            <span
              className={`rounded-full transition-colors duration-300 ${
                isVegOnly ? "bg-veg-600" : "bg-veg-600"
              }`}
              style={{ width: 7, height: 7 }}
            />
          </span>
        </span>
      </button>
      );
    }
  );

VegToggle.displayName = "VegToggle";

export default VegToggle;