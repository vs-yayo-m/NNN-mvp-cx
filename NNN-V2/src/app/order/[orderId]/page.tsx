"use client";

// ============================================================================
// Order Tracking + Order Detail — one screen, mode determined by status.
// Active orders (not yet "completed") show a live, auto-advancing status
// stepper (polls computeSimulatedStatus every few seconds). Completed
// orders render as a read-only past-order detail view with a Reorder CTA.
//
// Phase A note: the dedicated OrderStatusStepper component (with its own
// tunable timeline constants) is Phase B polish; the auto-advancing
// behavior itself is fully implemented here now via orderStore's
// computeSimulatedStatus, using the same STATUS_TIMELINE_SECONDS constants
// that Phase B's component will read from.
// ============================================================================

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useOrders } from "@/lib/orderStore";
import { useCart } from "@/lib/cartStore";
import { formatCurrency } from "@/lib/utils";
import type { OrderStatus } from "@/types";

const STATUS_STEPS: { key: OrderStatus; label: string; icon: string }[] = [
  { key: "received", label: "Order Received", icon: "🧾" },
  { key: "preparing", label: "Preparing", icon: "👨‍🍳" },
  { key: "out_for_delivery", label: "Out for Delivery", icon: "🛵" },
  { key: "completed", label: "Delivered", icon: "🎉" },
];

const PICKUP_STEPS: { key: OrderStatus; label: string; icon: string }[] = [
  { key: "received", label: "Order Received", icon: "🧾" },
  { key: "preparing", label: "Preparing", icon: "👨‍🍳" },
  { key: "ready_for_pickup", label: "Ready for Pickup", icon: "🏪" },
  { key: "completed", label: "Completed", icon: "🎉" },
];

export default function OrderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const orderId = params.orderId as string;
  const { getOrderById, refreshOrderStatus } = useOrders();
  const { addItem, clearCart } = useCart();
  const [reordering, setReordering] = useState(false);

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
        <span className="text-4xl" aria-hidden>
          🔍
        </span>
        <p className="font-display text-lg font-semibold text-ink-800">Order not found</p>
        <Link href="/menu" className="mt-2 text-brand-500 font-semibold text-sm">
          Back to Menu
        </Link>
      </div>
    );
  }

  const steps = order.orderType === "pickup" ? PICKUP_STEPS : STATUS_STEPS;
  const currentIndex = steps.findIndex((s) => s.key === order.status);

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

      {/* Status stepper */}
      <div className="rounded-xl2 border border-ink-100 bg-cream-100 p-5">
        <div className="flex items-start">
          {steps.map((step, idx) => {
            const isDone = idx <= currentIndex;
            const isCurrent = idx === currentIndex;
            return (
              <div key={step.key} className="flex-1 flex flex-col items-center relative">
                {idx > 0 && (
                  <div
                    className={`absolute top-5 right-1/2 w-full h-0.5 -z-0 ${
                      idx <= currentIndex ? "bg-brand-500" : "bg-ink-100"
                    }`}
                  />
                )}
                <span
                  className={`relative z-10 flex h-10 w-10 items-center justify-center rounded-full text-base transition-all ${
                    isDone ? "bg-brand-500 text-cream-100" : "bg-ink-100 text-ink-400"
                  } ${isCurrent ? "ring-4 ring-brand-100 scale-110" : ""}`}
                >
                  {step.icon}
                </span>
                <span
                  className={`mt-2 text-[11px] text-center leading-tight max-w-[70px] ${
                    isDone ? "font-semibold text-ink-900" : "text-ink-400"
                  }`}
                >
                  {step.label}
                </span>
              </div>
            );
          })}
        </div>

        {order.status !== "completed" && (
          <p className="text-center text-xs text-ink-400 mt-4 flex items-center justify-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" />
            Live tracking — updates automatically
          </p>
        )}
      </div>

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
        <p className="text-sm text-ink-400 capitalize">Payment: {order.paymentMethod === "cod" ? "Cash on Delivery" : order.paymentMethod}</p>
      </div>

      <button
        type="button"
        onClick={handleReorder}
        disabled={reordering}
        className="rounded-full bg-brand-500 px-5 py-3.5 font-semibold text-cream-100 hover:bg-brand-600 disabled:opacity-60 transition-colors"
      >
        {reordering ? "Adding to cart…" : "Reorder"}
      </button>
    </div>
  );
}
