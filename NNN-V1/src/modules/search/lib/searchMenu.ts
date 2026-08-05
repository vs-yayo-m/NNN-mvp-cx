// src/modules/search/lib/searchMenu.ts

// ============================================================================
// Real-time local menu search. No network round-trip — suggestions come
// straight from src/data/menu.ts so the dropdown feels instant (this is
// what "real-time suggestions" should mean for a fixed menu; an LLM call
// per keystroke would be slower AND cost money for zero benefit here).
//
// Matches on: item name, description, tags, and category id — so "spicy"
// or "bestseller" surfaces relevant dishes, not just literal name matches.
// Unavailable items are always excluded (same rule the rest of the app
// enforces via getAvailableMenuItems()).
// ============================================================================

import { menuItems } from "@/data/menu";
import type { MenuItem } from "@/types";

export interface SearchSuggestion {
  id: string;
  name: string;
  image: string;
  isVeg: boolean;
  /** Lowest variant price — shown in the dropdown as a concise "from ₹X". */
  priceFrom: number;
  categoryId: string;
  isTodaysSpecial: boolean;
}

function toSuggestion(item: MenuItem): SearchSuggestion {
  const priceFrom = Math.min(...item.variants.map((v) => v.price));
  return {
    id: item.id,
    name: item.name,
    image: item.image,
    isVeg: item.isVeg,
    priceFrom,
    categoryId: item.categoryId,
    isTodaysSpecial: item.isTodaysSpecial,
  };
}

/**
 * Score a single item against a query. Higher is better; 0 means no match.
 * Name matches rank highest, then tags/category, then description — so
 * typing "momo" surfaces momo dishes before something that merely mentions
 * dumplings in a description.
 */
function scoreItem(item: MenuItem, query: string): number {
  const q = query.trim().toLowerCase();
  if (!q) return 0;

  const name = item.name.toLowerCase();
  const description = item.description.toLowerCase();
  const tags = item.tags.map((t) => t.toLowerCase());
  const category = item.categoryId.toLowerCase();

  if (name === q) return 100;
  if (name.startsWith(q)) return 90;
  if (name.includes(q)) return 70;
  if (tags.some((t) => t.includes(q))) return 50;
  if (category.includes(q)) return 45;
  if (description.includes(q)) return 30;

  return 0;
}

export interface SearchOptions {
  /** Max suggestions to return (dropdown context). Default 6. */
  limit?: number;
  /** Restrict to veg-only results. */
  vegOnly?: boolean;
}

export function searchSuggestions(
  query: string,
  options: SearchOptions = {}
): SearchSuggestion[] {
  const { limit = 6, vegOnly = false } = options;
  const q = query.trim();
  if (!q) return [];

  return menuItems
    .filter((item) => item.isAvailable)
    .filter((item) => (vegOnly ? item.isVeg : true))
    .map((item) => ({ item, score: scoreItem(item, q) }))
    .filter(({ score }) => score > 0)
    .sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      // Tie-break: popular/today's-special items surface first.
      const aBoost = (a.item.isTodaysSpecial ? 2 : 0) + (a.item.isPopular ? 1 : 0);
      const bBoost = (b.item.isTodaysSpecial ? 2 : 0) + (b.item.isPopular ? 1 : 0);
      return bBoost - aBoost;
    })
    .slice(0, limit)
    .map(({ item }) => toSuggestion(item));
}

/** Full, unlimited result set — used on the /search results page itself. */
export function searchAllMatches(
  query: string,
  options: Omit<SearchOptions, "limit"> = {}
): SearchSuggestion[] {
  return searchSuggestions(query, { ...options, limit: Number.MAX_SAFE_INTEGER });
}
