import Link from "next/link";
import { foodCategories, barCategories } from "@/data/categories";
import { getTodaysSpecials, getPopularItems } from "@/data/menu";
import MenuItemCard from "@/modules/menu/components/MenuItemCard";

// ============================================================================
// Home — hero, category rail, Today's Specials, Popular sections.
// Phase A note: this covers the blueprint's §3.1 home sections using
// server-rendered data directly. The richer AI-personalized
// "Recommended for You" section and the "Ask AI" panel are Phase B scope
// (modules/home/components/*) — Phase A's home page focuses on getting the
// core browse → cart → checkout path live end-to-end.
// ============================================================================

export default function HomePage() {
  const specials = getTodaysSpecials().slice(0, 4);
  const popular = getPopularItems().slice(0, 8);

  return (
    <div className="mx-auto max-w-6xl px-4 py-6 flex flex-col gap-10">
      {/* Hero */}
      <section className="relative overflow-hidden rounded-xl2 bg-gradient-to-br from-brand-500 to-brand-600 px-6 py-10 sm:py-14 text-cream-100">
        <div className="relative z-10 max-w-md">
          <p className="text-sm font-medium text-brand-100 mb-2">Butwal · Restaurant · Cloud Kitchen · Bar</p>
          <h1 className="font-display text-3xl sm:text-4xl font-semibold leading-tight">
            Good food, ordered in seconds.
          </h1>
          <p className="mt-3 text-brand-50/90 text-sm sm:text-base">
            Momo, biryani, pizza, and a full bar menu — delivered hot or ready for pickup.
          </p>
          <Link
            href="/menu"
            className="inline-flex items-center gap-2 mt-6 rounded-full bg-cream-100 px-6 py-3 font-semibold text-brand-600 hover:bg-cream-200 transition-colors"
          >
            Order Now →
          </Link>
        </div>
        <span className="absolute -right-6 -bottom-8 text-[10rem] opacity-15 select-none" aria-hidden>
          🥟
        </span>
      </section>

      {/* Category rail */}
      <section>
        <h2 className="font-display text-lg font-semibold text-ink-900 mb-3">Categories</h2>
        <div className="flex gap-3 overflow-x-auto no-scrollbar pb-1 -mx-4 px-4">
          {[...foodCategories, ...barCategories].map((cat) => (
            <Link
              key={cat.id}
              href={`/menu?category=${cat.id}`}
              className={`flex flex-col items-center gap-1.5 shrink-0 w-20 rounded-xl2 border px-3 py-3 transition-colors ${
                cat.group === "bar"
                  ? "border-bar-900/20 bg-bar-900/5 hover:bg-bar-900/10"
                  : "border-ink-100 bg-cream-100 hover:border-brand-300"
              }`}
            >
              <span className="text-2xl" aria-hidden>
                {cat.icon}
              </span>
              <span className="text-xs font-medium text-ink-800 text-center leading-tight">
                {cat.label}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Today's Specials */}
      <section>
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-display text-lg font-semibold text-ink-900">Today&apos;s Specials</h2>
          <Link href="/menu" className="text-sm font-medium text-brand-500 hover:text-brand-600">
            See all
          </Link>
        </div>
        {specials.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
            {specials.map((item) => (
              <MenuItemCard key={item.id} item={item} />
            ))}
          </div>
        ) : (
          <p className="text-sm text-ink-400">No specials flagged for today — check back soon.</p>
        )}
      </section>

      {/* Popular Right Now */}
      <section>
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-display text-lg font-semibold text-ink-900">Popular Right Now</h2>
          <Link href="/menu" className="text-sm font-medium text-brand-500 hover:text-brand-600">
            See all
          </Link>
        </div>
        {popular.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
            {popular.map((item) => (
              <MenuItemCard key={item.id} item={item} />
            ))}
          </div>
        ) : (
          <p className="text-sm text-ink-400">Nothing trending yet — be the first to order!</p>
        )}
      </section>
    </div>
  );
}
