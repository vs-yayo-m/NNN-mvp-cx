"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useApp } from "@/context/AppContext";

const TABS = [
  { href: "/", label: "Home", icon: "home" },
  { href: "/menu", label: "Menu", icon: "menu" },
  { href: "/search", label: "Search", icon: "search" },
  { href: "/orders", label: "Orders", icon: "orders" },
  { href: "/cart", label: "Cart", icon: "cart" },
] as const;

function Icon({ name, active }: { name: string; active: boolean }) {
  const stroke = active ? "#F2A93B" : "#8A8074";
  const common = { fill: "none", stroke, strokeWidth: 2, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  switch (name) {
    case "home":
      return (
        <svg width="20" height="20" viewBox="0 0 24 24" {...common}>
          <path d="M3 11.5 12 4l9 7.5" />
          <path d="M5 10v9a1 1 0 0 0 1 1h4v-6h4v6h4a1 1 0 0 0 1-1v-9" />
        </svg>
      );
    case "menu":
      return (
        <svg width="20" height="20" viewBox="0 0 24 24" {...common}>
          <path d="M4 6h16M4 12h16M4 18h10" />
        </svg>
      );
    case "search":
      return (
        <svg width="20" height="20" viewBox="0 0 24 24" {...common}>
          <circle cx="11" cy="11" r="7" />
          <path d="m20 20-3.5-3.5" />
        </svg>
      );
    case "orders":
      return (
        <svg width="20" height="20" viewBox="0 0 24 24" {...common}>
          <path d="M6 3h12v17l-3-2-3 2-3-2-3 2Z" />
          <path d="M9 8h6M9 12h6" />
        </svg>
      );
    default:
      return (
        <svg width="20" height="20" viewBox="0 0 24 24" {...common}>
          <path d="M3 3h2l.4 2M7 13h10l3-8H5.4M7 13 5.4 5M7 13l-2.3 4.6A1 1 0 0 0 5.6 19H17" />
          <circle cx="9" cy="21" r="1" />
          <circle cx="17" cy="21" r="1" />
        </svg>
      );
  }
}

export default function BottomNav() {
  const pathname = usePathname();
  const { cartCount } = useApp();

  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-surface/95 backdrop-blur">
      <div className="mx-auto flex max-w-2xl items-stretch justify-between px-2">
        {TABS.map((tab) => {
          const active = tab.href === "/" ? pathname === "/" : pathname.startsWith(tab.href);
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className="tap-scale focus-ring relative flex flex-1 flex-col items-center gap-1 py-2.5"
            >
              <Icon name={tab.icon} active={active} />
              <span className={`text-[10px] font-medium ${active ? "text-turmeric" : "text-muted"}`}>{tab.label}</span>
              {tab.icon === "cart" && cartCount > 0 && (
                <span className="absolute right-4 top-1 grid h-4 min-w-4 place-items-center rounded-full bg-chili px-1 font-mono text-[9px] font-bold text-cream">
                  {cartCount}
                </span>
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
