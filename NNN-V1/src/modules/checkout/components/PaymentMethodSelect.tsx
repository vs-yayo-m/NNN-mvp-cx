// ============================================================================
// PaymentMethodSelect — mocked payment method picker (COD / eSewa / Khalti).
// Visual only — selecting an option simulates success at order placement,
// no real payment processing occurs, per blueprint §3.1 step 8.
// ============================================================================

import { Wallet, Smartphone, CreditCard } from "lucide-react";
import type { PaymentMethod } from "@/types";

interface PaymentMethodSelectProps {
  value: PaymentMethod;
  onChange: (method: PaymentMethod) => void;
}

const OPTIONS: { id: PaymentMethod; label: string; description: string; Icon: typeof Wallet }[] = [
  { id: "cod", label: "Cash on Delivery", description: "Pay when your order arrives", Icon: Wallet },
  { id: "esewa", label: "eSewa", description: "Pay with your eSewa wallet", Icon: Smartphone },
  { id: "khalti", label: "Khalti", description: "Pay with your Khalti wallet", Icon: CreditCard },
];

export default function PaymentMethodSelect({ value, onChange }: PaymentMethodSelectProps) {
  return (
    <div className="flex flex-col gap-2">
      {OPTIONS.map(({ id, label, description, Icon }) => (
        <button
          key={id}
          type="button"
          onClick={() => onChange(id)}
          className={`flex items-center gap-3 rounded-xl2 border px-4 py-3 text-left transition-colors ${
            value === id ? "border-brand-500 bg-brand-50" : "border-ink-100 hover:border-brand-200"
          }`}
        >
          <span
            className={`flex h-9 w-9 items-center justify-center rounded-full shrink-0 ${
              value === id ? "bg-brand-500 text-cream-100" : "bg-ink-100 text-ink-500"
            }`}
          >
            <Icon className="h-4 w-4" strokeWidth={1.75} aria-hidden />
          </span>
          <span className="flex-1 min-w-0">
            <span className="block text-sm font-medium text-ink-800">{label}</span>
            <span className="block text-xs text-ink-400">{description}</span>
          </span>
          <span
            className={`h-4 w-4 rounded-full border-2 flex items-center justify-center shrink-0 ${
              value === id ? "border-brand-500" : "border-ink-100"
            }`}
          >
            {value === id && <span className="h-2 w-2 rounded-full bg-brand-500" />}
          </span>
        </button>
      ))}
    </div>
  );
}
