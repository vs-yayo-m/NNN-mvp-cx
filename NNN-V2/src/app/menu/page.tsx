"use client";

// ============================================================================
// Menu / Browse page — filterable by category and veg/non-veg.
// Phase A includes basic filtering inline here; the dedicated
// CategoryFilterBar component with price sort is Phase B polish, but the
// core filtering behavior (including hiding unavailable items) is fully
// functional now.
// ============================================================================

import { useMemo, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { foodCategories, barCategories } from "@/data/categories";
import { getAvailableMenuItems } from "@/data/menu";
import MenuGrid from "@/modules/menu/components/MenuGrid";

function MenuPageContent() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get("category") ?? "all";

  const [activeCategory, setActiveCategory] = useState(initialCategory);
  const [vegOnly, setVegOnly] = useState(false);

  const allCategories = useMemo(() => [...foodCategories, ...barCategories], []);

  const items = useMemo(() => {
    let list = getAvailableMenuItems();
    if (activeCategory !== "all") {
      list = list.filter((item) => item.categoryId === activeCategory);
    }
    if (vegOnly) {
      list = list.filter((item) => item.isVeg);
    }
    return list;
  }, [activeCategory, vegOnly]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-6 flex flex-col gap-5">
      <div className="flex items-center justify-between gap-3">
        <h1 className="font-display text-2xl font-semibold text-ink-900">Menu</h1>
        <button
          type="button"
          onClick={() => setVegOnly((v) => !v)}
          className={`flex items-center gap-2 rounded-full border px-3.5 py-2 text-sm font-medium transition-colors shrink-0 ${
            vegOnly ? "border-green-600 bg-green-50 text-green-700" : "border-ink-100 text-ink-600"
          }`}
        >
          <span
            className={`flex h-3.5 w-3.5 items-center justify-center rounded-sm border-2 ${
              vegOnly ? "border-green-600" : "border-ink-400"
            }`}
          >
            <span className={`h-1.5 w-1.5 rounded-full ${vegOnly ? "bg-green-600" : "bg-transparent"}`} />
          </span>
          Veg only
        </button>
      </div>

      {/* Category chips */}
      <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1 -mx-4 px-4">
        <button
          type="button"
          onClick={() => setActiveCategory("all")}
          className={`shrink-0 rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
            activeCategory === "all"
              ? "border-brand-500 bg-brand-500 text-cream-100"
              : "border-ink-100 text-ink-600 hover:border-brand-300"
          }`}
        >
          All
        </button>
        {allCategories.map((cat) => (
          <button
            key={cat.id}
            type="button"
            onClick={() => setActiveCategory(cat.id)}
            className={`shrink-0 flex items-center gap-1.5 rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
              activeCategory === cat.id
                ? "border-brand-500 bg-brand-500 text-cream-100"
                : "border-ink-100 text-ink-600 hover:border-brand-300"
            }`}
          >
            <span aria-hidden>{cat.icon}</span>
            {cat.label}
          </button>
        ))}
      </div>

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
