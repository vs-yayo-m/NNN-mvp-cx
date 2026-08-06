// ============================================================================
// search.ts — the single entry point components should call for search.
// Calls the Groq-backed /api/ai-search route; if that fails or is
// unreachable, falls back to lib/localSearch.ts so the UI never breaks.
// This is the function SearchBar.tsx and the /search page call — neither
// needs to know whether the result came from Groq or the local fallback.
// ============================================================================

import type { MenuItem } from "@/types";
import { getMenuItemById } from "@/data/menu";
import { searchMenuItemsLocal } from "./localSearch";

export interface SearchResult {
  items: MenuItem[];
  reasons: Record<string, string>;
  /** Which path produced these results — useful for subtle UI messaging, not required. */
  source: "groq" | "fallback" | "local" | "empty";
}

export async function searchMenuItems(query: string): Promise<SearchResult> {
  const trimmed = query.trim();
  if (!trimmed) return { items: [], reasons: {}, source: "empty" };

  try {
    const response = await fetch("/api/ai-search", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query: trimmed }),
      signal: AbortSignal.timeout(7000),
    });

    if (!response.ok) throw new Error(`ai-search route returned ${response.status}`);

    const data: { ids: string[]; reasons: Record<string, string>; source: string } = await response.json();
    const items = data.ids.map((id) => getMenuItemById(id)).filter((item): item is MenuItem => Boolean(item));

    // The API route itself already falls back locally on Groq failure, so
    // this should rarely be empty unless the query truly had no matches —
    // but if the network call itself failed, we still fall back here too.
    return { items, reasons: data.reasons ?? {}, source: data.source === "groq" ? "groq" : "fallback" };
  } catch (err) {
    console.error("searchMenuItems: request to /api/ai-search failed, using local fallback.", err);
    const items = searchMenuItemsLocal(trimmed);
    return { items, reasons: {}, source: "local" };
  }
}
