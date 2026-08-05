// ============================================================================
// localRecommend.ts — deterministic popularity-based fallback used when the
// Groq-backed /api/ai-recommend route fails, times out, or GROQ_API_KEY is
// missing. See lib/recommend.ts for the AI-backed entry point.
// ============================================================================

import type { MenuItem } from "@/types";
import { getAvailableMenuItems, getPopularItems } from "@/data/menu";

export interface Recommendation {
  item: MenuItem;
  reason: string;
}

/**
 * Popularity + category-affinity based recommendations. If `categoryIds` is
 * given (e.g. from cart/order-history categories), items in those
 * categories are preferred; otherwise falls back to the isPopular flag.
 */
export function recommendItemsLocal(
  categoryIds: string[] = [],
  excludeIds: string[] = [],
  limit = 4
): Recommendation[] {
  const excludeSet = new Set(excludeIds);
  const available = getAvailableMenuItems().filter((item) => !excludeSet.has(item.id));

  if (categoryIds.length > 0) {
    const categorySet = new Set(categoryIds);
    const affinityMatches = available.filter((item) => categorySet.has(item.categoryId));
    if (affinityMatches.length >= limit) {
      return affinityMatches.slice(0, limit).map((item) => ({
        item,
        reason: `Popular in ${item.categoryId.replace(/-/g, " ")}`,
      }));
    }
    // Not enough category matches — top up with popular items.
    const remaining = limit - affinityMatches.length;
    const popularFillIns = available
      .filter((item) => item.isPopular && !affinityMatches.includes(item))
      .slice(0, remaining);
    return [...affinityMatches, ...popularFillIns].map((item) => ({
      item,
      reason: item.isPopular ? "Popular right now" : `From ${item.categoryId.replace(/-/g, " ")}`,
    }));
  }

  const popular = getPopularItems().filter((item) => !excludeSet.has(item.id));
  return popular.slice(0, limit).map((item) => ({ item, reason: "Popular right now" }));
}
