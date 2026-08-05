// src/modules/search/components/SearchBar.tsx
"use client";

// ============================================================================
// SearchBar — premium glass pill with an animated gradient glow border on
// focus, a rotating typewriter-style placeholder, and a real-time AI-styled
// suggestions dropdown.
//
// Suggestions are matched instantly against the local menu data
// (src/modules/search/lib/searchMenu.ts) — no network round trip, so the
// dropdown updates on every keystroke with zero latency. Each suggestion
// row shows the dish image, name, a veg/non-veg indicator dot (the
// standard green-square/red-square convention), and starting price.
//
// Two usage modes:
//   - variant="header": uncontrolled, owns its own query state, navigates to
//     /search?q=... on submit (used in Header.tsx).
//   - variant="page": controlled via initialValue + onQueryChange, used on
//     the /search results page itself so the parent can drive results as the
//     user types instead of re-navigating on every keystroke.
// ============================================================================

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Search, Sparkles, ArrowUpRight, Loader2 } from "lucide-react";
import Image from "next/image";
import {
  searchSuggestions,
  type SearchSuggestion,
} from "@/modules/search/lib/searchMenu";

const ROTATING_QUERIES = [
  "Search 'chicken momo'...",
  "Search 'late night food'...",
  "Search 'vegetarian thali'...",
  "Search 'chowmein near me'...",
];

interface SearchBarProps {
  variant?: "header" | "page";
  /** Controlled initial value (page variant). Ignored in header variant. */
  initialValue?: string;
  /** Fires on every keystroke (page variant) so the parent can drive live results. */
  onQueryChange?: (value: string) => void;
  /** Autofocus the input on mount — handy on the dedicated /search page. */
  autoFocus?: boolean;
}

/** Small veg/non-veg indicator — green square + dot for veg, red for non-veg. */
function VegIndicator({ isVeg }: { isVeg: boolean }) {
  return (
    <span
      className={`flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded-[3px] border ${
        isVeg ? "border-emerald-500" : "border-red-500"
      }`}
      aria-label={isVeg ? "Vegetarian" : "Non-vegetarian"}
      title={isVeg ? "Vegetarian" : "Non-vegetarian"}
    >
      <span
        className={`h-1.5 w-1.5 rounded-full ${isVeg ? "bg-emerald-500" : "bg-red-500"}`}
      />
    </span>
  );
}

