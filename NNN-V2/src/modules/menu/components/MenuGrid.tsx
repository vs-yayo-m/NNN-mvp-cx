// ============================================================================
// MenuGrid — responsive grid of MenuItemCard. Handles the empty state so
// no list is ever a blank div, per blueprint §2.2 principle #1.
// ============================================================================

import type { MenuItem } from "@/types";
import MenuItemCard from "./MenuItemCard";

interface MenuGridProps {
  items: MenuItem[];
  emptyMessage?: string;
}

export default function MenuGrid({ items, emptyMessage }: MenuGridProps) {
  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-2 py-16 text-center">
        <span className="text-4xl" aria-hidden>
          🍲
        </span>
        <p className="font-display text-base font-semibold text-ink-800">
          Nothing here right now
        </p>
        <p className="text-sm text-ink-400 max-w-xs">
          {emptyMessage ?? "Try a different category — new items are added often."}
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
      {items.map((item) => (
        <MenuItemCard key={item.id} item={item} />
      ))}
    </div>
  );
}
