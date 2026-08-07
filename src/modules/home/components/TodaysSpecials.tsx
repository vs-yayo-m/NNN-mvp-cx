// /src/modules/home/components/TodaysSpecials.tsx
"use client";

import Link from "next/link";
import { Star } from "lucide-react";
import { getTodaysSpecials } from "@/data/menu";
import { useVegMode } from "@/lib/vegModeStore";
import MenuItemCard from "@/modules/menu/components/MenuItemCard";

export default function TodaysSpecials() {
  const { isVegOnly } = useVegMode();
  const specials = getTodaysSpecials(isVegOnly).slice(0, 4);
  
  return (
    <section>
      <div className="flex items-center justify-between mb-3">
        <h2 className="flex items-center gap-1.5 font-display text-lg font-semibold text-ink-900">
          <Star className="h-4 w-4 text-gold-400" strokeWidth={2} fill="currentColor" aria-hidden />
          Today&apos;s Specials
        </h2>
        <Link href="/menu" className="text-sm font-medium text-brand-500 hover:text-brand-600">
          See all
        </Link>
      </div>
      {specials.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          {specials.map((item) => (
            <MenuItemCard key={item.id} item={item} />
          ))}
        </div>
      ) : (
        <p className="text-sm text-ink-400">No specials flagged for today — check back soon.</p>
      )}
    </section>
  );
}