"use client";

// ============================================================================
// Order Confirmation — order number, ETA, animated success state, and a
// "Track Order" CTA into the tracking screen. Also offers the post-order
// soft prompt to save info / log in per blueprint §3.1 step 11.
// ============================================================================

import { Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { SearchX, CheckCircle2 } from "lucide-react";
import { useOrders } from "@/lib/orderStore";
import { useAuth } from "@/lib/authStore";
import { formatCurrency } from "@/lib/utils";

function ConfirmationContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const orderId = searchParams.get("orderId");
  const { getOrderById } = useOrders();
  const { state: authState, setReturnContext } = useAuth();

  const order = orderId ? getOrderById(orderId) : undefined;

  if (!order) {
    return (
      <div className="mx-auto max-w-md px-4 py-16 text-center flex flex-col items-center gap-3">
        <SearchX className="h-9 w-9 text-ink-300" strokeWidth={1.5} aria-hidden />
        <p className="font-display text-lg font-semibold text-ink-800">Order not found</p>
        <p className="text-sm text-ink-400">
          We couldn&apos;t find that order. It may have been placed in a different browser session.
        </p>
        <Link href="/menu" className="mt-2 text-brand-500 font-semibold text-sm">
          Back to Menu
        </Link>
      </div>
    );
  }

  const etaMinutes = order.orderType === "pickup" ? "15–20" : "30–40";

  function handleSaveInfo() {
    setReturnContext({ type: "home" });
    router.push("/login");
  }

  return (
    <div className="mx-auto max-w-md px-4 py-10 flex flex-col items-center text-center gap-4">
      <span className="flex h-20 w-20 items-center justify-center rounded-full bg-green-100 text-green-600 animate-check-pop">
        <CheckCircle2 className="h-10 w-10" strokeWidth={1.75} aria-hidden />
      </span>
      <div>
        <h1 className="font-display text-2xl font-semibold text-ink-900">Order Placed!</h1>
        <p className="text-sm text-ink-400 mt-1">
          Thanks{order.details.name ? `, ${order.details.name.split(" ")[0]}` : ""} — we&apos;re on it.
        </p>
      </div>

      <div className="w-full rounded-xl2 border border-ink-100 bg-cream-100 p-5 flex flex-col gap-3 text-left">
        <div className="flex justify-between">
          <span className="text-sm text-ink-400">Order Number</span>
          <span className="text-sm font-semibold text-ink-900">{order.id}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-sm text-ink-400">Estimated Time</span>
          <span className="text-sm font-semibold text-ink-900">{etaMinutes} min</span>
        </div>
        <div className="flex justify-between">
          <span className="text-sm text-ink-400">Type</span>
          <span className="text-sm font-semibold text-ink-900 capitalize">{order.orderType}</span>
        </div>
        <div className="flex justify-between border-t border-ink-100 pt-3">
          <span className="text-sm text-ink-400">Total</span>
          <span className="text-sm font-semibold text-ink-900">{formatCurrency(order.total)}</span>
        </div>
      </div>

      <Link
        href={`/order/${order.id}`}
        className="w-full rounded-full bg-brand-500 px-5 py-3.5 font-semibold text-cream-100 hover:bg-brand-600 transition-colors"
      >
        Track Order
      </Link>

      {!authState.isLoggedIn && (
        <button
          type="button"
          onClick={handleSaveInfo}
          className="w-full rounded-full border border-ink-100 px-5 py-3.5 font-semibold text-ink-700 hover:border-brand-300 transition-colors"
        >
          Save your info for faster ordering next time
        </button>
      )}
    </div>
  );
}

export default function OrderConfirmationPage() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-md px-4 py-16 flex justify-center">
          <span className="h-8 w-8 rounded-full border-2 border-brand-500 border-t-transparent animate-spin" />
        </div>
      }
    >
      <ConfirmationContent />
    </Suspense>
  );
}
