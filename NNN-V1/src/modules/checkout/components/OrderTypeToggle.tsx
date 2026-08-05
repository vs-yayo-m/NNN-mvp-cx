// ============================================================================
// OrderTypeToggle — Delivery / Pickup selector for checkout.
// ============================================================================

import { Bike, Store } from "lucide-react";
import type { OrderType } from "@/types";

interface OrderTypeToggleProps {
  value: OrderType;
  onChange: (type: OrderType) => void;
}

const OPTIONS: { id: OrderType; label: string; Icon: typeof Bike }[] = [
  { id: "delivery", label: "Delivery", Icon: Bike },
  { id: "pickup", label: "Pickup", Icon: Store },
];

export default function OrderTypeToggle({ value, onChange }: OrderTypeToggleProps) {
  return (
    <div className="grid grid-cols-2 gap-2">
      {OPTIONS.map(({ id, label, Icon }) => (
        <button
          key={id}
          type="button"
          onClick={() => onChange(id)}
          className={`flex items-center justify-center gap-2 rounded-xl2 border px-4 py-3 text-sm font-semibold transition-colors ${
            value === id
              ? "border-brand-500 bg-brand-50 text-brand-600"
              : "border-ink-100 text-ink-600 hover:border-brand-200"
          }`}
        >
          <Icon className="h-4 w-4" strokeWidth={2} aria-hidden />
          {label}
        </button>
      ))}
    </div>
  );
}
