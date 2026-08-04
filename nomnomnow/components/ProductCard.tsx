"use client";

import Link from "next/link";
import Image from "next/image";
import { MenuItem } from "@/lib/types";
import { formatPrice, startingPrice } from "@/lib/utils";
import { useApp } from "@/context/AppContext";

function VegDot({ isVeg }: { isVeg: boolean | null }) {
  if (isVeg === null) return null;
  return (
    <span
      className={`grid h-4 w-4 place-items-center border ${isVeg ? "border-veg" : "border-chili"}`}
      title={isVeg ? "Vegetarian" : "Non-vegetarian"}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${isVeg ? "bg-veg" : "bg-chili"}`} />
    </span>
  );
}

export default function ProductCard({ item, compact = false }: { item: MenuItem; compact?: boolean }) {
  const { addToCart } = useApp();
  const hasVariants = !!item.variants?.length;
  const price = startingPrice(item);

  const quickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    if (hasVariants) return; // variant picking happens on the product page
    addToCart(item, undefined, price, 1);
  };

  return (
    <Link
      href={`/product/${item.id}`}
      className={`group focus-ring block overflow-hidden rounded-xl2 border border-line bg-surface transition-colors hover:border-turmeric/50 ${
        !item.isAvailable ? "opacity-50" : ""
      }`}
    >
      <div className="relative aspect-[5/4] w-full overflow-hidden bg-surface2">
        <Image
          src={item.image}
          alt={item.name}
          fill
          sizes="(max-width: 640px) 50vw, 240px"
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
        {item.isSpecialToday && (
          <span className="absolute left-2 top-2 rounded-full bg-turmeric px-2 py-0.5 font-mono text-[10px] font-bold uppercase text-base">
            Today&apos;s special
          </span>
        )}
        {!item.isAvailable && (
          <span className="absolute inset-0 grid place-items-center bg-base/70 font-mono text-xs uppercase tracking-wide text-cream">
            Sold out
          </span>
        )}
        {item.isPopular && item.isAvailable && (
          <span className="absolute right-2 top-2 rounded-full bg-base/80 px-2 py-0.5 font-mono text-[10px] font-semibold text-turmeric">
            Popular
          </span>
        )}
      </div>

      <div className={`p-3 ${compact ? "space-y-1" : "space-y-1.5"}`}>
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-start gap-1.5">
            <VegDot isVeg={item.isVeg} />
            <h3 className="text-sm font-semibold leading-snug text-cream line-clamp-2">{item.name}</h3>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <span className="font-mono text-sm text-turmeric">
            {hasVariants && "from "}
            {formatPrice(price)}
          </span>
          {item.isAvailable && (
            <button
              onClick={quickAdd}
              aria-label={hasVariants ? `Choose options for ${item.name}` : `Add ${item.name} to cart`}
              className="tap-scale focus-ring rounded-full border border-chili px-2.5 py-1 font-mono text-xs font-semibold text-chili hover:bg-chili hover:text-cream"
            >
              {hasVariants ? "Choose" : "Add"}
            </button>
          )}
        </div>
      </div>
    </Link>
  );
}