export default function SearchBar({
  variant = "header",
  initialValue = "",
  onQueryChange,
  autoFocus = false,
}: SearchBarProps) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const isPage = variant === "page";

  const [query, setQuery] = useState(initialValue);
  const [focused, setFocused] = useState(false);
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    if (autoFocus) inputRef.current?.focus();
    // Only run on mount — deliberately no deps beyond autoFocus's initial value.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const updateQuery = (value: string) => {
    setQuery(value);
    onQueryChange?.(value);
  };

  // Rotate placeholder text when the field is empty and unfocused, so it
  // reads as alive rather than a static hint.
  useEffect(() => {
    if (query || focused) return;
    const t = setInterval(() => {
      setPlaceholderIndex((i) => (i + 1) % ROTATING_QUERIES.length);
    }, 2600);
    return () => clearInterval(t);
  }, [query, focused]);

  // Real-time local suggestions — instant, no debounce needed since this is
  // synchronous in-memory filtering, not a network call. A tiny loading
  // flicker is simulated only long enough to keep the shimmer state
  // legible; feel free to remove entirely once the menu grows large enough
  // that this becomes perceptible work.
  useEffect(() => {
    if (!query.trim()) {
      setSuggestions([]);
      setLoading(false);
      return;
    }
    setSuggestions(searchSuggestions(query, { limit: 6 }));
    setLoading(false);
  }, [query]);

  useEffect(() => {
    setDropdownOpen(focused && query.trim().length > 0);
    setActiveIndex(-1);
  }, [focused, query]);

  const runSearch = (value: string) => {
    const trimmed = value.trim();
    if (!trimmed) return;
    setDropdownOpen(false);

    if (isPage) {
      updateQuery(trimmed);
      inputRef.current?.blur();
      return;
    }

    inputRef.current?.blur();
    router.push(`/search?q=${encodeURIComponent(trimmed)}`);
  };

  const goToItem = (suggestion: SearchSuggestion) => {
    setDropdownOpen(false);
    inputRef.current?.blur();
    router.push(`/search?q=${encodeURIComponent(suggestion.name)}&item=${suggestion.id}`);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!dropdownOpen || suggestions.length === 0) {
      if (e.key === "Enter") runSearch(query);
      return;
    }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => (i + 1) % suggestions.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => (i <= 0 ? suggestions.length - 1 : i - 1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (activeIndex >= 0) {
        goToItem(suggestions[activeIndex]);
      } else {
        runSearch(query);
      }
    } else if (e.key === "Escape") {
      setDropdownOpen(false);
      inputRef.current?.blur();
    }
  };

  return (
    <div className={`relative w-full ${variant === "header" ? "" : "max-w-2xl"}`}>
      {/* Glow ring — animated gradient border, only visible on focus */}
      <div
        aria-hidden
        className={`pointer-events-none absolute -inset-[1.5px] rounded-full bg-[conic-gradient(from_var(--angle),#D97757,#F2B84B,#D97757)] opacity-0 blur-[3px] transition-opacity duration-500 ${
          focused ? "opacity-70 animate-spin-slow" : ""
        }`}
      />

      <div
        onClick={() => {
          // Tapping anywhere on the bar (not just the text input) should
          // act like a search entry point.
          inputRef.current?.focus();
        }}
        className={`relative flex items-center gap-2.5 rounded-full border px-4 py-2.5 backdrop-blur-xl transition-all duration-300 cursor-text ${
          focused
            ? "border-white/[0.14] bg-[#141416]/90 shadow-[0_0_0_1px_rgba(217,119,87,0.25),0_8px_30px_-6px_rgba(217,119,87,0.35)]"
            : "border-white/[0.08] bg-[#141416]/70 hover:border-white/[0.12] hover:bg-[#17171A]/80"
        }`}
      >
        <Search
          className={`h-4 w-4 shrink-0 transition-colors duration-300 ${
            focused ? "text-brand-400" : "text-white/40"
          }`}
          strokeWidth={2}
          aria-hidden
        />

        <div className="relative flex-1 min-w-0">
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => updateQuery(e.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => setTimeout(() => setFocused(false), 150)}
            onKeyDown={handleKeyDown}
            placeholder=""
            aria-label="Search for food, restaurants, or dishes"
            className="peer w-full bg-transparent text-sm text-white placeholder-transparent outline-none"
          />
          {/* Animated rotating placeholder, sits under the real input */}
          {!query && (
            <span
              key={placeholderIndex}
              className="pointer-events-none absolute inset-y-0 left-0 flex items-center text-sm text-white/35 animate-fade-slide-in"
            >
              {ROTATING_QUERIES[placeholderIndex]}
            </span>
          )}
        </div>

        {loading && (
          <Loader2 className="h-3.5 w-3.5 shrink-0 animate-spin text-white/40" aria-hidden />
        )}

        <div className="hidden sm:flex items-center gap-1 shrink-0 rounded-full border border-white/[0.08] bg-white/[0.03] px-2 py-0.5">
          <Sparkles className="h-3 w-3 text-brand-400" strokeWidth={2} aria-hidden />
          <span className="text-[10px] font-medium tracking-wide text-white/40">AI</span>
        </div>
      </div>

      {/* Live suggestions dropdown — dish image, name, veg indicator, price */}
      {dropdownOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 overflow-hidden rounded-2xl border border-white/[0.08] bg-[#141416]/95 backdrop-blur-xl shadow-[0_16px_40px_-12px_rgba(0,0,0,0.6)] animate-fade-in z-50">
          {suggestions.length > 0 ? (
            <ul role="listbox" className="py-1.5">
              {suggestions.map((s, i) => (
                <li key={s.id}>
                  <button
                    type="button"
                    role="option"
                    aria-selected={activeIndex === i}
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => goToItem(s)}
                    onMouseEnter={() => setActiveIndex(i)}
                    className={`flex w-full items-center gap-3 px-3 py-2 text-left transition-colors ${
                      activeIndex === i ? "bg-white/[0.06]" : ""
                    }`}
                  >
                    <span className="relative h-11 w-11 shrink-0 overflow-hidden rounded-lg bg-white/[0.04]">
                      <Image
                        src={s.image}
                        alt=""
                        fill
                        sizes="44px"
                        className="object-cover"
                      />
                    </span>

                    <span className="flex min-w-0 flex-1 flex-col gap-0.5">
                      <span className="flex items-center gap-1.5 min-w-0">
                        <VegIndicator isVeg={s.isVeg} />
                        <span className="truncate text-sm font-medium text-white/90">
                          {s.name}
                        </span>
                        {s.isTodaysSpecial && (
                          <span className="shrink-0 rounded-full bg-brand-500/15 px-1.5 py-0.5 text-[10px] font-medium text-brand-400">
                            Today&apos;s special
                          </span>
                        )}
                      </span>
                      <span className="text-xs text-white/40">
                        From ₹{s.priceFrom}
                      </span>
                    </span>

                    <ArrowUpRight className="h-3.5 w-3.5 shrink-0 text-white/20" strokeWidth={2} aria-hidden />
                  </button>
                </li>
              ))}

              {/* "See all results" — routes to the full /search page */}
              <li className="border-t border-white/[0.06] mt-1 pt-1">
                <button
                  type="button"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => runSearch(query)}
                  className="flex w-full items-center justify-center gap-1.5 px-4 py-2.5 text-xs font-medium text-brand-400 hover:text-brand-300 transition-colors"
                >
                  See all results for &ldquo;{query}&rdquo;
                  <ArrowUpRight className="h-3 w-3" strokeWidth={2} aria-hidden />
                </button>
              </li>
            </ul>
          ) : (
            <div className="px-4 py-3 text-sm text-white/35">No matches yet — keep typing.</div>
          )}
        </div>
      )}
    </div>
  );
}
