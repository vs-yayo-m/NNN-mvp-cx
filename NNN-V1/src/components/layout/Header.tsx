"use client";

// ============================================================================
// Header — logo, location pill (Butwal, hardcoded per blueprint §10 —
// structured so a real branch-picker can replace the disabled button
// later), AI-powered search bar, cart icon with live badge, and
// profile/login icon. All icons are Lucide (no emoji) per design direction.
// ============================================================================

import Link from "next/link";
import { useState } from "react";
import { MapPin, ShoppingBag, User, ChevronDown, Search } from "lucide-react";
import { useCart } from "@/lib/cartStore";
import { useAuth } from "@/lib/authStore";
import SearchBar from "@/modules/search/components/SearchBar";

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
        <div className="relative hidden sm:block shrink-0">
          <button
            type="button"
            onClick={() => setLocationNoticeOpen((v) => !v)}
            className="flex items-center gap-1.5 rounded-full border border-ink-100 bg-cream-100 px-3 py-1.5 text-sm text-ink-600 hover:border-brand-300 transition-colors"
          >
            <MapPin className="h-3.5 w-3.5 text-brand-500" strokeWidth={2} aria-hidden />
            <span className="font-medium text-ink-800">Butwal</span>
            <ChevronDown className="h-3 w-3 text-ink-400" strokeWidth={2} aria-hidden />
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

        {/* AI-powered search — desktop inline */}
        <div className="hidden md:block flex-1 max-w-sm">
          <SearchBar variant="header" />
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          <Link
            href="/search"
            className="md:hidden flex h-10 w-10 items-center justify-center rounded-full hover:bg-cream-200 transition-colors"
            aria-label="Search menu"
          >
            <Search className="h-5 w-5 text-ink-800" strokeWidth={1.75} aria-hidden />
          </Link>

          <Link
            href="/cart"
            className="relative flex h-10 w-10 items-center justify-center rounded-full hover:bg-cream-200 transition-colors"
            aria-label="View cart"
          >
            <ShoppingBag className="h-5 w-5 text-ink-800" strokeWidth={1.75} aria-hidden />
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
              <User className="h-5 w-5 text-ink-800" strokeWidth={1.75} aria-hidden />
            )}
          </Link>
        </div>
      </div>
    </header>
  );
}
