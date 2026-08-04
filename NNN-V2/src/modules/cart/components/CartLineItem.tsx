"use client";

// ============================================================================
// CartLineItem — one line in the cart (drawer or full page). Quantity
// changes and removal are optimistic — no confirmation dialogs.
// ============================================================================

import type { CartLine } from "@/types";
import MenuImage from "@/modules/menu/components/MenuImage";
import { formatCurrency } from "@/lib/utils";
import { useCart } from "@/lib/cartStore";

interface CartLineItemProps {
  line: CartLine;
}

export default function CartLineItem({ line }: CartLineItemProps) {
  const { updateQuantity, removeLine } = useCart();

  return (
    <div className="flex gap-3 py-3">
      <div className="relative h-16 w-16 shrink-0 rounded-lg overflow-hidden">
        <MenuImage src={line.image} alt={line.name} sizes="64px" />
      </div>

      <div className="flex flex-1 flex-col justify-between min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <p className="text-sm font-semibold text-ink-900 truncate">{line.name}</p>
            <p className="text-xs text-ink-400">{line.variantLabel}</p>
          </div>
          <button
            type="button"
            onClick={() => removeLine(line.lineId)}
            className="text-xs text-ink-400 hover:text-brand-500 shrink-0"
            aria-label={`Remove ${line.name} from cart`}
          >
            Remove
          </button>
        </div>

        <div className="flex items-center justify-between mt-1">
          <div className="flex items-center gap-2 rounded-full border border-ink-100 px-1.5 py-0.5">
            <button
              type="button"
              onClick={() => updateQuantity(line.lineId, line.quantity - 1)}
              className="flex h-6 w-6 items-center justify-center rounded-full text-ink-600 hover:bg-cream-200"
              aria-label="Decrease quantity"
            >
              −
            </button>
            <span className="w-4 text-center text-sm font-semibold text-ink-900">
              {line.quantity}
            </span>
            <button
              type="button"
              onClick={() => updateQuantity(line.lineId, line.quantity + 1)}
              className="flex h-6 w-6 items-center justify-center rounded-full text-ink-600 hover:bg-cream-200"
              aria-label="Increase quantity"
            >
              +
            </button>
          </div>
          <span className="text-sm font-semibold text-ink-800">
            {formatCurrency(line.unitPrice * line.quantity)}
          </span>
        </div>
      </div>
    </div>
  );
}
