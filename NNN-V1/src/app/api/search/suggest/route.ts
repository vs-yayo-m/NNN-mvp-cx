// src/app/api/search/suggest/route.ts
import { NextRequest, NextResponse } from "next/server";

// ============================================================================
// AI search suggestions — server-side only. GROQ_API_KEY is read here via
// process.env and never shipped to the client. The Header's SearchBar calls
// this route over fetch("/api/search/suggest"); nothing in browser JS ever
// touches the key. Do not move this call into a client component.
// ============================================================================

export const runtime = "edge";

interface SuggestResponse {
  suggestions: string[];
}

const FALLBACK_SUGGESTIONS = [
  "Momo near me",
  "Chicken chowmein",
  "Late night food",
  "Vegetarian thali",
];

export async function POST(req: NextRequest) {
  const apiKey = process.env.GROQ_API_KEY;

  let query = "";
  try {
    const body = await req.json();
    query = typeof body?.query === "string" ? body.query.trim() : "";
  } catch {
    return NextResponse.json({ suggestions: [] } satisfies SuggestResponse, {
      status: 400,
    });
  }

  if (!query) {
    return NextResponse.json({ suggestions: [] } satisfies SuggestResponse);
  }

  if (!apiKey) {
    // No key configured — degrade gracefully instead of erroring the UI.
    return NextResponse.json({
      suggestions: FALLBACK_SUGGESTIONS.filter((s) =>
        s.toLowerCase().includes(query.toLowerCase())
      ).slice(0, 5),
    } satisfies SuggestResponse);
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
                "You are a food delivery search autocomplete for 'Nom Nom Now', a food ordering app in Butwal, Nepal. Given a partial user query, return 5 short, realistic search suggestions (dish names, cuisines, or restaurant-style queries). Respond ONLY with a JSON array of 5 strings, nothing else.",
            },
            { role: "user", content: query },
          ],
          temperature: 0.6,
          max_tokens: 150,
        }),
      }
    );

    if (!groqRes.ok) {
      throw new Error(`Groq API error: ${groqRes.status}`);
    }

    const data = await groqRes.json();
    const raw = data?.choices?.[0]?.message?.content ?? "[]";

    let suggestions: string[] = [];
    try {
      const cleaned = raw.replace(/```json|```/g, "").trim();
      suggestions = JSON.parse(cleaned);
    } catch {
      suggestions = [];
    }

    if (!Array.isArray(suggestions)) suggestions = [];

    return NextResponse.json({
      suggestions: suggestions.filter((s) => typeof s === "string").slice(0, 5),
    } satisfies SuggestResponse);
  } catch (err) {
    console.error("[search/suggest] Groq call failed:", err);
    return NextResponse.json({
      suggestions: FALLBACK_SUGGESTIONS.slice(0, 5),
    } satisfies SuggestResponse);
  }
}
