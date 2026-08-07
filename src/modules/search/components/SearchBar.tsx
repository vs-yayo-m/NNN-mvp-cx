// src/modules/search/components/SearchBar.tsx
"use client";

// ============================================================================
// SearchBar — premium white glass pill with animated glow-border focus,
// rotating placeholder, and a real-time suggestions dropdown sourced from
// the LOCAL menu index (searchSuggestions in searchMenu.ts) — instant, free,
// no network round-trip. Shows image, name, price, and veg/non-veg per
// suggestion, per spec.
//
// This bar lives ONLY in the header now. The /search page has no input of
// its own — it just reads ?q= from the URL and renders SearchResultsList.
// Typing here and pressing Enter (or tapping a suggestion) always navigates
// to /search?q=..., which is what keeps there from being two competing
// "owners" of the query. See src/app/search/page.tsx.
//
// Natural-language intent ("I'm hungry, want something spicy") is a
// SEPARATE explicit flow (CravingSearch.tsx) that calls /api/search/intent
// for keyword extraction only, then routes to /search with those keywords.
// Groq never supplies dish names directly — this bar's dropdown always
// comes from the local menu index.
// ============================================================================

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Search, ArrowUpRight } from "lucide-react";
import Image from "next/image";
import { searchSuggestions, type SearchSuggestion } from "@/modules/search/lib/searchMenu";

const ROTATING_QUERIES = [
  "Search 'chicken Steam momo'...",
  "Search 'late night food'...",
  "Search 'Nom Nom Now Special Pizza '...",
  "Click for 'Order Now & Nom Nom Now'...",
  " Search 'Red Bull '...",
  " Search 'Coke 250 ml '...",
  " Search 'Gorkha Strong Beer  '..."  
];

