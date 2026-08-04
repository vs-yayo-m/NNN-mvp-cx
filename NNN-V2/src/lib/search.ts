// ============================================================================
// Search — Phase A local implementation only (simple substring/fuzzy match).
// Phase B swaps the body of `searchMenuItems` for a call to the Groq-backed
// /api/ai-search route, but keeps this exact function signature — so
// SearchBar.tsx and any other caller never need to change.
// ============================================================================

import type { MenuItem } from "@/types";
import { getAvailableMenuItems } from "@/data/menu";
import { simulateLatency } from "./utils";

/**
 * Searches available menu items by name, tags, and category.
 * Phase A: local substring matching only.
 * Phase B: will call app/api/ai-search/route.ts (Groq) with this same
 * signature, falling back to this local logic if the API fails.
 */
export async function searchMenuItems(query: string): Promise<MenuItem[]> {
  await simulateLatency(250, 600);

  const trimmed = query.trim().toLowerCase();
  if (!trimmed) return [];

  const available = getAvailableMenuItems();

  const scored = available
    .map((item) => {
      let score = 0;
      const name = item.name.toLowerCase();
      const desc = (item.description ?? "").toLowerCase();
      const tags = item.tags.join(" ").toLowerCase();

      if (name === trimmed) score += 100;
      else if (name.startsWith(trimmed)) score += 60;
      else if (name.includes(trimmed)) score += 40;

      if (tags.includes(trimmed)) score += 20;
      if (desc.includes(trimmed)) score += 10;

      // very light fuzzy tolerance: match on individual words
      const queryWords = trimmed.split(/\s+/);
      for (const w of queryWords) {
        if (w.length > 2 && name.includes(w)) score += 8;
      }

      return { item, score };
    })
    .filter((s) => s.score > 0)
    .sort((a, b) => b.score - a.score);

  return scored.map((s) => s.item);
}
