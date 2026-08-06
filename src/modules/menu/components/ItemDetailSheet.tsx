"use client";

// ============================================================================
// ItemDetailSheet — slide-up sheet (not a full page nav) for variant
// selection, quantity, and add-to-cart. Keeps browsing feeling fast.
// ============================================================================

import { useEffect, useState } from "react";
import { X, Minus, Plus, Check } from "lucide-react";
import type { MenuItem, MenuItemVariant } from "@/types";
import MenuImage from "./MenuImage";
import { formatCurrency } from "@/lib/utils";
import { useCart } from "@/lib/cartStore";

interface ItemDetailSheetProps {
  item: MenuItem;
  onClose: () => void;
}

export default function ItemDetailSheet({ item, onClose }: ItemDetailSheetProps) {
  const [selectedVariant, setSelectedVariant] = useState<MenuItemVariant>(item.variants[0]);
  const [quantity, setQuantity] = useState(1);
  const [justAdded, setJustAdded] = useState(false);
  const { addItem } = useCart();

  // Lock background scroll while the sheet is open.
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  function handleAddToCart() {
    addItem({
      menuItemId: item.id,
      name: item.name,
      image: item.image,
      variantLabel: selectedVariant.label,
      unitPrice: selectedVariant.price,
      quantity,
    });
    setJustAdded(true);
    setTimeout(() => {
      onClose();
    }, 650);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center sm:justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-ink-900/50 animate-fade-in"
        onClick={onClose}
        aria-hidden
      />

      {/* Sheet */}
      <div className="relative z-10 w-full sm:max-w-md max-h-[90vh] overflow-y-auto rounded-t-2xl sm:rounded-2xl bg-cream-100 animate-slide-in-right sm:animate-fade-in">
        <div className="relative w-full aspect-[4/3]">
          <MenuImage src={item.image} alt={item.name} priority />
          <button
            type="button"
            onClick={onClose}
            className="absolute top-3 right-3 flex h-9 w-9 items-center justify-center rounded-full bg-cream-100/90 text-ink-800 shadow"
            aria-label="Close"
          >
            <X className="h-5 w-5" strokeWidth={2} aria-hidden />
          </button>
        </div>

        <div className="p-5 flex flex-col gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span
                className={`flex h-4 w-4 items-center justify-center rounded-sm border-2 ${
                  item.isVeg ? "border-green-600" : "border-brand-600"
                }`}
              >
                <span className={`h-1.5 w-1.5 rounded-full ${item.isVeg ? "bg-green-600" : "bg-brand-600"}`} />
              </span>
              {item.isTodaysSpecial && (
                <span className="rounded-full bg-gold-400 px-2 py-0.5 text-[10px] font-semibold text-ink-900">
                  Today&apos;s Special
                </span>
              )}
            </div>
            <h2 className="font-display text-xl font-semibold text-ink-900 mt-1.5">{item.name}</h2>
            {item.description && <p className="text-sm text-ink-400 mt-1">{item.description}</p>}
          </div>

          {/* Variant selection */}
          {item.variants.length > 1 && (
            <div>
              <p className="text-sm font-semibold text-ink-800 mb-2">Choose an option</p>
              <div className="flex flex-wrap gap-2">
                {item.variants.map((variant) => (
                  <button
                    key={variant.label}
                    type="button"
                    onClick={() => setSelectedVariant(variant)}
                    className={`rounded-full border px-3.5 py-2 text-sm font-medium transition-colors ${
                      selectedVariant.label === variant.label
                        ? "border-brand-500 bg-brand-50 text-brand-600"
                        : "border-ink-100 text-ink-600 hover:border-brand-200"
                    }`}
                  >
                    {variant.label} · {formatCurrency(variant.price)}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quantity stepper */}
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-ink-800">Quantity</p>
            <div className="flex items-center gap-3 rounded-full border border-ink-100 px-2 py-1">
              <button
                type="button"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="flex h-7 w-7 items-center justify-center rounded-full text-ink-600 hover:bg-cream-200"
                aria-label="Decrease quantity"
              >
                <Minus className="h-3.5 w-3.5" strokeWidth={2.5} aria-hidden />
              </button>
              <span className="w-5 text-center font-semibold text-ink-900">{quantity}</span>
              <button
                type="button"
                onClick={() => setQuantity((q) => q + 1)}
                className="flex h-7 w-7 items-center justify-center rounded-full text-ink-600 hover:bg-cream-200"
                aria-label="Increase quantity"
              >
                <Plus className="h-3.5 w-3.5" strokeWidth={2.5} aria-hidden />
              </button>
            </div>
          </div>

          <button
            type="button"
            onClick={handleAddToCart}
            className={`mt-2 flex items-center justify-between rounded-full px-5 py-3.5 font-semibold text-cream-100 transition-all ${
              justAdded ? "bg-green-600" : "bg-brand-500 hover:bg-brand-600"
            }`}
          >
            <span className="flex items-center gap-1.5">
              {justAdded && <Check className="h-4 w-4" strokeWidth={2.5} aria-hidden />}
              {justAdded ? "Added" : "Add to Cart"}
            </span>
            <span>{formatCurrency(selectedVariant.price * quantity)}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
