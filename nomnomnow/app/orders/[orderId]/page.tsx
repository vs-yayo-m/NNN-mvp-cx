"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { useApp } from "@/context/AppContext";
import { formatPrice, simulatedStatus, STATUS_STEPS, PICKUP_STATUS_STEPS } from "@/lib/utils";
import { SITE } from "@/data/site-config";

export default function OrderTrackingPage() {
  const { orderId } = useParams<{ orderId: string }>();
  const { orders, hydrated } = useApp();
  const order = useMemo(() => orders.find((o) => o.id === orderId), [orders, orderId]);
  const [, tick] = useState(0);

  // Re-render every 10s so the simulated status can visibly progress during a live demo.
  useEffect(() => {
    const t = setInterval(() => tick((n) => n + 1), 10000);
    return () => clearInterval(t);
  }, []);

  if (!hydrated) return null;

  if (!order) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 text-center">
        <p className="text-sm text-muted">We couldn&apos;t find that order on this device.</p>
        <Link href="/orders" className="mt-3 inline-block text-sm font-semibold text-turmeric">
          Back to orders
        </Link>
      </div>
    );
  }

  const status = simulatedStatus(order);
  const steps = order.orderType === "pickup" ? PICKUP_STATUS_STEPS : STATUS_STEPS;
  const currentIdx = steps.findIndex((s) => s.key === status);

  return (
    <div className="mx-auto max-w-2xl px-4 py-6">
      <p className="eyebrow text-muted">Tracking</p>
      <h1 className="mb-6 font-mono text-lg font-semibold text-cream">{order.id.toUpperCase()}</h1>

      <div className="mb-6 rounded-xl2 border border-line bg-surface p-5">
        <ol className="space-y-0">
          {steps.map((step, idx) => {
            const done = idx <= currentIdx;
            const isLast = idx === steps.length - 1;
            return (
              <li key={step.key} className="relative flex gap-3 pb-6 last:pb-0">
                {!isLast && (
                  <span
                    className={`absolute left-[9px] top-5 h-full w-0.5 ${idx < currentIdx ? "bg-turmeric" : "bg-line"}`}
                  />
                )}
                <span
                  className={`z-10 grid h-5 w-5 shrink-0 place-items-center rounded-full border-2 ${
                    done ? "border-turmeric bg-turmeric" : "border-line bg-base"
                  }`}
                >
                  {done && <span className="h-1.5 w-1.5 rounded-full bg-base" />}
                </span>
                <div>
                  <p className={`text-sm font-medium ${done ? "text-cream" : "text-muted"}`}>{step.label}</p>
                  {idx === currentIdx && (
                    <p className="text-xs text-turmeric">In progress\u2026</p>
                  )}
                </div>
              </li>
            );
          })}
        </ol>
      </div>

      <div className="ticket-edge rounded-xl2 border border-line bg-surface p-5">
        <h2 className="mb-3 text-sm font-semibold text-cream">Order details</h2>
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
          <p>
            {order.orderType === "delivery" ? "Delivering to" : "Pickup from"}{" "}
            {order.orderType === "delivery" ? order.guest.address : order.branch}
          </p>
          <p className="mt-2">Questions? Call {SITE.supportPhone}</p>
        </div>
      </div>
    </div>
  );
}
