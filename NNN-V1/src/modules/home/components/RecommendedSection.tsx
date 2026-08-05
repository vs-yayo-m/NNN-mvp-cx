"use client";

// ============================================================================
// RecommendedSection — "Recommended for You". Generic/popularity-based when
// logged out; genuinely personalized off order-history categories once
// logged in, via the Groq-backed /api/ai-recommend route in "profile" mode.
// ============================================================================

import { useEffect, useMemo, useState } from "react";
import { Sparkles } from "lucide-react";
import { useAuth } from "@/lib/authStore";
import { useOrders } from "@/lib/orderStore";
import { getRecommendations, type RecommendationResult } from "@/lib/recommend";
import { getMenuItemById } from "@/data/menu";
import MenuItemCard from "@/modules/menu/components/MenuItemCard";

export default function RecommendedSection() {
  const { state: authState } = useAuth();
  const { orders } = useOrders();
  const [recommendations, setRecommendations] = useState<RecommendationResult[]>([]);
  const [loading, setLoading] = useState(true);

  // Derive the customer's most-ordered categories from their order history —
  // this is what makes the recommendation genuinely personalized rather than
  // just "popular items" once someone has ordered before.
  const categoryIds = useMemo(() => {
    if (!authState.isLoggedIn || orders.length === 0) return [];
    const counts = new Map<string, number>();
    for (const order of orders) {
      for (const line of order.lines) {
        const item = getMenuItemById(line.menuItemId);
        if (!item) continue;
        counts.set(item.categoryId, (counts.get(item.categoryId) ?? 0) + line.quantity);
      }
    }
    return [...counts.entries()].sort((a, b) => b[1] - a[1]).map(([categoryId]) => categoryId);
  }, [authState.isLoggedIn, orders]);

  const recentlyOrderedIds = useMemo(() => {
    if (orders.length === 0) return [];
    return orders[0].lines.map((l) => l.menuItemId);
  }, [orders]);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    getRecommendations({ mode: "profile", categoryIds, itemIds: recentlyOrderedIds, limit: 4 }).then((result) => {
      if (cancelled) return;
      setRecommendations(result.results);
      setLoading(false);
    });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [categoryIds.join(","), recentlyOrderedIds.join(",")]);

  if (!loading && recommendations.length === 0) return null;

  return (
    <section>
      <div className="flex items-center gap-1.5 mb-3">
        <Sparkles className="h-4 w-4 text-gold-400" strokeWidth={2} aria-hidden />
        <h2 className="font-display text-lg font-semibold text-ink-900">Recommended for You</h2>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="aspect-square rounded-xl2 bg-ink-100 animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          {recommendations.map((rec) => (
            <div key={rec.item.id} className="flex flex-col gap-1.5">
              <MenuItemCard item={rec.item} />
              <p className="px-1 text-[11px] text-ink-400 italic line-clamp-1">{rec.reason}</p>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
