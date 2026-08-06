// src/modules/search/components/CravingSearch.tsx
"use client";

// ============================================================================
// CravingSearch — the "Not sure what to eat? Tell us your craving" card.
// This is the ONLY place natural-language input goes to Groq. It sends the
// user's free text to /api/search/intent, which returns plain keywords
// (never dish names). Those keywords are then run through the same local
// searchAllMatches() used everywhere else, so results are always menu items
// we actually sell — Groq is interpretation only, not a suggestion source.
// ============================================================================

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Sparkles, Loader2, ArrowRight } from "lucide-react";

export default function CravingSearch() {
  const router = useRouter();
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const submit = async () => {
    const trimmed = text.trim();
    if (!trimmed || loading) return;
    setLoading(true);
    try {
      const res = await fetch("/api/search/intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: trimmed }),
      });
      const data = await res.json();
      const keywords: string[] = Array.isArray(data?.keywords) ? data.keywords : [];
      // Feed the extracted keywords into the same local search the rest of
      // the app uses — /search renders results from our own menu only.
      const q = keywords.length > 0 ? keywords.join(" ") : trimmed;
      router.push(`/search?q=${encodeURIComponent(q)}`);
    } catch {
      // Degrade gracefully: just search the raw text locally.
      router.push(`/search?q=${encodeURIComponent(trimmed)}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-2xl border border-gold-200 bg-gold-50 p-4 transition-all duration-300">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center gap-3 text-left"
      >
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gold-400 shadow-[0_0_14px_rgba(232,169,59,0.5)]">
          <Sparkles className="h-4 w-4 text-ink-900" strokeWidth={2} aria-hidden />
        </span>
        <span className="flex-1 min-w-0">
          <span className="block font-display text-base font-semibold text-ink-900">
            Not sure what to eat?
          </span>
          <span className="block text-sm text-ink-500">
            Tell us your craving and we&apos;ll find something for you.
          </span>
        </span>
      </button>

      <div
        className={`grid transition-all duration-300 ease-out ${
          open ? "grid-rows-[1fr] opacity-100 mt-3" : "grid-rows-[0fr] opacity-0"
        }`}
      >
        <div className="overflow-hidden">
          <div className="flex items-center gap-2 rounded-full border border-gold-200 bg-white px-3 py-2">
            <input
              type="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && submit()}
              placeholder="e.g. I'm hungry, want something spicy..."
              className="flex-1 min-w-0 bg-transparent text-sm text-ink-900 placeholder-ink-400 outline-none"
              disabled={loading}
            />
            <button
              type="button"
              onClick={submit}
              disabled={loading || !text.trim()}
              aria-label="Find food for my craving"
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-500 text-white transition-transform duration-200 enabled:hover:scale-105 disabled:opacity-40"
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
              ) : (
                <ArrowRight className="h-4 w-4" strokeWidth={2.25} aria-hidden />
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
