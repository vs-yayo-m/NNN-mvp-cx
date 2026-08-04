"use client";

// ============================================================================
// BottomNav — mobile-only fixed tab bar. This is what makes the app feel
// like a real ordering app on a phone rather than a responsive website.
// "Search" tab points at /menu in Phase A (no dedicated /search page yet).
// ============================================================================

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCart } from "@/lib/cartStore";
import { useAuth } from "@/lib/authStore";

const TABS = [
  { href: "/", label: "Home", icon: "🏠" },
  { href: "/menu", label: "Menu", icon: "📋" },
  { href: "/cart", label: "Cart", icon: "🛒" },
  { href: "/profile", label: "Profile", icon: "👤" },
] as const;

export default function BottomNav() {
  const pathname = usePathname();
  const { itemCount } = useCart();
  const { state: authState } = useAuth();

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-cream-100 border-t border-ink-100 pb-safe">
      <div className="flex items-center justify-around">
        {TABS.map((tab) => {
          const href = tab.href === "/profile" && !authState.isLoggedIn ? "/login" : tab.href;
          const isActive =
            tab.href === "/" ? pathname === "/" : pathname.startsWith(tab.href);
          return (
            <Link
              key={tab.href}
              href={href}
              className="relative flex flex-1 flex-col items-center gap-0.5 py-2.5 text-xs"
            >
              <span
                className={`relative text-lg leading-none ${
                  isActive ? "scale-110" : "opacity-70"
                } transition-transform`}
                aria-hidden
              >
                {tab.icon}
                {tab.href === "/cart" && itemCount > 0 && (
                  <span className="absolute -top-1.5 -right-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-brand-500 px-1 text-[10px] font-semibold text-cream-100">
                    {itemCount}
                  </span>
                )}
              </span>
              <span className={isActive ? "font-semibold text-brand-500" : "text-ink-400"}>
                {tab.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
