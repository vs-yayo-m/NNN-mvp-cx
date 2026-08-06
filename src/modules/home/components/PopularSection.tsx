// ============================================================================
// PopularSection — home section driven by the isPopular flag.
// ============================================================================

import Link from "next/link";
import { TrendingUp } from "lucide-react";
import { getPopularItems } from "@/data/menu";
import MenuItemCard from "@/modules/menu/components/MenuItemCard";

export default function PopularSection() {
  const popular = getPopularItems().slice(0, 8);

  return (
    <section>
      <div className="flex items-center justify-between mb-3">
        <h2 className="flex items-center gap-1.5 font-display text-lg font-semibold text-ink-900">
          <TrendingUp className="h-4 w-4 text-brand-500" strokeWidth={2} aria-hidden />
          Popular Right Now
        </h2>
        <Link href="/menu" className="text-sm font-medium text-brand-500 hover:text-brand-600">
          See all
        </Link>
      </div>
      {popular.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          {popular.map((item) => (
            <MenuItemCard key={item.id} item={item} />
          ))}
        </div>
      ) : (
        <p className="text-sm text-ink-400">Nothing trending yet — be the first to order!</p>
      )}
    </section>
  );
}
