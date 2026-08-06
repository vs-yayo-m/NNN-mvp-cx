"use client";

// ============================================================================
// CartComboSuggestions — "Goes well with your order" panel shown in the
// cart. Uses the Groq-backed /api/ai-recommend route in "combo" mode to
// suggest complementary items based on what's currently in the cart (e.g.
// suggest a drink alongside Momo, or a side alongside a main), with a
// deterministic popularity-based fallback if Groq is unavailable. This is
// the AI-powered cart combo suggestion feature.
// ============================================================================

import { useEffect, useState } from "react";
import { Sparkles, Plus, Loader2 } from "lucide-react";
import { getRecommendations, type RecommendationResult } from "@/lib/recommend";
import { useCart } from "@/lib/cartStore";
import MenuImage from "@/modules/menu/components/MenuImage";
import { formatCurrency } from "@/lib/utils";

export default function CartComboSuggestions() {
  const { state, addItem } = useCart();
  const [suggestions, setSuggestions] = useState<RecommendationResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [addedIds, setAddedIds] = useState<Set<string>>(new Set());

  // Re-fetch whenever the set of distinct items in the cart changes (not on
  // every quantity tick, to avoid refetching on every +/- tap).
  const itemIdsKey = [...new Set(state.lines.map((l) => l.menuItemId))].sort().join(",");

  useEffect(() => {
    if (state.lines.length === 0) {
      setSuggestions([]);
      setLoading(false);
      return;
    }

    let cancelled = false;
    setLoading(true);

    const itemIds = [...new Set(state.lines.map((l) => l.menuItemId))];
    getRecommendations({ mode: "combo", itemIds, limit: 4 }).then((result) => {
      if (cancelled) return;
      setSuggestions(result.results);
      setLoading(false);
    });

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [itemIdsKey, state.lines.length]);

  function handleQuickAdd(suggestion: RecommendationResult) {
    const variant = suggestion.item.variants[0];
    addItem({
      menuItemId: suggestion.item.id,
      name: suggestion.item.name,
      image: suggestion.item.image,
      variantLabel: variant.label,
      unitPrice: variant.price,
      quantity: 1,
    });
    setAddedIds((prev) => new Set(prev).add(suggestion.item.id));
  }

  if (state.lines.length === 0) return null;
  if (!loading && suggestions.length === 0) return null;

  return (
    <div className="mt-6 mx-4 sm:mx-0 rounded-xl2 border border-ink-100 bg-cream-100 p-4">
      <div className="flex items-center gap-1.5 mb-3">
        <Sparkles className="h-4 w-4 text-gold-400" strokeWidth={2} aria-hidden />
        <h3 className="text-sm font-semibold text-ink-800">Goes well with your order</h3>
      </div>

      {loading ? (
        <div className="flex items-center gap-2 py-2 text-sm text-ink-400">
          <Loader2 className="h-4 w-4 animate-spin text-brand-500" strokeWidth={2} aria-hidden />
          Finding pairings…
        </div>
      ) : (
        <div className="flex gap-3 overflow-x-auto no-scrollbar -mx-1 px-1 pb-1">
          {suggestions.map((suggestion) => {
            const isAdded = addedIds.has(suggestion.item.id);
            const variant = suggestion.item.variants[0];
            return (
              <div
                key={suggestion.item.id}
                className="flex shrink-0 w-36 flex-col gap-1.5 rounded-xl2 border border-ink-100 bg-cream-100 p-2.5"
              >
                <div className="relative w-full aspect-square rounded-lg overflow-hidden">
                  <MenuImage src={suggestion.item.image} alt={suggestion.item.name} sizes="144px" />
                </div>
                <p className="text-xs font-semibold text-ink-900 leading-snug line-clamp-1">
                  {suggestion.item.name}
                </p>
                <p className="text-[11px] text-ink-400 italic leading-snug line-clamp-2">
                  {suggestion.reason}
                </p>
                <div className="flex items-center justify-between mt-auto pt-1">
                  <span className="text-xs font-semibold text-ink-800">
                    {formatCurrency(variant.price)}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleQuickAdd(suggestion)}
                    disabled={isAdded}
                    className={`flex h-6 w-6 items-center justify-center rounded-full transition-colors ${
                      isAdded ? "bg-green-600 text-cream-100" : "bg-brand-500 text-cream-100 hover:bg-brand-600"
                    }`}
                    aria-label={`Add ${suggestion.item.name} to cart`}
                  >
                    <Plus className="h-3.5 w-3.5" strokeWidth={2.5} aria-hidden />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
