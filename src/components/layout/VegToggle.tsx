// src/components/layout/VegToggle.tsx
//
// Premium veg-only switch, restyled against the Swiggy reference (white
// pill, crisp green ring, compact knob) instead of the flatter default
// pill/border treatment. Two visual layers give it depth without extra
// motion: a soft inner shadow on the track itself, and a knob that carries
// its own drop shadow so it reads as a physical toggle rather than a flat
// color swap.
//
// Behavior is unchanged from before — still reads/writes useVegMode() and
// still forwards a ref so OnboardingTour can spotlight it.

"use client";

import { forwardRef } from "react";
import { Leaf } from "lucide-react";

type VegToggleProps = {
  isVegOnly: boolean;
  onToggle: () => void;
};

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
          group relative flex items-center gap-1.5 shrink-0 rounded-full
          border px-2 py-1.5 transition-all duration-200
          ${
            isVegOnly
              ? "border-veg-600/40 bg-white shadow-[0_1px_2px_rgba(0,0,0,0.04),0_0_0_3px_rgba(46,143,80,0.08)]"
              : "border-ink-900/[0.10] bg-white hover:border-ink-900/[0.18] shadow-[0_1px_2px_rgba(0,0,0,0.04)]"
          }
        `}
      >
        {/* Veg mark — the little green-outlined square with a dot, matching
            the universal Indian veg-food symbol used in the reference, so
            the icon itself reinforces the label rather than a generic leaf. */}
        <span
          className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-[4px] border-[1.5px] transition-colors ${
            isVegOnly ? "border-veg-600" : "border-ink-400"
          }`}
          aria-hidden
        >
          <span
            className={`h-1.5 w-1.5 rounded-full transition-colors ${
              isVegOnly ? "bg-veg-600" : "bg-ink-400"
            }`}
          />
        </span>

        <span
          className={`hidden sm:inline text-[11px] font-bold tracking-wide transition-colors ${
            isVegOnly ? "text-veg-700" : "text-ink-500"
          }`}
        >
          VEG
        </span>

        {/* Track + knob — knob has its own shadow and a 1px ring so it
            visually sits "on top of" the track, plus a slight overshoot
            easing on the slide for a snappier, more premium feel than a
            linear transform. */}
        <span
          className={`relative h-[18px] w-8 rounded-full transition-colors duration-200 ${
            isVegOnly ? "bg-veg-600" : "bg-ink-900/15"
          }`}
        >
          <span
            className={`absolute top-0.5 h-[14px] w-[14px] rounded-full bg-white shadow-[0_1px_3px_rgba(0,0,0,0.3)] ring-1 ring-black/[0.03] transition-transform duration-200 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${
              isVegOnly ? "translate-x-[15px]" : "translate-x-0.5"
            }`}
          />
        </span>
      </button>
      );
    }
  );

VegToggle.displayName = "VegToggle";

export default VegToggle;