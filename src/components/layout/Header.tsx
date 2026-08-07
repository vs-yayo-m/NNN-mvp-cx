// src/components/layout/Header.tsx
"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { MapPin, ShoppingBag, User, ChevronDown, Bell } from "lucide-react";
import { useCart } from "@/lib/cartStore";
import { useAuth } from "@/lib/authStore";
import { useNotifications } from "@/lib/notificationStore";
import { useVegMode } from "@/lib/vegModeStore";
import SearchBar from "@/modules/search/components/SearchBar";
import VegToggle from "@/components/layout/VegToggle";
import OnboardingTour from "@/components/onboarding/OnboardingTour";

// Minimum real vertical movement (px) required before we flip the
// hidden/visible state. Needs to be comfortably above the noise floor of
// mobile browser toolbar resize jumps (which can shift scrollY by 40-100px
// in a single frame) — see handleScroll below for why that matters.
const SCROLL_DELTA_THRESHOLD = 14;

// Below this scrollY, always force the search row visible regardless of
// direction — avoids any flicker right at the top of the page.
const TOP_REVEAL_THRESHOLD = 80;

export default function Header() {
  const { itemCount } = useCart();
  const { state: authState } = useAuth();
  const { unreadCount } = useNotifications();
  const { isVegOnly, toggleVegOnly } = useVegMode();
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
  // threshold + direction delta so it doesn't flicker on tiny scroll jitter,
  // and it never hides while still near the top of the page.
  //
  // IMPORTANT: mobile browsers (Chrome/Safari) auto-collapse and re-expand
  // their own URL bar as you scroll, which resizes the visual viewport.
  // That resize makes window.scrollY jump by an artificial amount on a
  // single frame — not a real user scroll gesture — which used to cause
  // this effect to misfire mid-scroll (the bar would get stuck half
  // collapsed / overlap the content below it). We detect viewport height
  // changes and skip the direction check on those frames, so only genuine
  // scroll gestures can toggle the row.
  const [searchHidden, setSearchHidden] = useState(false);
  const lastScrollY = useRef(0);

  useEffect(() => {
    lastScrollY.current = Math.max(0, window.scrollY);
    let lastViewportHeight = window.visualViewport?.height ?? window.innerHeight;
    let ticking = false;

    const handleScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        ticking = false;

        // Clamp: iOS rubber-band overscroll can report a small negative
        // scrollY, which would otherwise register as a huge false delta.
        const currentY = Math.max(0, window.scrollY);
        const currentViewportHeight =
          window.visualViewport?.height ?? window.innerHeight;

        // The mobile URL bar just showed/hid and resized the viewport.
        // This scroll event is a side effect of that resize, not a user
        // gesture — resync our reference point and bail without changing
        // searchHidden, so the row doesn't flip state mid-collapse.
        if (currentViewportHeight !== lastViewportHeight) {
          lastViewportHeight = currentViewportHeight;
          lastScrollY.current = currentY;
          return;
        }

        const delta = currentY - lastScrollY.current;

        if (currentY < TOP_REVEAL_THRESHOLD) {
          setSearchHidden(false);
        } else if (delta > SCROLL_DELTA_THRESHOLD) {
          setSearchHidden(true);
        } else if (delta < -SCROLL_DELTA_THRESHOLD) {
          setSearchHidden(false);
        }

        lastScrollY.current = currentY;
      });
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    // Some browsers fire resize on the visualViewport instead of (or in
    // addition to) a scroll event when the URL bar toggles. Listening here
    // too keeps lastViewportHeight in sync even if no scroll event fires.
    window.visualViewport?.addEventListener("resize", () => {
      lastViewportHeight = window.visualViewport?.height ?? window.innerHeight;
    });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Refs for the onboarding tour's spotlight targets. Registered here (not
  // inside OnboardingTour) because the tour needs to point at the actual
  // rendered header elements, and Header is what owns them.
  //
  // Veg toggle renders TWICE (once in the desktop row, once in the mobile
  // row) and only one copy is ever visible at a given viewport width via
  // CSS display, not conditional rendering — so a single ref can't cover
  // both. Each copy registers itself into vegTargetRefs; the tour picks
  // whichever one currently has a non-zero size (i.e. is actually visible)
  // at spotlight time. Same story isn't needed for search/cart/account
  // since those only render once.
  const vegDesktopRef = useRef<HTMLButtonElement>(null);
  const vegMobileRef = useRef<HTMLButtonElement>(null);
  const searchTargetRef = useRef<HTMLDivElement>(null);
  const cartTargetRef = useRef<HTMLAnchorElement>(null);
  const accountTargetRef = useRef<HTMLAnchorElement>(null);

  return (
    <header className="sticky top-0 z-40 border-b border-ink-900/[0.06] bg-white/85 backdrop-blur-xl">
      {/* Faint top hairline glow — premium accent, not decoration for its own sake */}
      <div
        aria-hidden
        className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-brand-500/50 to-transparent"
      />

      <div className="mx-auto max-w-6xl px-4 flex flex-col">
        {/* Primary row — always visible. min-h-14 (56px) rather than a
            hard h-14, so it comfortably fits the VEG card (~45px tall,
            sized to match SearchBar's own pill height) without being
            forced taller than necessary — kept as min-h instead of
            reverting to a fixed h-14 so any future growth in this row's
            content still has headroom instead of clipping again. */}
        <div className="min-h-14 py-1.5 flex items-center justify-between gap-4">
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
              className="h-11 w-auto object-contain transition-transform duration-300 group-hover:scale-[1.03]"
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

          {/* AI-assisted search — full width, desktop inline. Desktop copy
              stays visible even while scrolling; only the dedicated mobile
              row below hides, since desktop has the vertical room to spare.
              The Veg toggle sits directly alongside it so switching veg
              mode is always one tap away without opening a menu/filter
              panel — mirrors the Swiggy pattern the client referenced. */}
          <div className="hidden md:flex flex-1 items-center gap-3">
            <div className="flex-1">
              <SearchBar />
            </div>
            <VegToggle ref={vegDesktopRef} isVegOnly={isVegOnly} onToggle={toggleVegOnly} />
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
                <span className="absolute -top-1 -right-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-brand-500 px-1 text-[9px] font-semibold text-white shadow-[0_0_10px_rgba(232,74,46,0.5)]">
                  {unreadCount > 9 ? "9+" : unreadCount}
                </span>
              )}
            </Link>

            <Link
              ref={cartTargetRef}
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
                  className={`absolute -top-1 -right-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-brand-500 px-1 text-[9px] font-semibold text-white shadow-[0_0_10px_rgba(232,74,46,0.5)] transition-transform duration-300 ${
                    cartBump ? "scale-125" : "scale-100"
                  }`}
                >
                  {itemCount > 99 ? "99+" : itemCount}
                </span>
              )}
            </Link>

            <Link
              ref={accountTargetRef}
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
            Collapses smoothly on scroll-down, reveals on scroll-up.

            FIX: this wrapper used to be a fixed `h-16`, sized as a guess
            for the search bar alone. Once the veg toggle joined this row
            the actual content no longer filled that guessed height, which
            is what left the dead empty band under the header in the
            screenshots (visible even when nothing was collapsed — it's a
            static layout gap, not part of the hide/show animation). Fixed
            by removing the fixed height entirely and animating max-height
            between 0 (hidden) and a deliberately oversized cap (shown) —
            max-h-28 (112px) against a row that's normally ~55px tall
            (search bar + veg card, both now matched to ~44-45px, plus
            bottom padding), so it's a ceiling that's never actually
            reached rather than a tight guess. The wrapper always clips to
            the *content's* real height via that headroom, not a fixed
            pixel value, so it can't leave dead space the way the old h-16
            did, and it can't clip content either even if text scaling or
            a locale with longer strings makes the row slightly taller.
            transform+opacity still do the actual show/hide motion —
            max-height here only prevents the collapsed state from
            reserving space.

            SEARCH SUGGESTIONS BUG FIX: overflow-hidden on this wrapper
            (needed so the max-height collapse animation doesn't show a
            flash of content spilling out mid-transition) was also
            clipping SearchBar's own suggestions dropdown, which renders
            as position:absolute + top-full and needs to extend below this
            row's box to be visible at all. That's why suggestions worked
            on desktop (no overflow-hidden ancestor there) but silently
            failed to appear on mobile — they weren't behind the hero
            banner, they were being clipped out of the DOM's visible
            painted area entirely by this wrapper. Fixed by only clipping
            while the row is actually hidden/collapsing (searchHidden ===
            true); once fully expanded there is nothing left to hide, so
            overflow is allowed to escape and the dropdown renders
            normally in its resting state — which is the only state a
            person can be typing into it anyway. */}
        <div
          className={`md:hidden transition-[max-height] duration-300 ease-out ${
            searchHidden ? "overflow-hidden max-h-0" : "overflow-visible max-h-28"
          }`}
        >
          <div
            className={`pb-2.5 flex items-center gap-2.5 transition-[transform,opacity] duration-300 ease-out ${
              searchHidden
                ? "-translate-y-4 opacity-0 pointer-events-none"
                : "translate-y-0 opacity-100"
            }`}
            style={{ willChange: "transform, opacity" }}
          >
            <div ref={searchTargetRef} className="flex-1 min-w-0">
              <SearchBar />
            </div>
            <VegToggle ref={vegMobileRef} isVegOnly={isVegOnly} onToggle={toggleVegOnly} />
          </div>
        </div>
      </div>

      <OnboardingTour
        targets={{
          veg: [vegDesktopRef, vegMobileRef],
          search: searchTargetRef,
          cart: cartTargetRef,
          account: accountTargetRef,
        }}
      />
    </header>
  );
}
