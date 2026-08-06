"use client";

// ============================================================================
// Order Tracking + Order Detail — one screen, mode determined by status.
// Active orders (not yet "completed") show the live, auto-advancing
// OrderStatusStepper (polls computeSimulatedStatus every few seconds).
// Completed orders render the same component in its finished state, with
// a Reorder CTA below.
// ============================================================================

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { SearchX, RotateCcw, Loader2, Repeat, Check } from "lucide-react";
import { useOrders } from "@/lib/orderStore";
import { useCart } from "@/lib/cartStore";
import { formatCurrency } from "@/lib/utils";
import OrderStatusStepper from "@/modules/order-tracking/components/OrderStatusStepper";
import RecurringOrderForm from "@/modules/recurring-orders/components/RecurringOrderForm";

export default function OrderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const orderId = params.orderId as string;
  const { getOrderById, refreshOrderStatus } = useOrders();
  const { addItem, clearCart } = useCart();
  const [reordering, setReordering] = useState(false);
  const [recurringFormOpen, setRecurringFormOpen] = useState(false);
  const [recurringSaved, setRecurringSaved] = useState(false);

  const order = getOrderById(orderId);

  // Poll for status updates every 2s while the order isn't finished yet —
  // this is what makes the tracking screen visibly "move" in a live demo.
  useEffect(() => {
    if (!order || order.status === "completed") return;
    const interval = setInterval(() => refreshOrderStatus(orderId), 2000);
    return () => clearInterval(interval);
  }, [order, orderId, refreshOrderStatus]);

  if (!order) {
    return (
      <div className="mx-auto max-w-md px-4 py-16 text-center flex flex-col items-center gap-3">
        <SearchX className="h-9 w-9 text-ink-300" strokeWidth={1.5} aria-hidden />
        <p className="font-display text-lg font-semibold text-ink-800">Order not found</p>
        <Link href="/menu" className="mt-2 text-brand-500 font-semibold text-sm">
          Back to Menu
        </Link>
      </div>
    );
  }

  function handleReorder() {
    setReordering(true);
    clearCart();
    for (const line of order!.lines) {
      addItem({
        menuItemId: line.menuItemId,
        name: line.name,
        image: line.image,
        variantLabel: line.variantLabel,
        unitPrice: line.unitPrice,
        quantity: line.quantity,
      });
    }
    setTimeout(() => router.push("/cart"), 400);
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-6 flex flex-col gap-6">
      <div>
        <h1 className="font-display text-2xl font-semibold text-ink-900">Order {order.id}</h1>
        <p className="text-sm text-ink-400 mt-1">
          Placed {new Date(order.createdAt).toLocaleString("en-US", { dateStyle: "medium", timeStyle: "short" })}
        </p>
      </div>

      <OrderStatusStepper order={order} />

      {/* Order details */}
      <div className="rounded-xl2 border border-ink-100 bg-cream-100 p-4 flex flex-col gap-3">
        <h2 className="text-sm font-semibold text-ink-800">Items</h2>
        <div className="flex flex-col gap-2">
          {order.lines.map((line, idx) => (
            <div key={idx} className="flex justify-between text-sm text-ink-600">
              <span>
                {line.quantity}× {line.name} ({line.variantLabel})
              </span>
              <span>{formatCurrency(line.unitPrice * line.quantity)}</span>
            </div>
          ))}
        </div>
        <div className="border-t border-ink-100 pt-3 flex flex-col gap-1">
          <div className="flex justify-between text-sm text-ink-600">
            <span>Subtotal</span>
            <span>{formatCurrency(order.subtotal)}</span>
          </div>
          {order.orderType === "delivery" && (
            <div className="flex justify-between text-sm text-ink-600">
              <span>Delivery Fee</span>
              <span>{order.deliveryFee === 0 ? "Free" : formatCurrency(order.deliveryFee)}</span>
            </div>
          )}
          {order.promoDiscount > 0 && (
            <div className="flex justify-between text-sm text-green-700">
              <span>Promo ({order.promoCode})</span>
              <span>−{formatCurrency(order.promoDiscount)}</span>
            </div>
          )}
          <div className="flex justify-between font-semibold text-ink-900 pt-1">
            <span>Total</span>
            <span>{formatCurrency(order.total)}</span>
          </div>
        </div>
      </div>

      <div className="rounded-xl2 border border-ink-100 bg-cream-100 p-4 flex flex-col gap-1.5">
        <h2 className="text-sm font-semibold text-ink-800">
          {order.orderType === "pickup" ? "Pickup" : "Delivery"} Details
        </h2>
        <p className="text-sm text-ink-600">{order.details.name} · {order.details.phone}</p>
        <p className="text-sm text-ink-600">{order.details.address}</p>
        {order.details.landmark && <p className="text-sm text-ink-400">{order.details.landmark}</p>}
        <p className="text-sm text-ink-400 capitalize">
          Payment: {order.paymentMethod === "cod" ? "Cash on Delivery" : order.paymentMethod}
        </p>
      </div>

      <button
        type="button"
        onClick={handleReorder}
        disabled={reordering}
        className="flex items-center justify-center gap-2 rounded-full bg-brand-500 px-5 py-3.5 font-semibold text-cream-100 hover:bg-brand-600 disabled:opacity-60 transition-colors"
      >
        {reordering ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" strokeWidth={2} aria-hidden />
            Adding to cart…
          </>
        ) : (
          <>
            <RotateCcw className="h-4 w-4" strokeWidth={2} aria-hidden />
            Reorder
          </>
        )}
      </button>

      {recurringSaved ? (
        <p className="flex items-center justify-center gap-2 text-sm font-medium text-green-700">
          <Check className="h-4 w-4" strokeWidth={2.5} aria-hidden />
          Recurring order saved — manage it from your Profile.
        </p>
      ) : (
        <button
          type="button"
          onClick={() => setRecurringFormOpen(true)}
          className="flex items-center justify-center gap-2 rounded-full border border-ink-100 px-5 py-3.5 font-semibold text-ink-700 hover:border-brand-300 transition-colors"
        >
          <Repeat className="h-4 w-4" strokeWidth={2} aria-hidden />
          Make this a recurring order
        </button>
      )}

      {recurringFormOpen && (
        <RecurringOrderForm
          orderId={order.id}
          lines={order.lines}
          onClose={() => setRecurringFormOpen(false)}
          onSaved={() => setRecurringSaved(true)}
        />
      )}
    </div>
  );
}
