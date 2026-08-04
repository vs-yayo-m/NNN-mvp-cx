import Link from "next/link";
import Image from "next/image";
import { KITCHEN_ITEMS } from "@/data/menu-data";
import { BAR_ITEMS } from "@/data/bar-data";
import { CATEGORIES, SITE } from "@/data/site-config";
import { recommendFor } from "@/lib/utils";
import ProductCard from "@/components/ProductCard";
import AISection from "@/components/AISection";

const ALL_ITEMS = [...KITCHEN_ITEMS, ...BAR_ITEMS];

export default function HomePage() {
  const specials = ALL_ITEMS.filter((i) => i.isSpecialToday && i.isAvailable);
  const popular = recommendFor(ALL_ITEMS, undefined, 8);
  const kitchenCategories = CATEGORIES.filter((c) => c.section === "kitchen").slice(0, 8);

  return (
    <div className="mx-auto max-w-2xl">
      {/* Hero */}
      <section className="ticket-edge mx-4 mt-4 overflow-hidden rounded-xl2 border border-line bg-surface py-6">
        <div className="px-5">
          <p className="eyebrow text-turmeric">{SITE.branch} \u00b7 open now</p>
          <h1 className="mt-2 font-display text-3xl font-bold italic leading-tight text-cream">
            Butwal&apos;s kitchen &amp; bar,
            <br />
            one tap away.
          </h1>
          <p className="mt-2 max-w-sm text-sm text-muted">
            Momos, thukpa, wood-fired pizza and a full bar corner \u2014 order for delivery or pickup from Nom Nom Now.
          </p>
          <div className="mt-4 flex gap-2">
            <Link
              href="/menu"
              className="tap-scale focus-ring rounded-full bg-chili px-5 py-2.5 text-sm font-semibold text-cream"
            >
              Order now
            </Link>
            <Link
              href="/menu?section=bar"
              className="tap-scale focus-ring rounded-full border border-line px-5 py-2.5 text-sm font-semibold text-cream"
            >
              Visit the bar
            </Link>
          </div>
        </div>
      </section>

      {/* Today's specials */}
      {specials.length > 0 && (
        <section className="mt-6 space-y-3">
          <div className="flex items-baseline justify-between px-4">
            <h2 className="font-display text-lg font-semibold text-cream">Today&apos;s specials</h2>
            <Link href="/menu" className="text-xs font-medium text-turmeric">
              See full menu
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-3 px-4">
            {specials.map((item) => (
              <ProductCard key={item.id} item={item} />
            ))}
          </div>
        </section>
      )}

      {/* Category quick grid */}
      <section className="mt-6 space-y-3">
        <h2 className="px-4 font-display text-lg font-semibold text-cream">Browse the kitchen</h2>
        <div className="grid grid-cols-4 gap-3 px-4 sm:grid-cols-4">
          {kitchenCategories.map((c) => (
            <Link
              key={c.key}
              href={`/menu?cat=${encodeURIComponent(c.key)}`}
              className="tap-scale focus-ring flex flex-col items-center gap-1.5 rounded-xl2 border border-line bg-surface py-3 text-center"
            >
              <span className="text-2xl" aria-hidden>
                {c.icon}
              </span>
              <span className="text-[11px] font-medium text-cream">{c.label}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* AI picks */}
      <div className="mt-6">
        <AISection title="Popular right now" subtitle="What Butwal is ordering most this week" items={popular} />
      </div>

      {/* Recurring order teaser */}
      <section className="mx-4 mt-6 flex items-center gap-4 rounded-xl2 border border-line bg-surface p-4">
        <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-turmeric/15 text-xl">
          {"\u23F1\uFE0F"}
        </span>
        <div className="flex-1">
          <h3 className="text-sm font-semibold text-cream">Set it once, eat on time</h3>
          <p className="text-xs text-muted">Schedule a recurring order and we&apos;ll prep it automatically \u2014 set it up at checkout.</p>
        </div>
      </section>

      {/* Bar corner teaser */}
      <section className="relative mx-4 mt-6 mb-6 overflow-hidden rounded-xl2 border border-line">
        <div className="relative aspect-[16/7] w-full">
          <Image
            src="https://placehold.co/900x400/262019/F2A93B?text=Bar+Corner"
            alt="Nom Nom Now bar corner"
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-base/90 via-base/20 to-transparent" />
        </div>
        <div className="absolute inset-x-0 bottom-0 flex items-center justify-between p-4">
          <div>
            <p className="eyebrow text-turmeric">Bar corner</p>
            <p className="font-display text-base font-semibold text-cream">Beer, whisky, wine &amp; more</p>
          </div>
          <Link
            href="/menu?section=bar"
            className="tap-scale focus-ring shrink-0 rounded-full bg-cream px-4 py-2 text-xs font-semibold text-base"
          >
            Browse
          </Link>
        </div>
      </section>
    </div>
  );
}
