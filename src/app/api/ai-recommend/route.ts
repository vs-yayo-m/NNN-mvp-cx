// ============================================================================
// POST /api/ai-recommend — Groq-backed recommendations. Two modes:
//   - "profile": general recommendations based on cart/order-history
//     categories (home page "Recommended for You").
//   - "combo": complementary-item suggestions for what's currently in the
//     cart (cart page "Goes well with your order").
// Both modes return real menu item ids with a short one-line reason each,
// validated against the actual dataset before responding.
// ============================================================================

import { NextRequest, NextResponse } from "next/server";
import { callGroqJSON, GroqUnavailableError } from "@/lib/groqClient";
import { getCondensedCatalog, getValidMenuItemIds } from "@/lib/condensedCatalog";
import { recommendItemsLocal } from "@/lib/localRecommend";
import { getMenuItemById } from "@/data/menu";

export const runtime = "nodejs";

interface AiRecommendResponseItem {
  id: string;
  reason: string;
}

interface AiRecommendResult {
  results: AiRecommendResponseItem[];
}

interface RequestBody {
  mode?: "profile" | "combo";
  /** Item ids currently in the cart (combo mode) or from order history (profile mode). */
  itemIds?: string[];
  /** Category ids inferred from cart/history, used by profile mode. */
  categoryIds?: string[];
  limit?: number;
}

export async function POST(request: NextRequest) {
  let body: RequestBody = {};
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const mode = body.mode === "combo" ? "combo" : "profile";
  const itemIds = Array.isArray(body.itemIds) ? body.itemIds.filter((id) => typeof id === "string") : [];
  const categoryIds = Array.isArray(body.categoryIds) ? body.categoryIds.filter((id) => typeof id === "string") : [];
  const limit = typeof body.limit === "number" ? Math.min(Math.max(body.limit, 1), 6) : 4;

  const catalog = getCondensedCatalog();
  const validIds = getValidMenuItemIds();

  // Items to never re-suggest: whatever's already in the cart/history.
  const excludeIds = itemIds;

  let systemPrompt: string;
  let userPrompt: string;

  if (mode === "combo") {
    const cartItemNames = itemIds
      .map((id) => getMenuItemById(id)?.name)
      .filter((name): name is string => Boolean(name));

    systemPrompt = `You are a restaurant ordering assistant suggesting complementary add-ons for a customer's cart, like a good server would ("would you like a drink with that?").

You will be given the customer's current cart items and a JSON catalog of currently available menu items (id, name, category, tags, veg flag).

Your job: suggest items from the catalog that pair well with what's already in the cart — think classic pairings (a drink with momo, a side with a main, a dessert or bar item to round out the order). Do not suggest items already in the cart.

Rules:
- ONLY return ids that appear in the provided catalog. Never invent an id.
- Never suggest an item whose id is in the cart already.
- Return at most ${limit} results.
- Each reason must be a short, specific phrase (under 8 words), e.g. "Pairs well with your Chicken Momo" or "A cold drink to go with spicy food".
- Respond ONLY with strict JSON in this exact shape, no other text: {"results": [{"id": "item-id", "reason": "short reason"}]}`;

    userPrompt = `Catalog: ${JSON.stringify(catalog)}\n\nCurrent cart items: ${JSON.stringify(cartItemNames)}\nCart item ids to exclude from suggestions: ${JSON.stringify(itemIds)}`;
  } else {
    systemPrompt = `You are a restaurant recommendation engine. You will be given a JSON catalog of currently available menu items (id, name, category, tags, veg flag) and, if available, the customer's preferred categories based on past orders.

Your job: suggest items from the catalog the customer is likely to enjoy. If preferred categories are given, weight suggestions toward those categories and complementary items. If no history is given, suggest a well-rounded set of popular/appealing items across categories.

Rules:
- ONLY return ids that appear in the provided catalog. Never invent an id.
- Return at most ${limit} results.
- Each reason must be a short, specific phrase (under 8 words).
- Respond ONLY with strict JSON in this exact shape, no other text: {"results": [{"id": "item-id", "reason": "short reason"}]}`;

    userPrompt = `Catalog: ${JSON.stringify(catalog)}\n\nCustomer's preferred categories (from order history, may be empty): ${JSON.stringify(categoryIds)}\nExclude these ids (already ordered recently): ${JSON.stringify(excludeIds)}`;
  }

  try {
    const result = await callGroqJSON<AiRecommendResult>({
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      maxTokens: 500,
      temperature: 0.4,
    });

    const rawResults = Array.isArray(result?.results) ? result.results : [];
    const validated = rawResults
      .filter((r) => r && typeof r.id === "string" && validIds.has(r.id) && !excludeIds.includes(r.id))
      .slice(0, limit);

    if (validated.length === 0) {
      throw new GroqUnavailableError("Groq returned no valid recommendations");
    }

    return NextResponse.json({
      results: validated.map((r) => ({ id: r.id, reason: r.reason || "Recommended for you" })),
      source: "groq",
    });
  } catch (err) {
    const isGroqError = err instanceof GroqUnavailableError;
    console.error("ai-recommend: Groq call failed, falling back locally.", isGroqError ? err.message : err);

    const fallback = recommendItemsLocal(categoryIds, excludeIds, limit);
    return NextResponse.json({
      results: fallback.map((r) => ({ id: r.item.id, reason: r.reason })),
      source: "fallback",
    });
  }
}
