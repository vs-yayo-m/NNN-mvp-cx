import { MenuItem } from "./types";
import { SITE } from "@/data/site-config";

export function formatPrice(value: number): string {
  return `${SITE.currency}${value.toLocaleString("en-IN")}`;
}

export function startingPrice(item: MenuItem): number {
  if (item.price != null) return item.price;
  if (item.variants && item.variants.length) {
    return Math.min(...item.variants.map((v) => v.price));
  }
  return 0;
}

export function genId(prefix: string): string {
  return `${prefix}_${Date.now().toString(36)}${Math.random().toString(36).slice(2, 7)}`;
}

export function slugSearch(items: MenuItem[], query: string): MenuItem[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  return items.filter(
    (it) =>
      it.name.toLowerCase().includes(q) ||
      it.category.toLowerCase().includes(q) ||
      (it.subcategory ?? "").toLowerCase().includes(q) ||
      (it.tags ?? []).some((t) => t.toLowerCase().includes(q))
  );
}

/** Lightweight rule-based "AI" recommendation engine for the prototype. */
export function recommendFor(all: MenuItem[], seed?: MenuItem, limit = 6): MenuItem[] {
  const available = all.filter((i) => i.isAvailable);
  if (!seed) {
    return [...available]
      .sort((a, b) => Number(b.isPopular) - Number(a.isPopular))
      .slice(0, limit);
  }
  return available
    .filter((i) => i.id !== seed.id)
    .map((i) => {
      let score = 0;
      if (i.category === seed.category) score += 3;
      if (i.section === seed.section) score += 1;
      if (i.isVeg === seed.isVeg) score += 1;
      if (i.isPopular) score += 1;
      return { i, score };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((x) => x.i);
}

import { Order, OrderStatus } from "./types";

/**
 * The MVP has no backend, so order status is simulated from elapsed time.
 * This keeps the tracking screen feeling alive for a demo without a real kitchen feed.
 */
export function simulatedStatus(order: Order): OrderStatus {
  const minutes = (Date.now() - new Date(order.createdAt).getTime()) / 60000;
  if (order.orderType === "pickup") {
    if (minutes < 1) return "placed";
    if (minutes < 3) return "confirmed";
    if (minutes < 12) return "preparing";
    return "ready_for_pickup";
  }
  if (minutes < 1) return "placed";
  if (minutes < 3) return "confirmed";
  if (minutes < 12) return "preparing";
  if (minutes < 25) return "out_for_delivery";
  return "completed";
}

export const STATUS_STEPS: { key: OrderStatus; label: string }[] = [
  { key: "placed", label: "Order placed" },
  { key: "confirmed", label: "Confirmed by kitchen" },
  { key: "preparing", label: "Preparing" },
  { key: "out_for_delivery", label: "Out for delivery" },
  { key: "completed", label: "Delivered" },
];

export const PICKUP_STATUS_STEPS: { key: OrderStatus; label: string }[] = [
  { key: "placed", label: "Order placed" },
  { key: "confirmed", label: "Confirmed by kitchen" },
  { key: "preparing", label: "Preparing" },
  { key: "ready_for_pickup", label: "Ready for pickup" },
];

export function timeAgo(iso: string): string {
  const diffMs = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diffMs / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins} min ago`;
  const hrs = Math.floor(mins / 60);
  return `${hrs} hr ago`;
}
