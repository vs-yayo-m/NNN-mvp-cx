"use client";

// ============================================================================
// Full /search page — AI-backed search results, per blueprint §3.6 item 1.
// ============================================================================

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import SearchBar from "@/modules/search/components/SearchBar";
import SearchResultsList from "@/modules/search/components/SearchResultsList";

function SearchPageContent() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("q") ?? "";
  const [query, setQuery] = useState(initialQuery);

  return (
    <div className="mx-auto max-w-6xl px-4 py-6 flex flex-col gap-5">
      <h1 className="font-display text-2xl font-semibold text-ink-900">Search</h1>
      <SearchBar variant="page" initialValue={initialQuery} onQueryChange={setQuery} autoFocus />
      <SearchResultsList query={query} />
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-6xl px-4 py-6">
          <div className="h-8 w-32 bg-ink-100 rounded-full animate-pulse" />
        </div>
      }
    >
      <SearchPageContent />
    </Suspense>
  );
}
