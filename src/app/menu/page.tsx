'use client';

import { Suspense, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { availableMenu } from '@/data/menu';
import { CategoryFilterBar, MenuGrid } from '@/modules/menu';

function MenuContent() {
  const searchParams = useSearchParams();
  const [category, setCategory] = useState(searchParams.get('category') || 'all');
  const [veg, setVeg] = useState('all');
  const [sort, setSort] = useState('popular');

  let items = availableMenu().filter(
    (item) =>
      (category === 'all' || item.categoryId === category) &&
      (veg === 'all' || (veg === 'veg' ? item.isVeg : !item.isVeg)),
  );

  items = [...items].sort((a, b) =>
    sort === 'low'
      ? a.variants[0].price - b.variants[0].price
      : sort === 'high'
        ? b.variants[0].price - a.variants[0].price
        : Number(b.isPopular) - Number(a.isPopular),
  );

  return (
    <>
      <h1 className="mb-4 font-display text-4xl font-black">Browse the Butwal menu</h1>
      <CategoryFilterBar
        category={category}
        setCategory={setCategory}
        veg={veg}
        setVeg={setVeg}
        sort={sort}
        setSort={setSort}
      />
      <MenuGrid items={items} />
    </>
  );
}

export default function MenuPage() {
  return (
    <Suspense fallback={<div className="panel p-6">Loading menu filters…</div>}>
      <MenuContent />
    </Suspense>
  );
}
