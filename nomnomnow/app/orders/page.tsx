"use client";

import Link from "next/link";
import { useApp } from "@/context/AppContext";
import { formatPrice, simulatedStatus, timeAgo } from "@/lib/utils";
import EmptyState from "@/components/EmptyState";

export default function OrdersPage() {
  const { orders, hydrated } = useApp();

  if (!hydrated) return null;

  if (orders.length === 0) {
    return (
      <EmptyState
        title="No orders yet"
        message="Orders you place on this device will show up here so you can track them."
        ctaLabel="Browse the menu"
        ctaHref="/menu"
      />
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-4">
      <h1 className="mb-4 font-display text-2xl font-bold text-cream">Your orders</h1>
      <div className="space-y-3">
        {orders.map((order) => {
          const status = simulatedStatus(order);
          return (
            <Link
              key={order.id}
              href={`/orders/${order.id}`}
              className="tap-scale focus-ring block rounded-xl2 border border-line bg-surface p-4"
            >
              <div className="flex items-center justify-between">
                <p className="font-mono text-sm font-semibold text-cream">{order.id.toUpperCase()}</p>
                <span className="rounded-full border border-turmeric px-2.5 py-0.5 font-mono text-[10px] font-semibold uppercase text-turmeric">
                  {status.replace(/_/g, " ")}
                </span>
              </div>
              <p className="mt-1 text-xs text-muted">
                {order.lines.length} item{order.lines.length > 1 ? "s" : ""} \u00b7 {formatPrice(order.total)} \u00b7 {timeAgo(order.createdAt)}
              </p>
              {order.isRecurring && <p className="mt-1 text-[11px] text-turmeric">Repeats daily at {order.recurringTime}</p>}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
