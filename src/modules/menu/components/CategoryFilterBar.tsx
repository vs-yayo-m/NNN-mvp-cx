//src/modules/menu/components/CategoryFilterBar.tsx
"use client";



import { Leaf, ArrowUpDown } from "lucide-react";
import { foodCategories, barCategories } from "@/data/categories";
import { getCategoryIcon } from "@/lib/categoryIcons";

export type SortOption = "default" | "price-asc" | "price-desc";

interface CategoryFilterBarProps {
  activeCategory: string;
  onCategoryChange: (categoryId: string) => void;
  vegOnly: boolean;
  onVegOnlyChange: (value: boolean) => void;
  sort: SortOption;
  onSortChange: (sort: SortOption) => void;
}

const SORT_LABELS: Record<SortOption, string> = {
  default: "Sort",
  "price-asc": "Price: Low to High",
  "price-desc": "Price: High to Low",
};

export default function CategoryFilterBar({
  activeCategory,
  onCategoryChange,
  vegOnly,
  onVegOnlyChange,
  sort,
  onSortChange,
}: CategoryFilterBarProps) {
  const allCategories = [...foodCategories, ...barCategories];

  function cycleSort() {
    const order: SortOption[] = ["default", "price-asc", "price-desc"];
    const next = order[(order.indexOf(sort) + 1) % order.length];
    onSortChange(next);
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={() => onVegOnlyChange(!vegOnly)}
          className={`flex items-center gap-2 rounded-full border px-3.5 py-2 text-sm font-medium transition-colors shrink-0 ${
            vegOnly ? "border-green-600 bg-green-50 text-green-700" : "border-ink-100 text-ink-600"
          }`}
        >
          <Leaf className="h-3.5 w-3.5" strokeWidth={2} aria-hidden />
          Veg only
        </button>

        <button
          type="button"
          onClick={cycleSort}
          className={`flex items-center gap-1.5 rounded-full border px-3.5 py-2 text-sm font-medium transition-colors shrink-0 ${
            sort !== "default" ? "border-brand-500 bg-brand-50 text-brand-600" : "border-ink-100 text-ink-600"
          }`}
        >
          <ArrowUpDown className="h-3.5 w-3.5" strokeWidth={2} aria-hidden />
          {SORT_LABELS[sort]}
        </button>
      </div>

      <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1 -mx-4 px-4">
        <button
          type="button"
          onClick={() => onCategoryChange("all")}
          className={`shrink-0 rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
            activeCategory === "all"
              ? "border-brand-500 bg-brand-500 text-cream-100"
              : "border-ink-100 text-ink-600 hover:border-brand-300"
          }`}
        >
          All
        </button>
        {allCategories.map((cat) => {
          const Icon = getCategoryIcon(cat.icon);
          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => onCategoryChange(cat.id)}
              className={`shrink-0 flex items-center gap-1.5 rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
                activeCategory === cat.id
                  ? "border-brand-500 bg-brand-500 text-cream-100"
                  : "border-ink-100 text-ink-600 hover:border-brand-300"
              }`}
            >
              <Icon className="h-3.5 w-3.5" strokeWidth={1.75} aria-hidden />
              {cat.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
