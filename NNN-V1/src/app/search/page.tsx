// src/app/search/page.tsx
"use client";

// ============================================================================
// Full /search page — AI-backed search results, per blueprint §3.6 item 1.
//
// No input lives here. Typing happens only in the header's SearchBar, which
// navigates to /search?q=... on submit. This page just reads that query
// param and renders results — a single source of truth for "what's being
// searched," avoiding the header/page fighting over ownership of the query.
// ============================================================================

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import SearchResultsList from "@/modules/search/components/SearchResultsList";

function SearchPageContent() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") ?? "";

  return (
    <div className="mx-auto max-w-6xl px-4 py-6 flex flex-col gap-5">
      <div>
        <h1 className="font-display text-2xl font-semibold text-ink-900">Search</h1>
        {query && (
          <p className="mt-1 text-sm text-ink-400">
            Showing results for &ldquo;{query}&rdquo; — use the search bar above to change it.
          </p>
        )}
      </div>
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
