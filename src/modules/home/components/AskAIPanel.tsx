"use client";

// ============================================================================
// AskAIPanel — "Not sure what to eat?" entry point on the home screen.
// Opens a lightweight panel where the customer types a mood/craving; Groq
// (via /api/ai-search, which already understands free-text intent) returns
// matching items rendered as tappable cards that add straight to cart.
// ============================================================================

import { useState } from "react";
import { Sparkles, Loader2, Plus, Check, X } from "lucide-react";
import type { MenuItem } from "@/types";
import { searchMenuItems } from "@/lib/search";
import { useCart } from "@/lib/cartStore";
import MenuImage from "@/modules/menu/components/MenuImage";
import { formatCurrency } from "@/lib/utils";

const SUGGESTION_CHIPS = ["Something spicy and quick", "Light and healthy", "Good for sharing", "Comfort food"];

export default function AskAIPanel() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<{ item: MenuItem; reason: string }[]>([]);
  const [searched, setSearched] = useState(false);
  const { addItem } = useCart();
  const [addedIds, setAddedIds] = useState<Set<string>>(new Set());

  async function runSearch(q: string) {
    setQuery(q);
    setLoading(true);
    setSearched(true);
    const result = await searchMenuItems(q);
    setResults(result.items.slice(0, 5).map((item) => ({ item, reason: result.reasons[item.id] ?? "" })));
    setLoading(false);
  }

  function handleQuickAdd(item: MenuItem) {
    const variant = item.variants[0];
    addItem({
      menuItemId: item.id,
      name: item.name,
      image: item.image,
      variantLabel: variant.label,
      unitPrice: variant.price,
      quantity: 1,
    });
    setAddedIds((prev) => new Set(prev).add(item.id));
  }

  function handleClose() {
    setOpen(false);
    setQuery("");
    setResults([]);
    setSearched(false);
  }

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="w-full flex items-center gap-3 rounded-xl2 border border-gold-200 bg-gold-50 px-5 py-4 text-left hover:border-gold-400 transition-colors"
      >
        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-gold-400 text-ink-900 shrink-0">
          <Sparkles className="h-5 w-5" strokeWidth={2} aria-hidden />
        </span>
        <div>
          <p className="font-display text-base font-semibold text-ink-900">Not sure what to eat?</p>
          <p className="text-sm text-ink-600">Tell us your craving and we&apos;ll find something for you.</p>
        </div>
      </button>
    );
  }

  return (
    <div className="rounded-xl2 border border-gold-200 bg-gold-50 p-5 flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-gold-400" strokeWidth={2} aria-hidden />
          <h3 className="font-display text-base font-semibold text-ink-900">What are you craving?</h3>
        </div>
        <button
          type="button"
          onClick={handleClose}
          className="flex h-7 w-7 items-center justify-center rounded-full text-ink-600 hover:bg-gold-200/60"
          aria-label="Close"
        >
          <X className="h-4 w-4" strokeWidth={2} aria-hidden />
        </button>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (query.trim()) runSearch(query);
        }}
        className="flex items-center gap-2"
      >
        <input
          autoFocus
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="e.g. something spicy and quick"
          className="flex-1 rounded-full border border-ink-100 bg-cream-100 px-4 py-2.5 text-sm outline-none focus:border-brand-400 transition-colors"
        />
        <button
          type="submit"
          disabled={!query.trim() || loading}
          className="rounded-full bg-ink-900 px-4 py-2.5 text-sm font-semibold text-cream-100 hover:bg-ink-800 disabled:opacity-40 transition-colors shrink-0"
        >
          Ask
        </button>
      </form>

      {!searched && (
        <div className="flex flex-wrap gap-2">
          {SUGGESTION_CHIPS.map((chip) => (
            <button
              key={chip}
              type="button"
              onClick={() => runSearch(chip)}
              className="rounded-full border border-gold-200 bg-cream-100 px-3 py-1.5 text-xs font-medium text-ink-700 hover:border-gold-400 transition-colors"
            >
              {chip}
            </button>
          ))}
        </div>
      )}

      {loading && (
        <div className="flex items-center gap-2 py-2 text-sm text-ink-500">
          <Loader2 className="h-4 w-4 animate-spin text-brand-500" strokeWidth={2} aria-hidden />
          Thinking…
        </div>
      )}

      {!loading && searched && results.length === 0 && (
        <p className="text-sm text-ink-500 py-1">
          Couldn&apos;t find a good match — try describing it differently.
        </p>
      )}

      {!loading && results.length > 0 && (
        <div className="flex flex-col gap-2">
          {results.map(({ item, reason }) => {
            const isAdded = addedIds.has(item.id);
            const variant = item.variants[0];
            return (
              <div
                key={item.id}
                className="flex items-center gap-3 rounded-xl2 border border-ink-100 bg-cream-100 p-2.5"
              >
                <div className="relative h-12 w-12 shrink-0 rounded-lg overflow-hidden">
                  <MenuImage src={item.image} alt={item.name} sizes="48px" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-ink-900 truncate">{item.name}</p>
                  {reason && <p className="text-xs text-ink-400 italic truncate">{reason}</p>}
                </div>
                <span className="text-sm font-semibold text-ink-800 shrink-0">
                  {formatCurrency(variant.price)}
                </span>
                <button
                  type="button"
                  onClick={() => handleQuickAdd(item)}
                  disabled={isAdded}
                  className={`flex h-8 w-8 items-center justify-center rounded-full shrink-0 transition-colors ${
                    isAdded ? "bg-green-600 text-cream-100" : "bg-brand-500 text-cream-100 hover:bg-brand-600"
                  }`}
                  aria-label={`Add ${item.name} to cart`}
                >
                  {isAdded ? (
                    <Check className="h-4 w-4" strokeWidth={2.5} aria-hidden />
                  ) : (
                    <Plus className="h-4 w-4" strokeWidth={2.5} aria-hidden />
                  )}
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
