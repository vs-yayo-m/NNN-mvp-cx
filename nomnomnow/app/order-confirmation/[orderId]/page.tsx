"use client";

import { useMemo } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { useApp } from "@/context/AppContext";
import { formatPrice } from "@/lib/utils";
import { SITE } from "@/data/site-config";

export default function OrderConfirmationPage() {
  const { orderId } = useParams<{ orderId: string }>();
  const { orders, hydrated } = useApp();
  const order = useMemo(() => orders.find((o) => o.id === orderId), [orders, orderId]);

  if (!hydrated) return null;

  if (!order) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 text-center">
        <p className="text-sm text-muted">We couldn&apos;t find that order on this device.</p>
        <Link href="/menu" className="mt-3 inline-block text-sm font-semibold text-turmeric">
          Back to menu
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <div className="mb-6 flex flex-col items-center text-center">
        <span className="grid h-16 w-16 place-items-center rounded-full bg-veg/15 text-3xl">{"\u2713"}</span>
        <h1 className="mt-3 font-display text-2xl font-bold text-cream">Order placed!</h1>
        <p className="mt-1 text-sm text-muted">
          {order.orderType === "delivery"
            ? "The kitchen has your order \u2014 it's on its way soon."
            : `Head to ${order.branch} to pick this up shortly.`}
        </p>
      </div>

      <div className="ticket-edge rounded-xl2 border border-line bg-surface p-5">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <p className="eyebrow text-muted">Order</p>
            <p className="font-mono text-sm font-semibold text-cream">{order.id.toUpperCase()}</p>
          </div>
          <span className="rounded-full border border-turmeric px-3 py-1 font-mono text-[11px] font-semibold uppercase text-turmeric">
            {order.status.replace(/_/g, " ")}
          </span>
        </div>

        <div className="space-y-1.5 font-mono text-sm">
          {order.lines.map((l) => (
            <div key={l.lineId} className="flex justify-between text-muted">
              <span>
                {l.quantity} \u00d7 {l.name}
                {l.variantLabel ? ` (${l.variantLabel})` : ""}
              </span>
              <span className="text-cream">{formatPrice(l.unitPrice * l.quantity)}</span>
            </div>
          ))}
          <div className="my-2 border-t border-dashed border-line" />
          <div className="flex justify-between text-base font-semibold">
            <span className="text-cream">Total</span>
            <span className="text-turmeric">{formatPrice(order.total)}</span>
          </div>
        </div>

        <div className="mt-4 border-t border-dashed border-line pt-4 text-xs text-muted">
          <p>{order.guest.name} \u00b7 {order.guest.phone}</p>
          {order.orderType === "delivery" && <p className="mt-0.5">{order.guest.address}</p>}
          {order.isRecurring && (
            <p className="mt-1 text-turmeric">Repeats daily at {order.recurringTime}</p>
          )}
        </div>
      </div>

      <div className="mt-5 flex flex-col gap-2">
        <Link
          href={`/orders/${order.id}`}
          className="tap-scale focus-ring flex w-full items-center justify-center rounded-full bg-chili py-3.5 text-sm font-semibold text-cream"
        >
          Track this order
        </Link>
        <Link
          href="/menu"
          className="tap-scale focus-ring flex w-full items-center justify-center rounded-full border border-line py-3.5 text-sm font-semibold text-cream"
        >
          Continue browsing
        </Link>
      </div>
      <p className="mt-4 text-center text-xs text-muted">Questions? Call {SITE.supportPhone}</p>
    </div>
  );
}
