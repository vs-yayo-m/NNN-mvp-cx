// ============================================================================
// recommend.ts — the single entry point components should call for
// recommendations (both "Recommended for You" and cart combo suggestions).
// Calls the Groq-backed /api/ai-recommend route; falls back to
// lib/localRecommend.ts if that fails or is unreachable.
// ============================================================================

import type { MenuItem } from "@/types";
import { getMenuItemById } from "@/data/menu";
import { recommendItemsLocal } from "./localRecommend";

export interface RecommendationResult {
  item: MenuItem;
  reason: string;
}

interface RecommendParams {
  mode: "profile" | "combo";
  itemIds?: string[];
  categoryIds?: string[];
  limit?: number;
}

export async function getRecommendations(params: RecommendParams): Promise<{
  results: RecommendationResult[];
  source: "groq" | "fallback" | "local";
}> {
  const { mode, itemIds = [], categoryIds = [], limit = 4 } = params;

  try {
    const response = await fetch("/api/ai-recommend", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ mode, itemIds, categoryIds, limit }),
      signal: AbortSignal.timeout(7000),
    });

    if (!response.ok) throw new Error(`ai-recommend route returned ${response.status}`);

    const data: { results: { id: string; reason: string }[]; source: string } = await response.json();
    const results = data.results
      .map((r) => {
        const item = getMenuItemById(r.id);
        return item ? { item, reason: r.reason } : null;
      })
      .filter((r): r is RecommendationResult => Boolean(r));

    return { results, source: data.source === "groq" ? "groq" : "fallback" };
  } catch (err) {
    console.error("getRecommendations: request to /api/ai-recommend failed, using local fallback.", err);
    const local = recommendItemsLocal(categoryIds, itemIds, limit);
    return { results: local, source: "local" };
  }
}
