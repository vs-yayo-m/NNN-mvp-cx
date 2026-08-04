"use client";

// ============================================================================
// Header — logo, location pill (Butwal, hardcoded per blueprint §10 —
// structured so a real branch-picker can replace the disabled button
// later), cart icon with live badge, and profile/login icon.
//
// Phase A note: the header search affordance links to /menu for now (no
// dedicated /search page or SearchBar component until Phase B). This keeps
// the header fully functional in Phase A without pulling in Phase B scope.
// ============================================================================

import Link from "next/link";
import { useState } from "react";
import { useCart } from "@/lib/cartStore";
import { useAuth } from "@/lib/authStore";

export default function Header() {
  const { itemCount } = useCart();
  const { state: authState } = useAuth();
  const [locationNoticeOpen, setLocationNoticeOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-cream/95 backdrop-blur border-b border-ink-100">
      <div className="mx-auto max-w-6xl px-4 h-16 flex items-center justify-between gap-3">
        {/* Logo + wordmark */}
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-500 text-cream-100 font-display text-lg">
            N
          </span>
          <span className="font-display text-lg font-semibold text-ink-900 hidden sm:inline">
            Nom Nom Now
          </span>
        </Link>

        {/* Location pill — disabled/future affordance per §3.1 */}
        <div className="relative hidden sm:block">
          <button
            type="button"
            onClick={() => setLocationNoticeOpen((v) => !v)}
            className="flex items-center gap-1.5 rounded-full border border-ink-100 bg-cream-100 px-3 py-1.5 text-sm text-ink-600 hover:border-brand-300 transition-colors"
          >
            <span aria-hidden>📍</span>
            <span className="font-medium text-ink-800">Butwal</span>
            <span className="text-ink-400 text-xs">Change</span>
          </button>
          {locationNoticeOpen && (
            <div className="absolute top-full mt-2 left-0 w-56 rounded-lg border border-ink-100 bg-cream-100 p-3 text-xs text-ink-600 shadow-lg animate-fade-in">
              Multi-branch ordering is coming soon. Butwal is currently our
              only location.
              <button
                type="button"
                className="mt-2 text-brand-500 font-medium"
                onClick={() => setLocationNoticeOpen(false)}
              >
                Got it
              </button>
            </div>
          )}
        </div>

        {/* Search (links to Menu in Phase A — full AI search lands in Phase B) */}
        <Link
          href="/menu"
          className="hidden md:flex flex-1 max-w-sm items-center gap-2 rounded-full border border-ink-100 bg-cream-100 px-4 py-2 text-sm text-ink-400 hover:border-brand-300 transition-colors"
        >
          <span aria-hidden>🔍</span>
          Search Momo, Pizza, Biryani…
        </Link>

        {/* Right actions */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          <Link
            href="/menu"
            className="md:hidden flex h-10 w-10 items-center justify-center rounded-full hover:bg-cream-200 transition-colors"
            aria-label="Search menu"
          >
            <span aria-hidden className="text-lg">🔍</span>
          </Link>

          <Link
            href="/cart"
            className="relative flex h-10 w-10 items-center justify-center rounded-full hover:bg-cream-200 transition-colors"
            aria-label="View cart"
          >
            <span aria-hidden className="text-lg">🛒</span>
            {itemCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-brand-500 px-1 text-[11px] font-semibold text-cream-100 animate-bounce-sm">
                {itemCount}
              </span>
            )}
          </Link>

          <Link
            href={authState.isLoggedIn ? "/profile" : "/login"}
            className="flex h-10 w-10 items-center justify-center rounded-full hover:bg-cream-200 transition-colors overflow-hidden"
            aria-label={authState.isLoggedIn ? "Profile" : "Log in"}
          >
            {authState.isLoggedIn && authState.profile ? (
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gold-400 text-ink-900 font-semibold text-sm">
                {authState.profile.name.charAt(0).toUpperCase()}
              </span>
            ) : (
              <span aria-hidden className="text-lg">👤</span>
            )}
          </Link>
        </div>
      </div>
    </header>
  );
}
