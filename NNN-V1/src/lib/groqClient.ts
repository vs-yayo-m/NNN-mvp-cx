// ============================================================================
// groqClient.ts — server-only wrapper around Groq's chat completions API.
// NEVER import this into a "use client" file; the API key must never reach
// the browser. Both AI route handlers import this module.
//
// Model: openai/gpt-oss-20b. Chosen over the older llama-3.1-8b-instant /
// llama-3.3-70b-versatile because Groq deprecated those Llama chat models
// (announced June 17, 2026, shutdown August 16, 2026) — building on them
// today would mean this feature breaks within days of going live. gpt-oss-20b
// is Groq's official recommended replacement: free tier, native JSON Object
// Mode, and 1000+ tokens/sec inference, which keeps AI search feeling
// instant rather than like a network round trip.
// ============================================================================

const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";
const GROQ_MODEL = "openai/gpt-oss-20b";

interface GroqMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

interface GroqCallOptions {
  messages: GroqMessage[];
  /** Max tokens in the completion. Keep small — we only ever want compact JSON back. */
  maxTokens?: number;
  temperature?: number;
  /** Abort the call after this many ms so a hung request can't hang the UI. */
  timeoutMs?: number;
}

export class GroqUnavailableError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "GroqUnavailableError";
  }
}

/**
 * Calls Groq's chat completions endpoint in JSON Object Mode and returns the
 * parsed JSON. Throws GroqUnavailableError on any failure (missing key,
 * network error, timeout, non-2xx response, or invalid JSON) so callers can
 * catch a single error type and fall back to local logic — the fallback
 * path is not optional, see lib/search.ts and lib/recommend.ts.
 */
export async function callGroqJSON<T = unknown>(options: GroqCallOptions): Promise<T> {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    throw new GroqUnavailableError("GROQ_API_KEY is not set");
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), options.timeoutMs ?? 6000);

  try {
    const response = await fetch(GROQ_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: GROQ_MODEL,
        messages: options.messages,
        max_completion_tokens: options.maxTokens ?? 700,
        temperature: options.temperature ?? 0.3,
        response_format: { type: "json_object" },
      }),
      signal: controller.signal,
    });

    if (!response.ok) {
      const errorBody = await response.text().catch(() => "");
      throw new GroqUnavailableError(`Groq API returned ${response.status}: ${errorBody.slice(0, 200)}`);
    }

    const data = await response.json();
    const content: string | undefined = data?.choices?.[0]?.message?.content;
    if (!content) {
      throw new GroqUnavailableError("Groq response had no message content");
    }

    try {
      return JSON.parse(content) as T;
    } catch {
      throw new GroqUnavailableError("Groq response content was not valid JSON");
    }
  } catch (err) {
    if (err instanceof GroqUnavailableError) throw err;
    if (err instanceof Error && err.name === "AbortError") {
      throw new GroqUnavailableError("Groq API call timed out");
    }
    throw new GroqUnavailableError(`Groq API call failed: ${err instanceof Error ? err.message : String(err)}`);
  } finally {
    clearTimeout(timeout);
  }
}
