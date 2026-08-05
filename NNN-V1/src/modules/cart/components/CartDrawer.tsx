"use client";

// ============================================================================
// CartDrawer — the shared cart UI (line items, subtotal, delivery fee,
// AI combo suggestions, checkout CTA). Rendered full-bleed on the /cart
// page. Kept as its own component (rather than inlined in the page) so it
// can also be reused as a true slide-in overlay elsewhere without
// duplicating cart-summary logic.
// ============================================================================

import Link from "next/link";
import { ShoppingBag, Plus } from "lucide-react";
import { useCart } from "@/lib/cartStore";
import { formatCurrency } from "@/lib/utils";
import CartLineItem from "./CartLineItem";
import CartComboSuggestions from "./CartComboSuggestions";
import PromoCodeInput from "./PromoCodeInput";

interface CartDrawerProps {
  /** When true, renders the "Continue browsing" link back to /menu. */
  showContinueShopping?: boolean;
}

export default function CartDrawer({ showContinueShopping = true }: CartDrawerProps) {
  const { state, subtotal, deliveryFee, total, itemCount } = useCart();

  if (state.lines.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 py-20 text-center px-4">
        <ShoppingBag className="h-12 w-12 text-ink-300" strokeWidth={1.5} aria-hidden />
        <p className="font-display text-lg font-semibold text-ink-800">Your cart is empty</p>
        <p className="text-sm text-ink-400 max-w-xs">
          Browse the menu and add something delicious — it&apos;ll show up here.
        </p>
        <Link
          href="/menu"
          className="mt-2 rounded-full bg-brand-500 px-5 py-2.5 text-sm font-semibold text-cream-100 hover:bg-brand-600 transition-colors"
        >
          Browse Menu
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      <div className="divide-y divide-ink-100 px-4 sm:px-0">
        {state.lines.map((line) => (
          <CartLineItem key={line.lineId} line={line} />
        ))}
      </div>

      {showContinueShopping && (
        <Link
          href="/menu"
          className="mx-4 sm:mx-0 mt-2 flex items-center gap-1 text-sm font-medium text-brand-500 hover:text-brand-600 w-fit"
        >
          <Plus className="h-3.5 w-3.5" strokeWidth={2.5} aria-hidden />
          Add more items
        </Link>
      )}

      <CartComboSuggestions />

      <div className="mt-6 mx-4 sm:mx-0">
        <PromoCodeInput />
      </div>

      <div className="mt-4 mx-4 sm:mx-0 rounded-xl2 border border-ink-100 bg-cream-100 p-4 flex flex-col gap-2">
        <div className="flex items-center justify-between text-sm text-ink-600">
          <span>Subtotal ({itemCount} item{itemCount === 1 ? "" : "s"})</span>
          <span>{formatCurrency(subtotal)}</span>
        </div>
        <div className="flex items-center justify-between text-sm text-ink-600">
          <span>Delivery fee</span>
          <span>{deliveryFee === 0 ? "Free" : formatCurrency(deliveryFee)}</span>
        </div>
        {state.promoDiscount > 0 && (
          <div className="flex items-center justify-between text-sm text-green-700">
            <span>Promo ({state.promoCode})</span>
            <span>−{formatCurrency(state.promoDiscount)}</span>
          </div>
        )}
        <div className="flex items-center justify-between pt-2 mt-1 border-t border-ink-100 font-semibold text-ink-900">
          <span>Total</span>
          <span>{formatCurrency(total)}</span>
        </div>
      </div>

      <div className="px-4 sm:px-0 mt-4">
        <Link
          href="/checkout"
          className="flex items-center justify-center rounded-full bg-brand-500 px-5 py-3.5 font-semibold text-cream-100 hover:bg-brand-600 transition-colors"
        >
          Proceed to Checkout
        </Link>
      </div>
    </div>
  );
}
