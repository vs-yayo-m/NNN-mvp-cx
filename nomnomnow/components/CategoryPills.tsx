"use client";

import { CategoryMeta } from "@/data/site-config";

export default function CategoryPills({
  categories,
  active,
  onSelect,
}: {
  categories: CategoryMeta[];
  active: string;
  onSelect: (key: string) => void;
}) {
  return (
    <div className="scrollbar-none flex gap-2 overflow-x-auto px-4 pb-1" role="tablist" aria-label="Menu categories">
      <button
        role="tab"
        aria-selected={active === "All"}
        onClick={() => onSelect("All")}
        className={`tap-scale focus-ring shrink-0 rounded-full border px-4 py-2 text-sm font-medium ${
          active === "All" ? "border-chili bg-chili text-cream" : "border-line text-muted"
        }`}
      >
        All
      </button>
      {categories.map((c) => (
        <button
          key={c.key}
          role="tab"
          aria-selected={active === c.key}
          onClick={() => onSelect(c.key)}
          className={`tap-scale focus-ring flex shrink-0 items-center gap-1.5 rounded-full border px-4 py-2 text-sm font-medium ${
            active === c.key ? "border-chili bg-chili text-cream" : "border-line text-muted"
          }`}
        >
          <span aria-hidden>{c.icon}</span>
          {c.label}
        </button>
      ))}
    </div>
  );
}
