"use client";

import Link from "next/link";
import { useApp } from "@/context/AppContext";
import { SITE } from "@/data/site-config";
import { formatPrice } from "@/lib/utils";

export default function Header() {
  const { cartCount, cartSubtotal } = useApp();

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-base/90 backdrop-blur">
      <div className="mx-auto flex max-w-2xl items-center justify-between px-4 py-3">
        <Link href="/" className="flex items-center gap-2 focus-ring rounded-md">
          <span className="font-display text-xl font-bold italic tracking-tight text-cream">
            Nom Nom <span className="text-chili not-italic">Now</span>
          </span>
        </Link>

        <div className="flex items-center gap-3">
          <div className="hidden sm:flex flex-col items-end leading-tight">
            <span className="eyebrow text-muted">Delivering from</span>
            <span className="text-xs font-medium text-cream">{SITE.branch}</span>
          </div>
          <Link
            href="/search"
            aria-label="Search menu"
            className="tap-scale focus-ring grid h-10 w-10 place-items-center rounded-full border border-line text-cream"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="7" />
              <path d="m20 20-3.5-3.5" />
            </svg>
          </Link>
          <Link
            href="/cart"
            aria-label={`Cart, ${cartCount} items`}
            className="tap-scale focus-ring relative flex h-10 items-center gap-2 rounded-full bg-chili px-3 text-cream"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 3h2l.4 2M7 13h10l3-8H5.4M7 13 5.4 5M7 13l-2.3 4.6A1 1 0 0 0 5.6 19H17" />
              <circle cx="9" cy="21" r="1" />
              <circle cx="17" cy="21" r="1" />
            </svg>
            {cartCount > 0 && (
              <span className="font-mono text-xs font-semibold">{formatPrice(cartSubtotal)}</span>
            )}
          </Link>
        </div>
      </div>
    </header>
  );
}
