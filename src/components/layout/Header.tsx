// src/components/layout/Header.tsx
"use client";

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

  // Hide the search row on scroll-down, reveal on scroll-up. Small
  // threshold + direction delta so it doesn't flicker on tiny scroll jitter.
  // Starts hidden — the primary row alone is enough at rest, and the hero
  // should be reachable immediately without a second row pushing it down.
  const [searchHidden, setSearchHidden] = useState(true);
  const lastScrollY = useRef(0);

  useEffect(() => {
    lastScrollY.current = window.scrollY;
    let ticking = false;

    const handleScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const currentY = window.scrollY;
        const delta = currentY - lastScrollY.current;

        if (currentY < 8) {
          setSearchHidden(true);
        } else if (delta > 6) {
          setSearchHidden(true);
        } else if (delta < -6) {
          setSearchHidden(false);
        }

        lastScrollY.current = currentY;
        ticking = false;
      });
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className="sticky top-0 z-40 border-b border-ink-900/[0.06] bg-white/85 backdrop-blur-xl">
      {/* Faint top hairline glow — premium accent, not decoration for its own sake */}
      <div
        aria-hidden
        className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-brand-500/50 to-transparent"
      />

      <div className="mx-auto max-w-6xl px-4 flex flex-col">
        {/* Primary row — always visible */}
        <div className="h-14 flex items-center justify-between gap-4">
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
              className="h-9 w-auto object-contain transition-transform duration-300 group-hover:scale-[1.03]"
            />
          </Link>

          {/* Location pill — disabled/future affordance per §3.1 */}
          <div className="relative hidden sm:block shrink-0">
            <button
              type="button"
              onClick={() => setLocationNoticeOpen((v) => !v)}
              className="flex items-center gap-1.5 rounded-full border border-ink-900/[0.08] bg-ink-900/[0.02] px-3 py-1 text-sm text-ink-600 hover:border-brand-500/30 hover:bg-ink-900/[0.04] transition-colors"
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

          {/* AI-assisted search — full width, desktop inline. Desktop copy
              stays visible even while scrolling; only the dedicated mobile
              row below hides, since desktop has the vertical room to spare. */}
          <div className="hidden md:block flex-1">
            <SearchBar />
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            <Link
              href="/notifications"
              className="relative flex h-9 w-9 items-center justify-center rounded-full border border-ink-900/[0.06] bg-ink-900/[0.02] hover:border-ink-900/[0.12] hover:bg-ink-900/[0.05] transition-colors"
              aria-label="Notifications"
            >
              <Bell className="h-[17px] w-[17px] text-ink-700" strokeWidth={1.75} aria-hidden />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-brand-500 px-1 text-[10px] font-semibold text-white shadow-[0_0_10px_rgba(232,74,46,0.5)]">
                  {unreadCount > 9 ? "9+" : unreadCount}
                </span>
              )}
            </Link>

            <Link
              href="/cart"
              className="relative flex h-9 w-9 items-center justify-center rounded-full border border-ink-900/[0.06] bg-ink-900/[0.02] hover:border-ink-900/[0.12] hover:bg-ink-900/[0.05] transition-colors"
              aria-label="View cart"
            >
              <ShoppingBag
                className={`h-[17px] w-[17px] text-ink-700 transition-transform duration-300 ${
                  cartBump ? "scale-110" : "scale-100"
                }`}
                strokeWidth={1.75}
                aria-hidden
              />
              {itemCount > 0 && (
                <span
                  className={`absolute -top-1 -right-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-brand-500 px-1 text-[10px] font-semibold text-white shadow-[0_0_10px_rgba(232,74,46,0.5)] transition-transform duration-300 ${
                    cartBump ? "scale-125" : "scale-100"
                  }`}
                >
                  {itemCount > 99 ? "99+" : itemCount}
                </span>
              )}
            </Link>

            <Link
              href={authState.isLoggedIn ? "/profile" : "/login"}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-ink-900/[0.06] bg-ink-900/[0.02] hover:border-ink-900/[0.12] hover:bg-ink-900/[0.05] transition-colors overflow-hidden"
              aria-label={authState.isLoggedIn ? "Profile" : "Log in"}
            >
              {authState.isLoggedIn && authState.profile ? (
                <span className="flex h-full w-full items-center justify-center bg-gradient-to-br from-gold-400 to-brand-500 text-white font-semibold text-sm">
                  {authState.profile.name.charAt(0).toUpperCase()}
                </span>
              ) : (
                <User className="h-[17px] w-[17px] text-ink-700" strokeWidth={1.75} aria-hidden />
              )}
            </Link>
          </div>
        </div>

        {/* Search — dedicated full-width row on mobile/tablet (no search
            icon trigger, so this row must always be reachable on its own).
            Collapsed at rest; reveals only on scroll-up so the hero starts
            right under the primary row on first load. */}
        <div
          className={`md:hidden overflow-hidden transition-[max-height,opacity,transform] duration-300 ease-out ${
            searchHidden
              ? "max-h-0 opacity-0 -translate-y-2 pointer-events-none"
              : "max-h-20 opacity-100 translate-y-0"
          }`}
        >
          <div className="pb-2.5">
            <SearchBar />
          </div>
        </div>
      </div>
    </header>
  );
}
