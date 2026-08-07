// MenuItemCard.tsx
"use client";

// ============================================================================
// MenuItemCard — a single item in the browse grid. Tapping it opens
// ItemDetailSheet for variant selection; a quick "+" adds the first/only
// variant straight to cart for single-variant items (optimistic).
// ============================================================================

import { useState } from "react";
import { Plus, Check } from "lucide-react";
import type { MenuItem } from "@/types";
import MenuImage from "./MenuImage";
import { formatCurrency } from "@/lib/utils";
import { useCart } from "@/lib/cartStore";
import ItemDetailSheet from "./ItemDetailSheet";

interface MenuItemCardProps {
  item: MenuItem;
}

export default function MenuItemCard({ item }: MenuItemCardProps) {
  const [sheetOpen, setSheetOpen] = useState(false);
  const [justAdded, setJustAdded] = useState(false);
  const { addItem } = useCart();

  const lowestPrice = Math.min(...item.variants.map((v) => v.price));
  const hasSingleVariant = item.variants.length === 1;

  function handleQuickAdd(e: React.MouseEvent) {
    e.stopPropagation();
    const variant = item.variants[0];
    addItem({
      menuItemId: item.id,
      name: item.name,
      image: item.image,
      variantLabel: variant.label,
      unitPrice: variant.price,
      quantity: 1,
    });
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 900);
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setSheetOpen(true)}
        className="group flex flex-col text-left rounded-xl2 border border-ink-100 bg-cream-100 overflow-hidden hover:shadow-md hover:-translate-y-0.5 transition-all"
      >
        <div className="relative w-full aspect-square">
          <MenuImage src={item.image} alt={item.name} />

          {/* Veg/non-veg indicator */}
          <span
            className={`absolute top-2 left-2 flex h-4 w-4 items-center justify-center rounded-sm border-2 bg-cream-100 ${
              item.isVeg ? "border-green-600" : "border-brand-600"
            }`}
            aria-label={item.isVeg ? "Vegetarian" : "Non-vegetarian"}
          >
            <span
              className={`h-1.5 w-1.5 rounded-full ${item.isVeg ? "bg-green-600" : "bg-brand-600"}`}
            />
          </span>

          {item.isTodaysSpecial && (
            <span className="absolute top-2 right-2 rounded-full bg-gold-400 px-2 py-0.5 text-[10px] font-semibold text-ink-900">
              Today&apos;s Special
            </span>
          )}
        </div>

        <div className="flex flex-1 flex-col gap-1 p-3">
          <h3 className="font-display text-sm font-semibold text-ink-900 leading-snug line-clamp-2">
            {item.name}
          </h3>
          {item.description && (
            <p className="text-xs text-ink-400 line-clamp-2">{item.description}</p>
          )}
          <div className="mt-auto flex items-center justify-between pt-2">
            <span className="text-sm font-semibold text-ink-800">
              {hasSingleVariant ? formatCurrency(lowestPrice) : `From ${formatCurrency(lowestPrice)}`}
            </span>
            {hasSingleVariant ? (
              <span
                onClick={handleQuickAdd}
                role="button"
                tabIndex={0}
                className={`flex h-8 w-8 items-center justify-center rounded-full text-cream-100 font-bold transition-all ${
                  justAdded ? "bg-green-600 scale-110" : "bg-brand-500 hover:bg-brand-600"
                }`}
                aria-label={`Add ${item.name} to cart`}
              >
                {justAdded ? (
                  <Check className="h-4 w-4" strokeWidth={2.5} aria-hidden />
                ) : (
                  <Plus className="h-4 w-4" strokeWidth={2.5} aria-hidden />
                )}
              </span>
            ) : (
              <span className="text-xs font-medium text-brand-500">Options</span>
            )}
          </div>
        </div>
      </button>

      {sheetOpen && <ItemDetailSheet item={item} onClose={() => setSheetOpen(false)} />}
    </>
  );
}
