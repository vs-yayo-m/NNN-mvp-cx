// src/components/layout/Header.tsx
"use client";

// ============================================================================
// Header — logo (imported asset), location pill (Butwal, hardcoded per
// blueprint §10 — structured so a real branch-picker can replace the
// disabled button later), full-width AI-powered search bar, notification
// icon, live cart badge, and profile/login icon. All icons are Lucide
// (no emoji) per design direction.
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
    <header className="sticky top-0 z-40 bg-cream/95 backdrop-blur border-b border-ink-100">
      <div className="mx-auto max-w-6xl px-4 flex flex-col">
        {/* Primary row */}
        <div className="h-16 flex items-center justify-between gap-3">
          {/* Logo — PNG already contains both the icon mark and the
              wordmark, so it renders as a single horizontal lockup at its
              native aspect ratio (no cropping into a circle/avatar). */}
          <Link href="/" className="flex items-center shrink-0">
            <Image
              src="/logo/icon-logo.png"
              alt="Nom Nom Now"
              width={220}
              height={80}
              priority
              className="h-9 w-auto object-contain"
            />
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

          {/* AI-powered search — full width, desktop inline */}
          <div className="hidden md:block flex-1">
            <SearchBar variant="header" />
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            <Link
              href="/notifications"
              className="relative flex h-10 w-10 items-center justify-center rounded-full hover:bg-cream-200 transition-colors"
              aria-label="Notifications"
            >
              <Bell className="h-5 w-5 text-ink-800" strokeWidth={1.75} aria-hidden />
              {unreadCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-brand-500 px-1 text-[11px] font-semibold text-cream-100">
                  {unreadCount > 9 ? "9+" : unreadCount}
                </span>
              )}
            </Link>

            <Link
              href="/cart"
              className="relative flex h-10 w-10 items-center justify-center rounded-full hover:bg-cream-200 transition-colors"
              aria-label="View cart"
            >
              <ShoppingBag
                className={`h-5 w-5 text-ink-800 transition-transform duration-300 ${
                  cartBump ? "scale-110" : "scale-100"
                }`}
                strokeWidth={1.75}
                aria-hidden
              />
              {itemCount > 0 && (
                <span
                  className={`absolute -top-0.5 -right-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-brand-500 px-1 text-[11px] font-semibold text-cream-100 transition-transform duration-300 ${
                    cartBump ? "scale-125" : "scale-100"
                  }`}
                >
                  {itemCount > 99 ? "99+" : itemCount}
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
