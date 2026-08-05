"use client";

// ============================================================================
// Menu / Browse page — filterable by category, veg/non-veg, and price sort,
// via the dedicated CategoryFilterBar component.
// ============================================================================

import { useMemo, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { getAvailableMenuItems } from "@/data/menu";
import MenuGrid from "@/modules/menu/components/MenuGrid";
import CategoryFilterBar, { type SortOption } from "@/modules/menu/components/CategoryFilterBar";

function MenuPageContent() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get("category") ?? "all";

  const [activeCategory, setActiveCategory] = useState(initialCategory);
  const [vegOnly, setVegOnly] = useState(false);
  const [sort, setSort] = useState<SortOption>("default");

  const items = useMemo(() => {
    let list = getAvailableMenuItems();
    if (activeCategory !== "all") {
      list = list.filter((item) => item.categoryId === activeCategory);
    }
    if (vegOnly) {
      list = list.filter((item) => item.isVeg);
    }
    if (sort !== "default") {
      list = [...list].sort((a, b) => {
        const priceA = Math.min(...a.variants.map((v) => v.price));
        const priceB = Math.min(...b.variants.map((v) => v.price));
        return sort === "price-asc" ? priceA - priceB : priceB - priceA;
      });
    }
    return list;
  }, [activeCategory, vegOnly, sort]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-6 flex flex-col gap-5">
      <h1 className="font-display text-2xl font-semibold text-ink-900">Menu</h1>

      <CategoryFilterBar
        activeCategory={activeCategory}
        onCategoryChange={setActiveCategory}
        vegOnly={vegOnly}
        onVegOnlyChange={setVegOnly}
        sort={sort}
        onSortChange={setSort}
      />

      <MenuGrid
        items={items}
        emptyMessage={
          vegOnly
            ? "No vegetarian items in this category right now."
            : "No items in this category right now — try another one."
        }
      />
    </div>
  );
}

export default function MenuPage() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-6xl px-4 py-6">
          <div className="h-8 w-32 bg-ink-100 rounded-full animate-pulse mb-5" />
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="aspect-square rounded-xl2 bg-ink-100 animate-pulse" />
            ))}
          </div>
        </div>
      }
    >
      <MenuPageContent />
    </Suspense>
  );
}
