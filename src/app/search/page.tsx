'use client';

import { Suspense, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import SearchBar from '@/modules/search/components/SearchBar';
import SearchResultsList from '@/modules/search/components/SearchResultsList';

function SearchContent() {
  const searchParams = useSearchParams();
  const [query] = useState(searchParams.get('q') || '');

  return (
    <div className="space-y-5">
      <h1 className="font-display text-4xl font-black">AI Smart Search</h1>
      <SearchBar />
      <SearchResultsList query={query} />
      {!query && (
        <div className="panel p-8 text-center">
          Try “chiken biryani”, “spicy momo”, or “bar snacks”.
        </div>
      )}
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="panel p-6">Loading search…</div>}>
      <SearchContent />
    </Suspense>
  );
}
