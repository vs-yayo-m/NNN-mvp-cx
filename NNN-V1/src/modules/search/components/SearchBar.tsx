"use client";

// ============================================================================
// SearchBar — header-embedded, debounced AI search input. Typing navigates
// to /search?q=... after a short debounce so the full results page (with
// its own loading/empty states) handles the actual query. Kept intentionally
// simple here — SearchResultsList owns the real search + results rendering.
// ============================================================================

import { useState, useEffect, useRef } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Search, Sparkles } from "lucide-react";
import { debounce } from "@/lib/utils";

interface SearchBarProps {
  variant?: "header" | "page";
  initialValue?: string;
  onQueryChange?: (query: string) => void;
  autoFocus?: boolean;
}

export default function SearchBar({
  variant = "header",
  initialValue = "",
  onQueryChange,
  autoFocus = false,
}: SearchBarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [value, setValue] = useState(initialValue);
  const debouncedNavigate = useRef(
    debounce((q: string) => {
      if (onQueryChange) {
        onQueryChange(q);
      } else if (q.trim()) {
        router.push(`/search?q=${encodeURIComponent(q.trim())}`);
      }
    }, 400)
  ).current;

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  function handleChange(next: string) {
    setValue(next);
    debouncedNavigate(next);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!value.trim()) return;
    if (onQueryChange) {
      onQueryChange(value);
    } else if (pathname !== "/search") {
      router.push(`/search?q=${encodeURIComponent(value.trim())}`);
    }
  }

  const isHeader = variant === "header";

  return (
    <form onSubmit={handleSubmit} className="relative">
      <Search
        className={`pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 ${
          isHeader ? "text-ink-400" : "text-ink-400"
        }`}
        strokeWidth={2}
        aria-hidden
      />
      <input
        type="search"
        value={value}
        autoFocus={autoFocus}
        onChange={(e) => handleChange(e.target.value)}
        placeholder="Search Momo, Pizza, Biryani…"
        className={`w-full rounded-full border bg-cream-100 pl-10 pr-9 text-sm text-ink-900 placeholder:text-ink-400 outline-none transition-colors ${
          isHeader
            ? "border-ink-100 py-2 focus:border-brand-400"
            : "border-ink-100 py-3 focus:border-brand-400"
        }`}
      />
      <Sparkles
        className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gold-400"
        strokeWidth={2}
        aria-hidden
      />
    </form>
  );
}
