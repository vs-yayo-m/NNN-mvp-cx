// src/components/layout/Header.tsx
"use client";

// ============================================================================
// Header — near-black glass surface. Logo is the original asset, full size,
// no background chip (per direction: "keep logo original, no layout
// changes"). Desktop search bar collapses to an icon-only pill on scroll
// down and expands back on scroll up — an animated width/opacity morph,
// not a hard show/hide. Tapping the collapsed icon (or the full bar)
// routes to /search.
// ============================================================================

import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { MapPin, ShoppingBag, User, ChevronDown, Bell, Search } from "lucide-react";
import { useCart } from "@/lib/cartStore";
import { useAuth } from "@/lib/authStore";
import { useNotifications } from "@/lib/notificationStore";
import SearchBar from "@/modules/search/components/SearchBar";

const SCROLL_COLLAPSE_THRESHOLD = 72; // px scrolled before we start collapsing
const SCROLL_DELTA_TO_TRIGGER = 6; // ignore sub-pixel/jitter scroll events

export default function Header() {
  const router = useRouter();
  const { itemCount } = useCart();
  const { state: authState } = useAuth();
  const { unreadCount } = useNotifications();
  const [locationNoticeOpen, setLocationNoticeOpen] = useState(false);

  // ---- Scroll-driven search collapse (desktop inline bar only) ----------
  const [collapsed, setCollapsed] = useState(false);
  const lastScrollY = useRef(0);

  useEffect(() => {
    lastScrollY.current = window.scrollY;

    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const y = window.scrollY;
        const delta = y - lastScrollY.current;

        if (y <= SCROLL_COLLAPSE_THRESHOLD) {
          // Always expanded near the top, regardless of direction.
          setCollapsed(false);
        } else if (Math.abs(delta) > SCROLL_DELTA_TO_TRIGGER) {
          setCollapsed(delta > 0); // scrolling down -> collapse, up -> expand
        }

        lastScrollY.current = y;
        ticking = false;
      });
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

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
          {/* Logo — original asset, full size, no wrapper/box/background.
              Untouched from the original layout. */}
        <Link href="/" className="flex items-center shrink-0 -my-2">
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

          {/* AI-powered search — full width, desktop inline. Morphs between
              full bar and icon-only pill based on scroll direction. The
              icon button and the bar are cross-faded/width-animated rather
              than swapped instantly, and both are always mounted so there's
              no layout jump when the transition completes. */}
          <div className="hidden md:flex flex-1 items-center justify-end min-w-0">
            <div
              className={`relative flex items-center transition-[flex-basis] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                collapsed ? "flex-none" : "flex-1"
              }`}
              style={{ minWidth: 0 }}
            >
              {/* Full bar — fades/shrinks out on collapse */}
              <div
                className={`overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                  collapsed
                    ? "max-w-0 opacity-0 scale-95 pointer-events-none"
                    : "max-w-[900px] opacity-100 scale-100 w-full"
                }`}
              >
                <SearchBar variant="header" />
              </div>

              {/* Collapsed icon — fades/grows in on collapse */}
              <button
                type="button"
                onClick={() => router.push("/search")}
                aria-label="Open search"
                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full border transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                  collapsed
                    ? "opacity-100 scale-100 border-white/[0.1] bg-white/[0.05] hover:border-brand-500/30 hover:bg-white/[0.08]"
                    : "opacity-0 scale-75 pointer-events-none absolute border-transparent"
                }`}
              >
                <Search className="h-4 w-4 text-white/80" strokeWidth={2} aria-hidden />
              </button>
            </div>
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

        {/* Search — full width row on mobile/tablet. Mobile does not
            collapse-to-icon (screen is already narrow and the bar sits on
            its own row) — it stays a tap target straight to /search. */}
        <div className="md:hidden pb-3">
          <SearchBar variant="header" />
        </div>
      </div>
    </header>
  );
}
