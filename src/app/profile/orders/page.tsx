"use client";

// ============================================================================
// Order History — full list of past orders, per blueprint §3.3.
// Tapping an order goes to its read-only detail view (app/order/[orderId])
// which has the Reorder button.
// ============================================================================

import Link from "next/link";
import { ChevronLeft, Receipt, ChevronRight } from "lucide-react";
import { useAuth } from "@/lib/authStore";
import { useOrders } from "@/lib/orderStore";
import { formatCurrency } from "@/lib/utils";

export default function OrderHistoryPage() {
  const { state: authState } = useAuth();
  const { orders } = useOrders();

  if (!authState.isLoggedIn) {
    return (
      <div className="mx-auto max-w-sm px-4 py-16 text-center flex flex-col items-center gap-4">
        <Receipt className="h-10 w-10 text-ink-300" strokeWidth={1.5} aria-hidden />
        <p className="font-display text-lg font-semibold text-ink-800">You&apos;re not logged in</p>
        <Link href="/login" className="mt-2 rounded-full bg-brand-500 px-5 py-2.5 text-sm font-semibold text-cream-100">
          Log In
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-6 flex flex-col gap-5">
      <Link href="/profile" className="flex items-center gap-1 text-sm text-ink-500 hover:text-ink-800 w-fit">
        <ChevronLeft className="h-4 w-4" strokeWidth={2} aria-hidden />
        Profile
      </Link>

      <h1 className="font-display text-2xl font-semibold text-ink-900">Order History</h1>

      {orders.length === 0 ? (
        <div className="rounded-xl2 border border-ink-100 bg-cream-100 p-8 text-center flex flex-col items-center gap-2">
          <Receipt className="h-9 w-9 text-ink-300" strokeWidth={1.5} aria-hidden />
          <p className="text-sm text-ink-400">No orders yet — your history will show up here.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {orders.map((order) => (
            <Link
              key={order.id}
              href={`/order/${order.id}`}
              className="flex items-center gap-3 rounded-xl2 border border-ink-100 bg-cream-100 px-4 py-3.5 hover:border-brand-300 transition-colors"
            >
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-ink-900">{order.id}</p>
                <p className="text-xs text-ink-400 mt-0.5">
                  {new Date(order.createdAt).toLocaleDateString("en-US", { dateStyle: "medium" })} ·{" "}
                  {order.lines.length} item{order.lines.length === 1 ? "" : "s"} ·{" "}
                  <span className="capitalize">{order.status.replace(/_/g, " ")}</span>
                </p>
              </div>
              <span className="text-sm font-semibold text-ink-800 shrink-0">{formatCurrency(order.total)}</span>
              <ChevronRight className="h-4 w-4 text-ink-300 shrink-0" strokeWidth={2} aria-hidden />
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
