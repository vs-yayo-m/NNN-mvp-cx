// src/lib/onboardingStore.ts
//
// Lightweight state for the first-visit header tour (spotlight coachmarks
// over veg toggle -> search bar -> cart -> account -> done). No external
// state library needed — a module-level store + subscriber list, same
// shape as the existing cartStore/authStore pattern in this codebase.
//
// Persistence: sessionStorage, not localStorage. Per product decision this
// tour should reappear each new browser session/tab rather than being
// permanently dismissed after the very first visit — sessionStorage clears
// automatically when the tab/session ends, which gives us that for free
// without any expiry bookkeeping.

import { useEffect, useState } from "react";

const SESSION_KEY = "nnn:onboardingTourSeen";

export type TourStepId = "veg" | "search" | "cart" | "account" | "done";

export const TOUR_STEPS: TourStepId[] = ["veg", "search", "cart", "account", "done"];

type Listener = () => void;

type OnboardingState = {
  active: boolean;
  stepIndex: number;
};

let state: OnboardingState = {
  active: false,
  stepIndex: 0,
};

const listeners = new Set<Listener>();

function emit() {
  listeners.forEach((l) => l());
}

function hasSeenThisSession(): boolean {
  if (typeof window === "undefined") return true;
  try {
    return window.sessionStorage.getItem(SESSION_KEY) === "1";
  } catch {
    // Storage can throw in private-mode/blocked-cookie contexts — fail
    // open (don't repeatedly force the tour) rather than crash.
    return true;
  }
}

function markSeenThisSession() {
  if (typeof window === "undefined") return;
  try {
    window.sessionStorage.setItem(SESSION_KEY, "1");
  } catch {
    /* ignore */
  }
}

function start() {
  state = { active: true, stepIndex: 0 };
  emit();
}

function next() {
  if (state.stepIndex >= TOUR_STEPS.length - 1) {
    finish();
    return;
  }
  state = { ...state, stepIndex: state.stepIndex + 1 };
  emit();
}

function skipAll() {
  finish();
}

function finish() {
  state = { active: false, stepIndex: 0 };
  markSeenThisSession();
  emit();
}

/**
 * Call once from the Header on mount. Starts the tour automatically if this
 * session hasn't seen it yet. Safe to call multiple times (e.g. React
 * strict-mode double-invoke) — start() just resets to step 0 harmlessly.
 */
function maybeAutoStart() {
  if (!hasSeenThisSession()) {
    start();
  }
}

export function useOnboardingTour() {
  const [, setTick] = useState(0);
  useEffect(() => {
    const listener = () => setTick((t) => t + 1);
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  }, []);

  return {
    active: state.active,
    stepIndex: state.stepIndex,
    currentStep: TOUR_STEPS[state.stepIndex],
    totalSteps: TOUR_STEPS.length,
    start,
    next,
    skipAll,
    finish,
    maybeAutoStart,
  };
}

// Manual replay trigger (e.g. a "?" help affordance elsewhere in the app),
// exported standalone so it doesn't require the hook's re-render subscription.
export function replayOnboardingTour() {
  start();
}
