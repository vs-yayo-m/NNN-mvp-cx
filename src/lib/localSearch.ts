// ============================================================================
// localSearch.ts — deterministic local substring/fuzzy matching. This is the
// FALLBACK path used by lib/search.ts when the Groq-backed /api/ai-search
// route fails, times out, or GROQ_API_KEY is missing. It's also what Phase A
// used directly before AI search was wired in. Exported function name is
// kept distinct (searchMenuItemsLocal) from the AI-backed searchMenuItems in
// lib/search.ts so it's always obvious which path is being called.
// ============================================================================

import type { MenuItem } from "@/types";
import { getAvailableMenuItems } from "@/data/menu";

/**
 * Local substring/fuzzy match over available menu items by name, tags, and
 * category. Used as the fallback when Groq is unavailable — see
 * lib/search.ts for the AI-backed entry point that callers should use.
 */
export function searchMenuItemsLocal(query: string): MenuItem[] {
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
