// ============================================================================
// OrderReviewSummary — final line-item + totals summary shown at checkout
// before placing the order.
// ============================================================================

import type { CartLine, OrderType } from "@/types";
import { formatCurrency } from "@/lib/utils";

interface OrderReviewSummaryProps {
  lines: CartLine[];
  subtotal: number;
  deliveryFee: number;
  total: number;
  orderType: OrderType;
  promoCode: string | null;
  promoDiscount: number;
}

export default function OrderReviewSummary({
  lines,
  subtotal,
  deliveryFee,
  total,
  orderType,
  promoCode,
  promoDiscount,
}: OrderReviewSummaryProps) {
  const displayTotal = orderType === "pickup" ? total - deliveryFee : total;

  return (
    <section className="rounded-xl2 border border-ink-100 bg-cream-100 p-4 flex flex-col gap-2">
      <h2 className="text-sm font-semibold text-ink-800 mb-1">Order Summary</h2>
      {lines.map((line) => (
        <div key={line.lineId} className="flex justify-between text-sm text-ink-600">
          <span className="truncate pr-2">
            {line.quantity}× {line.name} ({line.variantLabel})
          </span>
          <span className="shrink-0">{formatCurrency(line.unitPrice * line.quantity)}</span>
        </div>
      ))}
      <div className="border-t border-ink-100 pt-2 mt-1 flex flex-col gap-1">
        <div className="flex justify-between text-sm text-ink-600">
          <span>Subtotal</span>
          <span>{formatCurrency(subtotal)}</span>
        </div>
        {orderType === "delivery" && (
          <div className="flex justify-between text-sm text-ink-600">
            <span>Delivery Fee</span>
            <span>{deliveryFee === 0 ? "Free" : formatCurrency(deliveryFee)}</span>
          </div>
        )}
        {promoDiscount > 0 && (
          <div className="flex justify-between text-sm text-green-700">
            <span>Promo ({promoCode})</span>
            <span>−{formatCurrency(promoDiscount)}</span>
          </div>
        )}
        <div className="flex justify-between font-semibold text-ink-900 pt-1">
          <span>Total</span>
          <span>{formatCurrency(displayTotal)}</span>
        </div>
      </div>
    </section>
  );
}
