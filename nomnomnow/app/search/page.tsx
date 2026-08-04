"use client";

import { useEffect, useMemo, useState } from "react";
import { KITCHEN_ITEMS } from "@/data/menu-data";
import { BAR_ITEMS } from "@/data/bar-data";
import { CATEGORIES } from "@/data/site-config";
import { slugSearch } from "@/lib/utils";
import { readStorage, writeStorage, STORAGE_KEYS } from "@/lib/storage";
import ProductCard from "@/components/ProductCard";
import EmptyState from "@/components/EmptyState";

const ALL_ITEMS = [...KITCHEN_ITEMS, ...BAR_ITEMS].filter((i) => i.isAvailable);

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [recent, setRecent] = useState<string[]>([]);

  useEffect(() => {
    setRecent(readStorage(STORAGE_KEYS.recentSearches, [] as string[]));
  }, []);

  const results = useMemo(() => slugSearch(ALL_ITEMS, query), [query]);

  const commitSearch = (q: string) => {
    if (!q.trim()) return;
    setRecent((prev) => {
      const next = [q, ...prev.filter((r) => r.toLowerCase() !== q.toLowerCase())].slice(0, 6);
      writeStorage(STORAGE_KEYS.recentSearches, next);
      return next;
    });
  };

  const popularCategories = CATEGORIES.filter((c) => c.section === "kitchen").slice(0, 6);

  return (
    <div className="mx-auto max-w-2xl px-4 py-4">
      <div className="relative mb-4">
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-muted"
        >
          <circle cx="11" cy="11" r="7" />
          <path d="m20 20-3.5-3.5" />
        </svg>
        <input
          autoFocus
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && commitSearch(query)}
          onBlur={() => commitSearch(query)}
          placeholder="Search momo, pizza, beer\u2026"
          className="focus-ring w-full rounded-full border border-line bg-surface py-3 pl-11 pr-4 text-sm text-cream placeholder:text-muted"
        />
      </div>

      {!query && (
        <div className="space-y-6">
          {recent.length > 0 && (
            <section>
              <h2 className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted">Recent searches</h2>
              <div className="flex flex-wrap gap-2">
                {recent.map((r) => (
                  <button
                    key={r}
                    onClick={() => setQuery(r)}
                    className="tap-scale focus-ring rounded-full border border-line px-3 py-1.5 text-xs text-cream"
                  >
                    {r}
                  </button>
                ))}
              </div>
            </section>
          )}
          <section>
            <h2 className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted">Popular categories</h2>
            <div className="flex flex-wrap gap-2">
              {popularCategories.map((c) => (
                <button
                  key={c.key}
                  onClick={() => setQuery(c.key)}
                  className="tap-scale focus-ring flex items-center gap-1.5 rounded-full border border-line px-3 py-1.5 text-xs text-cream"
                >
                  <span aria-hidden>{c.icon}</span>
                  {c.label}
                </button>
              ))}
            </div>
          </section>
        </div>
      )}

      {query && results.length === 0 && (
        <EmptyState title="No matches" message={`Nothing found for "${query}". Try a different word.`} />
      )}

      {query && results.length > 0 && (
        <div className="grid grid-cols-2 gap-3">
          {results.map((item) => (
            <ProductCard key={item.id} item={item} />
          ))}
        </div>
      )}
    </div>
  );
}
