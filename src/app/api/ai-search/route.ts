// ============================================================================
// POST /api/ai-search — Groq-backed smart search. Understands intent/typos
// ("chiken biryani" -> biryani, chicken) and returns a ranked list of real
// menu item ids. Server-side only; the Groq API key never reaches the
// client. Always validates returned ids against the real menu dataset
// before responding — a hallucinated item can never reach the UI.
// ============================================================================

import { NextRequest, NextResponse } from "next/server";
import { callGroqJSON, GroqUnavailableError } from "@/lib/groqClient";
import { getCondensedCatalog, getValidMenuItemIds } from "@/lib/condensedCatalog";

export const runtime = "nodejs";

interface AiSearchResponseItem {
  id: string;
  reason?: string;
}

interface AiSearchResult {
  results: AiSearchResponseItem[];
}

export async function POST(request: NextRequest) {
  let query = "";
  try {
    const body = await request.json();
    query = typeof body?.query === "string" ? body.query.trim() : "";
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  if (!query) {
    return NextResponse.json({ ids: [], source: "empty" });
  }

  const catalog = getCondensedCatalog();
  const validIds = getValidMenuItemIds();

  const systemPrompt = `You are a search engine for a restaurant's menu. You will be given the customer's search query and a JSON catalog of currently available menu items (id, name, category, tags, veg flag).

Your job: return the ids of items that best match what the customer is looking for, ranked most-relevant first. Handle typos, partial words, synonyms, and cuisine-style descriptions (e.g. "chiken biryani" means chicken biryani; "something spicy" means items tagged spicy; "veg" means veg: true).

Rules:
- ONLY return ids that appear in the provided catalog. Never invent an id.
- Return at most 8 results.
- If nothing reasonably matches, return an empty results array.
- Respond ONLY with strict JSON in this exact shape, no other text: {"results": [{"id": "item-id", "reason": "short reason"}]}`;

  const userPrompt = `Catalog: ${JSON.stringify(catalog)}\n\nCustomer search query: "${query}"`;

  try {
    const result = await callGroqJSON<AiSearchResult>({
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      maxTokens: 500,
      temperature: 0.2,
    });

    const rawResults = Array.isArray(result?.results) ? result.results : [];
    // Validate every id against the real dataset — never trust the model.
    const validated = rawResults.filter((r) => r && typeof r.id === "string" && validIds.has(r.id));

    return NextResponse.json({
      ids: validated.map((r) => r.id),
      reasons: Object.fromEntries(validated.map((r) => [r.id, r.reason ?? ""])),
      source: "groq",
    });
  } catch (err) {
    // Required fallback per blueprint §8.3 — never let a Groq failure break
    // the app. The client is told the source so it can fall back to
    // lib/localSearch.ts if it prefers, but we also compute a basic local
    // fallback here so the API itself never returns an error to the client.
    const isGroqError = err instanceof GroqUnavailableError;
    console.error("ai-search: Groq call failed, falling back locally.", isGroqError ? err.message : err);

    const trimmed = query.toLowerCase();
    const fallbackIds = catalog
      .filter(
        (item) =>
          item.name.toLowerCase().includes(trimmed) ||
          item.tags.some((tag) => tag.toLowerCase().includes(trimmed))
      )
      .slice(0, 8)
      .map((item) => item.id);

    return NextResponse.json({
      ids: fallbackIds,
      reasons: {},
      source: "fallback",
    });
  }
}
