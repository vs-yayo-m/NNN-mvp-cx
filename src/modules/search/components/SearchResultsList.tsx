// src/modules/search/components/SearchResultsList.tsx

"use client";

// ============================================================================
// SearchResultsList — runs the AI-backed search (with automatic local
// fallback) for a given query and renders results, including loading,
// empty, and "why this matched" states.
// ============================================================================

import { useEffect, useState } from "react";
import { SearchX, Search, Loader2 } from "lucide-react";
import type { MenuItem } from "@/types";
import MenuItemCard from "@/modules/menu/components/MenuItemCard";
import { searchMenuItems } from "@/lib/search";

interface SearchResultsListProps {
  query: string;
}

export default function SearchResultsList({ query }: SearchResultsListProps) {
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState<MenuItem[]>([]);
  const [reasons, setReasons] = useState<Record<string, string>>({});
  const [hasSearched, setHasSearched] = useState(false);

  useEffect(() => {
    const trimmed = query.trim();
    if (!trimmed) {
      setItems([]);
      setHasSearched(false);
      return;
    }

    let cancelled = false;
    setLoading(true);

    searchMenuItems(trimmed).then((result) => {
      if (cancelled) return;
      setItems(result.items);
      setReasons(result.reasons);
      setHasSearched(true);
      setLoading(false);
    });

    return () => {
      cancelled = true;
    };
  }, [query]);

  if (!query.trim()) {
    return (
      <div className="flex flex-col items-center justify-center gap-2 py-16 text-center">
        <Search className="h-8 w-8 text-ink-300" strokeWidth={1.5} aria-hidden />
        <p className="text-sm text-ink-400">Start typing to search the menu.</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-2 text-sm text-ink-400">
          <Loader2 className="h-4 w-4 animate-spin text-brand-500" strokeWidth={2} aria-hidden />
          Searching…
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="aspect-square rounded-xl2 bg-ink-100 animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  if (hasSearched && items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-2 py-16 text-center">
        <SearchX className="h-8 w-8 text-ink-300" strokeWidth={1.5} aria-hidden />
        <p className="font-display text-base font-semibold text-ink-800">No matches found</p>
        <p className="text-sm text-ink-400 max-w-xs">
          Try a different word, or browse the full menu instead.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <p className="text-sm text-ink-400">
        {items.length} result{items.length === 1 ? "" : "s"} for &ldquo;{query}&rdquo;
      </p>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
        {items.map((item) => (
          <div key={item.id} className="flex flex-col gap-1.5">
            <MenuItemCard item={item} />
            {reasons[item.id] && (
              <p className="px-1 text-[11px] text-ink-400 italic line-clamp-1">{reasons[item.id]}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
