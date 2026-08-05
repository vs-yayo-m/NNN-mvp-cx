"use client";

// ============================================================================
// CartLineItem — one line in the cart (drawer or full page). Quantity
// changes and removal are optimistic — no confirmation dialogs.
// ============================================================================

import { Minus, Plus, Trash2 } from "lucide-react";
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
            className="flex items-center gap-1 text-xs text-ink-400 hover:text-brand-500 shrink-0 transition-colors"
            aria-label={`Remove ${line.name} from cart`}
          >
            <Trash2 className="h-3.5 w-3.5" strokeWidth={1.75} aria-hidden />
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
              <Minus className="h-3 w-3" strokeWidth={2.5} aria-hidden />
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
              <Plus className="h-3 w-3" strokeWidth={2.5} aria-hidden />
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
