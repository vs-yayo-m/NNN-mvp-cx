// src/components/layout/Header.tsx
"use client";

// ============================================================================
// Header — near-black glass surface, imported logo, location pill, full-width
// AI search bar, notification/cart/profile as dark glass icon buttons with
// glowing badges. Palette + rationale:
//
//   #0A0A0B  base header surface (near-black)
//   #141416  elevated glass surface (dropdowns, hover states)
//   #1F1F23  hairline border
//   #EDEDEF  primary text on dark
//   brand-500 (existing orange) — the *only* accent, used sparingly on
//     focus/active/badge states, never as a flat fill
//
// The header is intentionally the one dark surface in an otherwise warm
// cream product — it reads as a control deck / status bar for ordering,
// not a full dark-mode reskin. The soft bottom-edge gradient is there on
// purpose so the cut into the cream page body reads as designed, not
// mismatched.
// ============================================================================

import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { MapPin, ShoppingBag, User, ChevronDown, Bell } from "lucide-react";
import { useCart } from "@/lib/cartStore";
import { useAuth } from "@/lib/authStore";
import { useNotifications } from "@/lib/notificationStore";
import SearchBar from "@/modules/search/components/SearchBar";

export default function Header() {
  const { itemCount } = useCart();
  const { state: authState } = useAuth();
  const { unreadCount } = useNotifications();
  const [locationNoticeOpen, setLocationNoticeOpen] = useState(false);

  // Bump the cart badge whenever itemCount changes, so it reads as "live"
  // rather than a static number that happens to update.
  const [cartBump, setCartBump] = useState(false);
  const prevCount = useRef(itemCount);
  useEffect(() => {
    if (itemCount !== prevCount.current) {
      setCartBump(true);
      prevCount.current = itemCount;
      const t = setTimeout(() => setCartBump(false), 420);
      return () => clearTimeout(t);
    }
  }, [itemCount]);

  return (
    <header className="sticky top-0 z-40 border-b border-white/[0.06] bg-[#0A0A0B]/95 backdrop-blur-xl">
      {/* Soft fade into the cream page body below, so the dark→light cut
          reads as an intentional edge rather than two surfaces collided. */}
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-6 left-0 right-0 h-6 bg-gradient-to-b from-[#0A0A0B]/40 to-transparent"
      />

      <div className="relative mx-auto max-w-6xl px-4 flex flex-col">
        {/* Primary row */}
        <div className="h-16 flex items-center justify-between gap-3">
          {/* Logo — light chip backdrop so the mark stays legible regardless
              of whether the source PNG assumes a light background. Safe to
              drop the chip if the asset already has light/inverted art. */}
          <Link href="/" className="flex items-center shrink-0 group">
            <span className="flex items-center rounded-xl bg-white/[0.04] px-2 py-1.5 ring-1 ring-white/[0.06] transition-colors group-hover:bg-white/[0.07]">
              <Image
                src="/logo/icon-logo.png"
                alt="Nom Nom Now"
                width={220}
                height={80}
                priority
                className="h-7 w-auto object-contain"
              />
            </span>
          </Link>

          {/* Location pill — disabled/future affordance per §3.1 */}
          <div className="relative hidden sm:block shrink-0">
            <button
              type="button"
              onClick={() => setLocationNoticeOpen((v) => !v)}
              className="flex items-center gap-1.5 rounded-full border border-white/[0.08] bg-white/[0.03] px-3 py-1.5 text-sm text-white/70 backdrop-blur-md transition-colors hover:border-brand-500/30 hover:bg-white/[0.05]"
            >
              <MapPin className="h-3.5 w-3.5 text-brand-400" strokeWidth={2} aria-hidden />
              <span className="font-medium text-white/90">Butwal</span>
              <ChevronDown className="h-3 w-3 text-white/30" strokeWidth={2} aria-hidden />
            </button>
            {locationNoticeOpen && (
              <div className="absolute top-full mt-2 left-0 w-56 rounded-xl border border-white/[0.08] bg-[#141416]/95 backdrop-blur-xl p-3 text-xs text-white/60 shadow-[0_16px_40px_-12px_rgba(0,0,0,0.6)] animate-fade-in">
                Multi-branch ordering is coming soon. Butwal is currently our
                only location.
                <button
                  type="button"
                  className="mt-2 text-brand-400 font-medium"
                  onClick={() => setLocationNoticeOpen(false)}
                >
                  Got it
                </button>
              </div>
            )}
          </div>

          {/* AI-powered search — full width, desktop inline */}
          <div className="hidden md:block flex-1">
            <SearchBar variant="header" />
          </div>

          {/* Right actions — dark glass icon buttons, badges glow rather
              than flat-fill so the one accent color stays reserved for
              "something needs your attention" moments. */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            <Link
              href="/notifications"
              className="relative flex h-10 w-10 items-center justify-center rounded-full border border-white/[0.06] bg-white/[0.03] transition-colors hover:border-white/[0.1] hover:bg-white/[0.06]"
              aria-label="Notifications"
            >
              <Bell className="h-4.5 w-4.5 text-white/80" strokeWidth={1.75} aria-hidden />
              {unreadCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-brand-500 px-1 text-[11px] font-semibold text-white shadow-[0_0_10px_2px_rgba(217,119,87,0.55)]">
                  {unreadCount > 9 ? "9+" : unreadCount}
                </span>
              )}
            </Link>

            <Link
              href="/cart"
              className="relative flex h-10 w-10 items-center justify-center rounded-full border border-white/[0.06] bg-white/[0.03] transition-colors hover:border-white/[0.1] hover:bg-white/[0.06]"
              aria-label="View cart"
            >
              <ShoppingBag
                className={`h-4.5 w-4.5 text-white/80 transition-transform duration-300 ${
                  cartBump ? "scale-110" : "scale-100"
                }`}
                strokeWidth={1.75}
                aria-hidden
              />
              {itemCount > 0 && (
                <span
                  className={`absolute -top-0.5 -right-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-brand-500 px-1 text-[11px] font-semibold text-white shadow-[0_0_10px_2px_rgba(217,119,87,0.55)] transition-transform duration-300 ${
                    cartBump ? "scale-125" : "scale-100"
                  }`}
                >
                  {itemCount > 99 ? "99+" : itemCount}
                </span>
              )}
            </Link>

            <Link
              href={authState.isLoggedIn ? "/profile" : "/login"}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-white/[0.06] bg-white/[0.03] overflow-hidden transition-colors hover:border-white/[0.1] hover:bg-white/[0.06]"
              aria-label={authState.isLoggedIn ? "Profile" : "Log in"}
            >
              {authState.isLoggedIn && authState.profile ? (
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gold-400 text-ink-900 font-semibold text-sm">
                  {authState.profile.name.charAt(0).toUpperCase()}
                </span>
              ) : (
                <User className="h-4.5 w-4.5 text-white/80" strokeWidth={1.75} aria-hidden />
              )}
            </Link>
          </div>
        </div>

        {/* Search — full width row on mobile/tablet (search icon removed,
            so the bar itself must always be reachable, not tucked behind
            a trigger) */}
        <div className="md:hidden pb-3">
          <SearchBar variant="header" />
        </div>
      </div>
    </header>
  );
}
