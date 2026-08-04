import { MenuItem } from "@/lib/types";
import ProductCard from "./ProductCard";

export default function AISection({
  title,
  subtitle,
  items,
}: {
  title: string;
  subtitle?: string;
  items: MenuItem[];
}) {
  if (!items.length) return null;
  return (
    <section className="space-y-3 py-2">
      <div className="flex items-baseline justify-between px-4">
        <div>
          <p className="eyebrow flex items-center gap-1.5 text-turmeric">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2 9.5 9.5 2 12l7.5 2.5L12 22l2.5-7.5L22 12l-7.5-2.5Z" />
            </svg>
            Picked for you
          </p>
          <h2 className="font-display text-lg font-semibold text-cream">{title}</h2>
        </div>
      </div>
      {subtitle && <p className="px-4 text-xs text-muted">{subtitle}</p>}
      <div className="scrollbar-none flex gap-3 overflow-x-auto px-4 pb-2">
        {items.map((item) => (
          <div key={item.id} className="w-40 shrink-0">
            <ProductCard item={item} compact />
          </div>
        ))}
      </div>
    </section>
  );
}
