"use client";

// ============================================================================
// BottomNav — mobile-only fixed tab bar. This is what makes the app feel
// like a real ordering app on a phone rather than a responsive website.
// Icons are Lucide, filled/bold when active for a premium, tactile feel.
// ============================================================================

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, UtensilsCrossed, ShoppingBag, User } from "lucide-react";
import { useCart } from "@/lib/cartStore";
import { useAuth } from "@/lib/authStore";

const TABS = [
  { href: "/", label: "Home", Icon: Home },
  { href: "/menu", label: "Menu", Icon: UtensilsCrossed },
  { href: "/cart", label: "Cart", Icon: ShoppingBag },
  { href: "/profile", label: "Profile", Icon: User },
] as const;

export default function BottomNav() {
  const pathname = usePathname();
  const { itemCount } = useCart();
  const { state: authState } = useAuth();

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-cream-100 border-t border-ink-100 pb-safe">
      <div className="flex items-center justify-around">
        {TABS.map(({ href, label, Icon }) => {
          const linkHref = href === "/profile" && !authState.isLoggedIn ? "/login" : href;
          const isActive = href === "/" ? pathname === "/" : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={linkHref}
              className="relative flex flex-1 flex-col items-center gap-1 py-2.5 text-xs"
            >
              <span className="relative">
                <Icon
                  className={`h-5 w-5 transition-all ${isActive ? "text-brand-500 scale-110" : "text-ink-400"}`}
                  strokeWidth={isActive ? 2.25 : 1.75}
                  aria-hidden
                />
                {href === "/cart" && itemCount > 0 && (
                  <span className="absolute -top-1.5 -right-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-brand-500 px-1 text-[10px] font-semibold text-cream-100">
                    {itemCount}
                  </span>
                )}
              </span>
              <span className={isActive ? "font-semibold text-brand-500" : "text-ink-400"}>
                {label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
