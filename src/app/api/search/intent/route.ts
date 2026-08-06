// src/app/api/search/intent/route.ts
import { NextRequest, NextResponse } from "next/server";

// ============================================================================
// Natural-language search intent — server-side only. GROQ_API_KEY is read
// here via process.env and never shipped to the client.
//
// IMPORTANT SCOPE: this route's ONLY job is to turn a conversational query
// ("I'm hungry, want something spicy") into a short list of plain keywords
// ("spicy", "momo", "chowmein") that we then run through our OWN local
// menu search (searchSuggestions / searchAllMatches in searchMenu.ts).
//
// Groq NEVER returns dish names, prices, or suggestions directly to the
// user — it only helps interpret intent. This is enforced structurally:
// the model's output is treated purely as search keywords fed back into
// the local menu index, so it is architecturally impossible for it to
// surface anything not already in menuItems.
// ============================================================================

export const runtime = "edge";

interface IntentResponse {
  keywords: string[];
}

export async function POST(req: NextRequest) {
  const apiKey = process.env.GROQ_API_KEY;

  let text = "";
  try {
    const body = await req.json();
    text = typeof body?.text === "string" ? body.text.trim() : "";
  } catch {
    return NextResponse.json({ keywords: [] } satisfies IntentResponse, {
      status: 400,
    });
  }

  if (!text) {
    return NextResponse.json({ keywords: [] } satisfies IntentResponse);
  }

  if (!apiKey) {
    // No key configured — fall back to naive keyword split so the feature
    // degrades gracefully instead of erroring the UI.
    return NextResponse.json({
      keywords: text
        .toLowerCase()
        .split(/[^a-z0-9]+/)
        .filter((w) => w.length > 2)
        .slice(0, 6),
    } satisfies IntentResponse);
  }

  try {
    const groqRes = await fetch(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: "llama-3.1-8b-instant",
          messages: [
            {
              role: "system",
              content:
                "You extract search keywords from a food-delivery user's natural-language craving or mood. " +
                "You do NOT know the menu and must NEVER invent dish names, restaurant names, prices, or brands. " +
                "Given the user's sentence, output ONLY a JSON array of 3-6 short lowercase keywords describing " +
                "what they might want (e.g. cuisine type, flavor profile like 'spicy' or 'light', meal category " +
                "like 'breakfast' or 'late-night', dietary need like 'vegetarian'). " +
                "Example input: 'I'm hungry and want something spicy' -> [\"spicy\",\"hot\",\"snack\"]. " +
                "Respond with ONLY the JSON array, nothing else.",
            },
            { role: "user", content: text },
          ],
          temperature: 0.3,
          max_tokens: 80,
        }),
      }
    );

    if (!groqRes.ok) {
      throw new Error(`Groq API error: ${groqRes.status}`);
    }

    const data = await groqRes.json();
    const raw = data?.choices?.[0]?.message?.content ?? "[]";

    let keywords: string[] = [];
    try {
      const cleaned = raw.replace(/```json|```/g, "").trim();
      keywords = JSON.parse(cleaned);
    } catch {
      keywords = [];
    }

    if (!Array.isArray(keywords)) keywords = [];

    return NextResponse.json({
      keywords: keywords
        .filter((k) => typeof k === "string")
        .map((k) => k.toLowerCase().trim())
        .filter(Boolean)
        .slice(0, 6),
    } satisfies IntentResponse);
  } catch (err) {
    console.error("[search/intent] Groq call failed:", err);
    return NextResponse.json({
      keywords: text
        .toLowerCase()
        .split(/[^a-z0-9]+/)
        .filter((w) => w.length > 2)
        .slice(0, 6),
    } satisfies IntentResponse);
  }
}
