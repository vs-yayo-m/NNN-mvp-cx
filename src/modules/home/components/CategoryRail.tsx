// ============================================================================
// CategoryRail — horizontally-scrollable category chips with real vector
// icons (see lib/categoryIcons.tsx), not emoji.
// ============================================================================

import Link from "next/link";
import { foodCategories, barCategories } from "@/data/categories";
import { getCategoryIcon } from "@/lib/categoryIcons";

export default function CategoryRail() {
  const allCategories = [...foodCategories, ...barCategories];

  return (
    <section>
      <h2 className="font-display text-lg font-semibold text-ink-900 mb-3">Categories</h2>
      <div className="flex gap-3 overflow-x-auto no-scrollbar pb-1 -mx-4 px-4">
        {allCategories.map((cat) => {
          const Icon = getCategoryIcon(cat.icon);
          return (
            <Link
              key={cat.id}
              href={`/menu?category=${cat.id}`}
              className={`flex flex-col items-center gap-1.5 shrink-0 w-20 rounded-xl2 border px-3 py-3 transition-colors ${
                cat.group === "bar"
                  ? "border-bar-900/20 bg-bar-900/5 hover:bg-bar-900/10"
                  : "border-ink-100 bg-cream-100 hover:border-brand-300"
              }`}
            >
              <Icon
                className={`h-6 w-6 ${cat.group === "bar" ? "text-bar-900" : "text-brand-500"}`}
                strokeWidth={1.75}
                aria-hidden
              />
              <span className="text-xs font-medium text-ink-800 text-center leading-tight">
                {cat.label}
              </span>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
