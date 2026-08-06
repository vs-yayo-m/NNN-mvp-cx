// ============================================================================
// OrderStatusStepper — visual status timeline for order tracking. Takes the
// order's status and type and renders the appropriate step sequence
// (delivery vs. pickup) with real Lucide icons. The auto-advancing behavior
// itself lives in orderStore's computeSimulatedStatus / refreshOrderStatus,
// using the STATUS_TIMELINE_SECONDS constants — this component is purely
// presentational so those tunable timings stay in exactly one place.
// ============================================================================

import { ReceiptText, ChefHat, Bike, Store, PartyPopper } from "lucide-react";
import type { Order, OrderStatus } from "@/types";

interface StepDefinition {
  key: OrderStatus;
  label: string;
  Icon: typeof ReceiptText;
}

const DELIVERY_STEPS: StepDefinition[] = [
  { key: "received", label: "Order Received", Icon: ReceiptText },
  { key: "preparing", label: "Preparing", Icon: ChefHat },
  { key: "out_for_delivery", label: "Out for Delivery", Icon: Bike },
  { key: "completed", label: "Delivered", Icon: PartyPopper },
];

const PICKUP_STEPS: StepDefinition[] = [
  { key: "received", label: "Order Received", Icon: ReceiptText },
  { key: "preparing", label: "Preparing", Icon: ChefHat },
  { key: "ready_for_pickup", label: "Ready for Pickup", Icon: Store },
  { key: "completed", label: "Completed", Icon: PartyPopper },
];

interface OrderStatusStepperProps {
  order: Order;
}

export default function OrderStatusStepper({ order }: OrderStatusStepperProps) {
  const steps = order.orderType === "pickup" ? PICKUP_STEPS : DELIVERY_STEPS;
  const currentIndex = steps.findIndex((s) => s.key === order.status);

  return (
    <div className="rounded-xl2 border border-ink-100 bg-cream-100 p-5">
      <div className="flex items-start">
        {steps.map((step, idx) => {
          const isDone = idx <= currentIndex;
          const isCurrent = idx === currentIndex;
          const Icon = step.Icon;
          return (
            <div key={step.key} className="flex-1 flex flex-col items-center relative">
              {idx > 0 && (
                <div
                  className={`absolute top-5 right-1/2 w-full h-0.5 -z-0 transition-colors duration-500 ${
                    idx <= currentIndex ? "bg-brand-500" : "bg-ink-100"
                  }`}
                />
              )}
              <span
                className={`relative z-10 flex h-10 w-10 items-center justify-center rounded-full transition-all duration-300 ${
                  isDone ? "bg-brand-500 text-cream-100" : "bg-ink-100 text-ink-400"
                } ${isCurrent ? "ring-4 ring-brand-100 scale-110" : ""}`}
              >
                <Icon className="h-5 w-5" strokeWidth={2} aria-hidden />
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
          <span className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" aria-hidden />
          Live tracking — updates automatically
        </p>
      )}
    </div>
  );
}
