"use client";

import { Suspense, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { KITCHEN_ITEMS } from "@/data/menu-data";
import { BAR_ITEMS } from "@/data/bar-data";
import { CATEGORIES } from "@/data/site-config";
import ProductCard from "@/components/ProductCard";
import CategoryPills from "@/components/CategoryPills";
import EmptyState from "@/components/EmptyState";

type SectionFilter = "all" | "kitchen" | "bar";

function MenuContent() {
  const params = useSearchParams();
  const [section, setSection] = useState<SectionFilter>((params.get("section") as SectionFilter) || "all");
  const [category, setCategory] = useState<string>(params.get("cat") || "All");

  // Business rule: items the Admin has marked unavailable never reach the customer surface.
  const visibleItems = useMemo(
    () => [...KITCHEN_ITEMS, ...BAR_ITEMS].filter((i) => i.isAvailable),
    []
  );

  const categoriesForSection = useMemo(
    () => (section === "all" ? CATEGORIES : CATEGORIES.filter((c) => c.section === section)),
    [section]
  );

  const filtered = useMemo(() => {
    return visibleItems.filter((i) => {
      if (section !== "all" && i.section !== section) return false;
      if (category !== "All" && i.category !== category) return false;
      return true;
    });
  }, [visibleItems, section, category]);

  const grouped = useMemo(() => {
    const map = new Map<string, typeof filtered>();
    for (const item of filtered) {
      const key = item.category;
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(item);
    }
    return Array.from(map.entries());
  }, [filtered]);

  return (
    <div className="mx-auto max-w-2xl">
      <div className="sticky top-[57px] z-30 space-y-3 bg-base/95 py-3 backdrop-blur">
        <div className="flex gap-2 px-4">
          {(["all", "kitchen", "bar"] as SectionFilter[]).map((s) => (
            <button
              key={s}
              onClick={() => {
                setSection(s);
                setCategory("All");
              }}
              className={`tap-scale focus-ring flex-1 rounded-full py-2 text-sm font-semibold capitalize ${
                section === s ? "bg-turmeric text-base" : "border border-line text-muted"
              }`}
            >
              {s === "all" ? "Everything" : s === "kitchen" ? "Kitchen" : "Bar"}
            </button>
          ))}
        </div>
        <CategoryPills categories={categoriesForSection} active={category} onSelect={setCategory} />
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          title="Nothing here right now"
          message="This category is empty at the moment. Try another category or check back soon."
        />
      ) : (
        <div className="space-y-7 px-4 py-4">
          {grouped.map(([cat, items]) => (
            <section key={cat} id={cat} className="space-y-3">
              <h2 className="font-display text-lg font-semibold text-cream">{cat}</h2>
              <div className="grid grid-cols-2 gap-3">
                {items.map((item) => (
                  <ProductCard key={item.id} item={item} />
                ))}
              </div>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}

export default function MenuPage() {
  return (
    <Suspense fallback={<div className="px-4 py-10 text-center text-sm text-muted">Loading menu\u2026</div>}>
      <MenuContent />
    </Suspense>
  );
}
