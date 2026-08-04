"use client";

import Image from "next/image";
import Link from "next/link";
import { useApp } from "@/context/AppContext";
import { formatPrice } from "@/lib/utils";
import { SITE } from "@/data/site-config";
import EmptyState from "@/components/EmptyState";

export default function CartPage() {
  const { cart, updateQuantity, removeLine, cartSubtotal, hydrated } = useApp();

  if (hydrated && cart.length === 0) {
    return (
      <EmptyState
        title="Your cart is empty"
        message="Add momos, mains or a drink from the bar corner to get started."
        ctaLabel="Browse the menu"
        ctaHref="/menu"
      />
    );
  }

  const nearFreeDelivery = SITE.freeDeliveryThreshold - cartSubtotal;

  return (
    <div className="mx-auto max-w-2xl px-4 py-4 pb-40">
      <h1 className="mb-4 font-display text-2xl font-bold text-cream">Your cart</h1>

      {nearFreeDelivery > 0 && cart.length > 0 && (
        <div className="mb-4 rounded-xl2 border border-turmeric/40 bg-turmeric/10 px-4 py-2.5 text-xs text-turmeric">
          Add {formatPrice(nearFreeDelivery)} more to unlock free delivery
        </div>
      )}

      <div className="space-y-3">
        {cart.map((line) => (
          <div key={line.lineId} className="flex gap-3 rounded-xl2 border border-line bg-surface p-3">
            <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-surface2">
              <Image src={line.image} alt={line.name} fill sizes="64px" className="object-cover" />
            </div>
            <div className="flex flex-1 flex-col justify-between">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="text-sm font-semibold text-cream">{line.name}</p>
                  {line.variantLabel && <p className="text-xs text-muted">{line.variantLabel}</p>}
                </div>
                <button
                  onClick={() => removeLine(line.lineId)}
                  aria-label={`Remove ${line.name}`}
                  className="tap-scale focus-ring text-muted hover:text-chili"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13" />
                  </svg>
                </button>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 rounded-full border border-line px-1">
                  <button
                    onClick={() => updateQuantity(line.lineId, line.quantity - 1)}
                    aria-label="Decrease quantity"
                    className="tap-scale focus-ring grid h-7 w-7 place-items-center text-cream"
                  >
                    \u2212
                  </button>
                  <span className="w-4 text-center font-mono text-xs">{line.quantity}</span>
                  <button
                    onClick={() => updateQuantity(line.lineId, line.quantity + 1)}
                    aria-label="Increase quantity"
                    className="tap-scale focus-ring grid h-7 w-7 place-items-center text-cream"
                  >
                    +
                  </button>
                </div>
                <span className="font-mono text-sm text-turmeric">{formatPrice(line.unitPrice * line.quantity)}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {cart.length > 0 && (
        <div className="fixed inset-x-0 bottom-16 z-30 border-t border-line bg-base/95 backdrop-blur">
          <div className="mx-auto max-w-2xl px-4 py-3">
            <div className="mb-2 flex items-center justify-between text-sm">
              <span className="text-muted">Subtotal</span>
              <span className="font-mono text-cream">{formatPrice(cartSubtotal)}</span>
            </div>
            <Link
              href="/checkout"
              className="tap-scale focus-ring flex w-full items-center justify-center rounded-full bg-chili py-3.5 text-sm font-semibold text-cream"
            >
              Proceed to checkout
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
