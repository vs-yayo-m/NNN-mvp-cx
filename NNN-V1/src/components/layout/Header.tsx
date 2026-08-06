// src/components/layout/Header.tsx
"use client";

// ============================================================================
// Header — premium white/frosted-glass bar. Logo is a single horizontal PNG
// lockup (icon + wordmark baked in — see public/logo/icon-logo.png).
// Location pill (Butwal, hardcoded per blueprint §10 — structured so a real
// branch-picker can replace the disabled button later), full-width AI
// search bar, notification bell, live cart badge, profile. Icons are Lucide.
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
    <header className="sticky top-0 z-40 border-b border-ink-900/[0.06] bg-white/85 backdrop-blur-xl">
      {/* Faint top hairline glow — premium accent, not decoration for its own sake */}
      <div
        aria-hidden
        className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-brand-500/50 to-transparent"
      />

      <div className="mx-auto max-w-6xl px-4 flex flex-col">
        {/* Primary row */}
        <div className="h-[68px] flex items-center justify-between gap-4">
          {/* Logo — PNG already contains both the icon mark and the
              wordmark, rendered as a single horizontal lockup at its
              native aspect ratio (no cropping into a circle/avatar). */}
          <Link href="/" className="flex items-center shrink-0 group">
            <Image
              src="/logo/icon-logo.png"
              alt="Nom Nom Now"
              width={220}
              height={80}
              priority
              className="h-14 w-auto object-contain transition-transform duration-300 group-hover:scale-[1.03]"
            />
          </Link>

          {/* Location pill — disabled/future affordance per §3.1 */}
          <div className="relative hidden sm:block shrink-0">
            <button
              type="button"
              onClick={() => setLocationNoticeOpen((v) => !v)}
              className="flex items-center gap-1.5 rounded-full border border-ink-900/[0.08] bg-ink-900/[0.02] px-3 py-1.5 text-sm text-ink-600 hover:border-brand-500/30 hover:bg-ink-900/[0.04] transition-colors"
            >
              <MapPin className="h-3.5 w-3.5 text-brand-500" strokeWidth={2} aria-hidden />
              <span className="font-medium text-ink-800">Butwal</span>
              <ChevronDown className="h-3 w-3 text-ink-400" strokeWidth={2} aria-hidden />
            </button>
            {locationNoticeOpen && (
              <div className="absolute top-full mt-2 left-0 w-56 rounded-xl border border-ink-900/[0.08] bg-white/95 backdrop-blur-xl p-3 text-xs text-ink-600 shadow-[0_16px_40px_-12px_rgba(0,0,0,0.18)] animate-fade-in">
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

          {/* AI-powered search — full width, desktop inline */}
          <div className="hidden md:block flex-1">
            <SearchBar variant="header" />
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            <Link
              href="/notifications"
              className="relative flex h-10 w-10 items-center justify-center rounded-full border border-ink-900/[0.06] bg-ink-900/[0.02] hover:border-ink-900/[0.12] hover:bg-ink-900/[0.05] transition-colors"
              aria-label="Notifications"
            >
              <Bell className="h-[18px] w-[18px] text-ink-700" strokeWidth={1.75} aria-hidden />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4.5 min-w-4.5 items-center justify-center rounded-full bg-brand-500 px-1 text-[10px] font-semibold text-white shadow-[0_0_10px_rgba(217,119,87,0.5)]">
                  {unreadCount > 9 ? "9+" : unreadCount}
                </span>
              )}
            </Link>

            <Link
              href="/cart"
              className="relative flex h-10 w-10 items-center justify-center rounded-full border border-ink-900/[0.06] bg-ink-900/[0.02] hover:border-ink-900/[0.12] hover:bg-ink-900/[0.05] transition-colors"
              aria-label="View cart"
            >
              <ShoppingBag
                className={`h-[18px] w-[18px] text-ink-700 transition-transform duration-300 ${
                  cartBump ? "scale-110" : "scale-100"
                }`}
                strokeWidth={1.75}
                aria-hidden
              />
              {itemCount > 0 && (
                <span
                  className={`absolute -top-1 -right-1 flex h-4.5 min-w-4.5 items-center justify-center rounded-full bg-brand-500 px-1 text-[10px] font-semibold text-white shadow-[0_0_10px_rgba(217,119,87,0.5)] transition-transform duration-300 ${
                    cartBump ? "scale-125" : "scale-100"
                  }`}
                >
                  {itemCount > 99 ? "99+" : itemCount}
                </span>
              )}
            </Link>

            <Link
              href={authState.isLoggedIn ? "/profile" : "/login"}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-ink-900/[0.06] bg-ink-900/[0.02] hover:border-ink-900/[0.12] hover:bg-ink-900/[0.05] transition-colors overflow-hidden"
              aria-label={authState.isLoggedIn ? "Profile" : "Log in"}
            >
              {authState.isLoggedIn && authState.profile ? (
                <span className="flex h-full w-full items-center justify-center bg-gradient-to-br from-gold-400 to-brand-500 text-white font-semibold text-sm">
                  {authState.profile.name.charAt(0).toUpperCase()}
                </span>
              ) : (
                <User className="h-[18px] w-[18px] text-ink-700" strokeWidth={1.75} aria-hidden />
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
