// /src/modules/menu/components/MenuGrid.tsx

import { UtensilsCrossed } from "lucide-react";
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
        <UtensilsCrossed className="h-9 w-9 text-ink-300" strokeWidth={1.5} aria-hidden />
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
