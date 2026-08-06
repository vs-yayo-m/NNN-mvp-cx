// src/modules/search/components/SearchBar.tsx
"use client";

// ============================================================================
// SearchBar — premium white glass pill with an animated gradient glow border
// on focus, a rotating typewriter-style placeholder, and a live AI
// suggestions dropdown backed by /api/search/suggest (server-side Groq call
// — see that route; the key never reaches this file). Full keyboard nav
// (↑ ↓ Enter Esc).
// ============================================================================

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Search, Sparkles, ArrowUpRight, Loader2 } from "lucide-react";

const ROTATING_QUERIES = [
  "Search 'chicken momo'...",
  "Search 'late night food'...",
  "Search 'vegetarian thali'...",
  "Search 'chowmein near me'...",
];

interface SearchBarProps {
  variant?: "header" | "page";
}

export default function SearchBar({ variant = "header" }: SearchBarProps) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [query, setQuery] = useState("");
  const [focused, setFocused] = useState(false);
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  // Rotate placeholder text when the field is empty and unfocused, so it
  // reads as alive rather than a static hint.
  useEffect(() => {
    if (query || focused) return;
    const t = setInterval(() => {
      setPlaceholderIndex((i) => (i + 1) % ROTATING_QUERIES.length);
    }, 2600);
    return () => clearInterval(t);
  }, [query, focused]);

  // Debounced live suggestions from the server-side AI route.
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (!query.trim()) {
      setSuggestions([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    debounceRef.current = setTimeout(async () => {
      try {
        const res = await fetch("/api/search/suggest", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ query }),
        });
        const data = await res.json();
        setSuggestions(Array.isArray(data?.suggestions) ? data.suggestions : []);
      } catch {
        setSuggestions([]);
      } finally {
        setLoading(false);
      }
    }, 320);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [query]);

  useEffect(() => {
    setDropdownOpen(focused && query.trim().length > 0);
    setActiveIndex(-1);
  }, [focused, query]);

  const runSearch = (value: string) => {
    const trimmed = value.trim();
    if (!trimmed) return;
    setDropdownOpen(false);
    inputRef.current?.blur();
    router.push(`/search?q=${encodeURIComponent(trimmed)}`);
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
      runSearch(activeIndex >= 0 ? suggestions[activeIndex] : query);
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
          focused ? "opacity-60 animate-spin-slow" : ""
        }`}
      />

      <div
        className={`relative flex items-center gap-2.5 rounded-full border px-4 py-2.5 backdrop-blur-xl transition-all duration-300 ${
          focused
            ? "border-ink-900/[0.10] bg-white shadow-[0_0_0_1px_rgba(217,119,87,0.18),0_10px_30px_-8px_rgba(217,119,87,0.28)]"
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
            className="peer w-full bg-transparent text-sm text-ink-900 placeholder-transparent outline-none"
          />
          {/* Animated rotating placeholder, sits under the real input */}
          {!query && (
            <span
              key={placeholderIndex}
              className="pointer-events-none absolute inset-y-0 left-0 flex items-center text-sm text-ink-400 animate-fade-slide-in"
            >
              {ROTATING_QUERIES[placeholderIndex]}
            </span>
          )}
        </div>

        {loading && (
          <Loader2 className="h-3.5 w-3.5 shrink-0 animate-spin text-ink-400" aria-hidden />
        )}

        <div className="hidden sm:flex items-center gap-1 shrink-0 rounded-full border border-ink-900/[0.06] bg-ink-900/[0.02] px-2 py-0.5">
          <Sparkles className="h-3 w-3 text-brand-500" strokeWidth={2} aria-hidden />
          <span className="text-[10px] font-medium tracking-wide text-ink-500">AI</span>
        </div>
      </div>

      {/* Live AI suggestions dropdown */}
      {dropdownOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 overflow-hidden rounded-2xl border border-ink-900/[0.08] bg-white/95 backdrop-blur-xl shadow-[0_20px_50px_-12px_rgba(0,0,0,0.18)] animate-fade-in z-50">
          {loading && suggestions.length === 0 ? (
            <div className="flex flex-col gap-2 p-3">
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className="h-8 rounded-lg bg-ink-900/[0.04] animate-pulse"
                  style={{ animationDelay: `${i * 80}ms` }}
                />
              ))}
            </div>
          ) : suggestions.length > 0 ? (
            <ul role="listbox" className="py-1.5">
              {suggestions.map((s, i) => (
                <li key={s + i}>
                  <button
                    type="button"
                    role="option"
                    aria-selected={activeIndex === i}
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => runSearch(s)}
                    onMouseEnter={() => setActiveIndex(i)}
                    className={`flex w-full items-center justify-between gap-2 px-4 py-2.5 text-left text-sm transition-colors ${
                      activeIndex === i
                        ? "bg-ink-900/[0.04] text-ink-900"
                        : "text-ink-600"
                    }`}
                  >
                    <span className="flex items-center gap-2.5 min-w-0">
                      <Search className="h-3.5 w-3.5 shrink-0 text-ink-300" strokeWidth={2} aria-hidden />
                      <span className="truncate">{s}</span>
                    </span>
                    <ArrowUpRight className="h-3.5 w-3.5 shrink-0 text-ink-300" strokeWidth={2} aria-hidden />
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <div className="px-4 py-3 text-sm text-ink-400">No matches yet — keep typing.</div>
          )}
        </div>
      )}
    </div>
  );
}