export default function SearchBar() {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const [query, setQuery] = useState("");
  const [focused, setFocused] = useState(false);
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
  const [activeIndex, setActiveIndex] = useState(-1);

  const showDropdown = focused && query.trim().length > 0;

  // Rotate placeholder text when the field is empty and unfocused.
  useEffect(() => {
    if (query || focused) return;
    const t = setInterval(() => {
      setPlaceholderIndex((i) => (i + 1) % ROTATING_QUERIES.length);
    }, 2600);
    return () => clearInterval(t);
  }, [query, focused]);

  // Local, instant suggestions — no network call, no debounce needed since
  // this is a synchronous in-memory search over the menu.
  useEffect(() => {
    if (!query.trim()) {
      setSuggestions([]);
      setActiveIndex(-1);
      return;
    }
    setSuggestions(searchSuggestions(query, { limit: 6 }));
    setActiveIndex(-1);
  }, [query]);

  // Close dropdown on outside click (in addition to input blur, which is
  // delayed to allow onClick on a suggestion to register first).
  useEffect(() => {
    if (!showDropdown) return;
    const handleClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setFocused(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [showDropdown]);

  const goToSearchPage = (value: string) => {
    const trimmed = value.trim();
    if (!trimmed) return;
    setFocused(false);
    inputRef.current?.blur();
    router.push(`/search?q=${encodeURIComponent(trimmed)}`);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (suggestions.length === 0) {
      if (e.key === "Enter") goToSearchPage(query);
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
        goToSearchPage(suggestions[activeIndex].name);
      } else {
        goToSearchPage(query);
      }
    } else if (e.key === "Escape") {
      setFocused(false);
      inputRef.current?.blur();
    }
  };

  return (
    <div ref={containerRef} className="relative w-full">
      {/* Glow ring — animated gradient border, only visible on focus */}
      <div
        aria-hidden
        className={`pointer-events-none absolute -inset-[1.5px] rounded-full bg-[conic-gradient(from_var(--angle),#E84A2E,#E8A93B,#E84A2E)] opacity-0 blur-[3px] transition-opacity duration-500 ${
          focused ? "opacity-60 animate-spin-slow" : ""
        }`}
      />

      <div
        className={`relative flex items-center gap-2.5 rounded-full border px-4 py-2.5 backdrop-blur-xl transition-all duration-300 ${
          focused
            ? "border-ink-900/[0.10] bg-white shadow-[0_0_0_1px_rgba(232,74,46,0.18),0_10px_30px_-8px_rgba(232,74,46,0.28)]"
            : "border-ink-900/[0.08] bg-white/70 hover:border-ink-900/[0.12] hover:bg-white/90"
        }`}
      >
        <Search
          className={`h-4 w-4 shrink-0 transition-colors duration-300 ${
            focused ? "text-brand-500" : "text-ink-400"
          }`}
          strokeWidth={2}
          aria-hidden
        />

        <div className="relative flex-1 min-w-0">
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => setTimeout(() => setFocused(false), 150)}
            onKeyDown={handleKeyDown}
            placeholder=""
            aria-label="Search for food, restaurants, or dishes"
            className="peer w-full bg-transparent text-sm text-ink-900 placeholder-ink-400 outline-none"
          />
          {!query && (
            <span
              key={placeholderIndex}
              className="pointer-events-none absolute inset-y-0 left-0 flex items-center text-sm text-ink-400 animate-fade-slide-in"
            >
              {ROTATING_QUERIES[placeholderIndex]}
            </span>
          )}
        </div>
      </div>

      {/* Real-time local suggestions dropdown */}
      {showDropdown && (
        <div className="absolute top-full left-0 right-0 mt-2 overflow-hidden rounded-2xl border border-ink-900/[0.08] bg-white/95 backdrop-blur-xl shadow-[0_20px_50px_-12px_rgba(0,0,0,0.18)] animate-fade-in z-50">
          {suggestions.length > 0 ? (
            <ul role="listbox" className="py-1.5 max-h-[70vh] overflow-y-auto">
              {suggestions.map((s, i) => (
                <li key={s.id}>
                  <button
                    type="button"
                    role="option"
                    aria-selected={activeIndex === i}
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => goToSearchPage(s.name)}
                    onMouseEnter={() => setActiveIndex(i)}
                    className={`flex w-full items-center gap-3 px-3 py-2 text-left transition-colors ${
                      activeIndex === i ? "bg-ink-900/[0.04]" : ""
                    }`}
                  >
                    <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-lg bg-ink-100">
                      <Image
                        src={s.image}
                        alt={s.name}
                        fill
                        sizes="44px"
                        className="object-cover"
                      />
                      {s.isTodaysSpecial && (
                        <span className="absolute inset-x-0 bottom-0 bg-gold-400/90 text-center text-[8px] font-semibold text-ink-900 leading-tight">
                          Special
                        </span>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span
                          className={`flex h-3 w-3 shrink-0 items-center justify-center rounded-[3px] border ${
                            s.isVeg ? "border-green-600" : "border-red-600"
                          }`}
                          aria-label={s.isVeg ? "Vegetarian" : "Non-vegetarian"}
                        >
                          <span
                            className={`h-1.5 w-1.5 rounded-full ${
                              s.isVeg ? "bg-green-600" : "bg-red-600"
                            }`}
                          />
                        </span>
                        <span className="truncate text-sm font-medium text-ink-900">
                          {s.name}
                        </span>
                      </div>
                      <span className="text-xs text-ink-400">From ₹{s.priceFrom}</span>
                    </div>

                    <ArrowUpRight className="h-3.5 w-3.5 shrink-0 text-ink-300" strokeWidth={2} aria-hidden />
                  </button>
                </li>
              ))}
              <li className="border-t border-ink-900/[0.06]">
                <button
                  type="button"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => goToSearchPage(query)}
                  className="flex w-full items-center justify-between px-4 py-2.5 text-left text-sm font-medium text-brand-500 hover:bg-ink-900/[0.03] transition-colors"
                >
                  See all results for &ldquo;{query}&rdquo;
                  <ArrowUpRight className="h-3.5 w-3.5" strokeWidth={2} aria-hidden />
                </button>
              </li>
            </ul>
          ) : (
            <div className="px-4 py-3 text-sm text-ink-400">
              No matches yet — try a different word, or press Enter to search the full menu.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
