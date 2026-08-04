"use client";

import { useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { KITCHEN_ITEMS } from "@/data/menu-data";
import { BAR_ITEMS } from "@/data/bar-data";
import { formatPrice, recommendFor } from "@/lib/utils";
import { useApp } from "@/context/AppContext";
import AISection from "@/components/AISection";

const ALL_ITEMS = [...KITCHEN_ITEMS, ...BAR_ITEMS];

function SpiceMeter({ level }: { level: number }) {
  if (!level) return null;
  return (
    <div className="flex items-center gap-1" aria-label={`Spice level ${level} of 3`}>
      {[1, 2, 3].map((n) => (
        <span key={n} className={n <= level ? "text-chili" : "text-line"}>
          {"\u{1F336}\uFE0F"}
        </span>
      ))}
    </div>
  );
}

export default function ProductPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const { addToCart } = useApp();
  const item = useMemo(() => ALL_ITEMS.find((i) => i.id === params.id), [params.id]);

  const [variantIdx, setVariantIdx] = useState(0);
  const [qty, setQty] = useState(1);
  const [notes, setNotes] = useState("");
  const [justAdded, setJustAdded] = useState(false);

  if (!item) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 text-center">
        <p className="text-sm text-muted">This item isn&apos;t available anymore.</p>
        <Link href="/menu" className="mt-3 inline-block text-sm font-semibold text-turmeric">
          Back to menu
        </Link>
      </div>
    );
  }

  const unitPrice = item.variants?.length ? item.variants[variantIdx].price : item.price ?? 0;
  const variantLabel = item.variants?.length ? item.variants[variantIdx].label : undefined;
  const recs = recommendFor(ALL_ITEMS, item, 6);

  const handleAdd = () => {
    addToCart(item, variantLabel, unitPrice, qty);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1600);
  };

  return (
    <div className="mx-auto max-w-2xl pb-28">
      <div className="relative aspect-[4/3] w-full bg-surface2">
        <Image src={item.image} alt={item.name} fill sizes="640px" className="object-cover" priority />
        <button
          onClick={() => router.back()}
          aria-label="Go back"
          className="tap-scale focus-ring absolute left-3 top-3 grid h-9 w-9 place-items-center rounded-full bg-base/70 text-cream"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>
        {item.isSpecialToday && (
          <span className="absolute left-3 bottom-3 rounded-full bg-turmeric px-2.5 py-1 font-mono text-[10px] font-bold uppercase text-base">
            Today&apos;s special
          </span>
        )}
      </div>

      <div className="space-y-5 px-4 py-5">
        <div>
          <p className="eyebrow text-turmeric">{item.subcategory ?? item.category}</p>
          <div className="mt-1 flex items-start justify-between gap-3">
            <h1 className="font-display text-2xl font-bold text-cream">{item.name}</h1>
            <SpiceMeter level={item.spiceLevel ?? 0} />
          </div>
          {item.description && <p className="mt-2 text-sm text-muted">{item.description}</p>}
          <div className="mt-3 flex items-center gap-2">
            {item.isVeg !== null && (
              <span className={`rounded-full border px-2.5 py-1 text-[11px] font-medium ${item.isVeg ? "border-veg text-veg" : "border-chili text-chili"}`}>
                {item.isVeg ? "Vegetarian" : "Non-vegetarian"}
              </span>
            )}
            {item.isPopular && (
              <span className="rounded-full border border-turmeric px-2.5 py-1 text-[11px] font-medium text-turmeric">
                Popular pick
              </span>
            )}
          </div>
        </div>

        {item.variants?.length ? (
          <div>
            <h2 className="mb-2 text-sm font-semibold text-cream">Choose a size</h2>
            <div className="grid grid-cols-3 gap-2">
              {item.variants.map((v, idx) => (
                <button
                  key={v.label}
                  onClick={() => setVariantIdx(idx)}
                  className={`tap-scale focus-ring rounded-xl border px-2 py-2.5 text-center ${
                    idx === variantIdx ? "border-chili bg-chili/10" : "border-line"
                  }`}
                >
                  <span className="block text-xs font-semibold text-cream">{v.label}</span>
                  <span className="block font-mono text-xs text-turmeric">{formatPrice(v.price)}</span>
                </button>
              ))}
            </div>
          </div>
        ) : null}

        <div>
          <h2 className="mb-2 text-sm font-semibold text-cream">Special instructions (optional)</h2>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="E.g. less spicy, no onion\u2026"
            rows={2}
            className="focus-ring w-full resize-none rounded-xl border border-line bg-surface p-3 text-sm text-cream placeholder:text-muted"
          />
        </div>

        <div className="flex items-center gap-3">
          <span className="text-sm font-semibold text-cream">Quantity</span>
          <div className="flex items-center gap-3 rounded-full border border-line px-1">
            <button
              onClick={() => setQty((q) => Math.max(1, q - 1))}
              aria-label="Decrease quantity"
              className="tap-scale focus-ring grid h-8 w-8 place-items-center text-lg text-cream"
            >
              \u2212
            </button>
            <span className="w-4 text-center font-mono text-sm">{qty}</span>
            <button
              onClick={() => setQty((q) => q + 1)}
              aria-label="Increase quantity"
              className="tap-scale focus-ring grid h-8 w-8 place-items-center text-lg text-cream"
            >
              +
            </button>
          </div>
        </div>
      </div>

      <AISection title="Goes well with this" items={recs} />

      <div className="fixed inset-x-0 bottom-16 z-30 mx-auto max-w-2xl px-4">
        <button
          onClick={handleAdd}
          className="tap-scale focus-ring flex w-full items-center justify-between rounded-full bg-chili px-5 py-3.5 text-sm font-semibold text-cream shadow-lg shadow-black/30"
        >
          <span>{justAdded ? "Added to cart \u2713" : `Add ${qty > 1 ? qty + " " : ""}to cart`}</span>
          <span className="font-mono">{formatPrice(unitPrice * qty)}</span>
        </button>
      </div>
    </div>
  );
}
