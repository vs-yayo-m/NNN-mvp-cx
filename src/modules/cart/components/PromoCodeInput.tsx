"use client";

// ============================================================================
// PromoCodeInput — apply/clear a promo code against data/promoCodes.ts,
// entirely client-side via cartStore's applyPromo/clearPromo.
// ============================================================================

import { useState } from "react";
import { Tag, X, Loader2 } from "lucide-react";
import { useCart } from "@/lib/cartStore";
import { simulateLatency } from "@/lib/utils";

export default function PromoCodeInput() {
  const { state, applyPromo, clearPromo } = useCart();
  const [code, setCode] = useState("");
  const [message, setMessage] = useState<{ text: string; ok: boolean } | null>(null);
  const [checking, setChecking] = useState(false);

  async function handleApply(e: React.FormEvent) {
    e.preventDefault();
    if (!code.trim() || checking) return;
    setChecking(true);
    await simulateLatency(200, 450);
    const result = applyPromo(code);
    setMessage({ text: result.message, ok: result.success });
    if (result.success) setCode("");
    setChecking(false);
  }

  function handleClear() {
    clearPromo();
    setMessage(null);
    setCode("");
  }

  if (state.promoCode) {
    return (
      <div className="flex items-center justify-between rounded-xl2 border border-green-200 bg-green-50 px-4 py-3">
        <div className="flex items-center gap-2">
          <Tag className="h-4 w-4 text-green-700" strokeWidth={2} aria-hidden />
          <span className="text-sm font-semibold text-green-800">{state.promoCode} applied</span>
        </div>
        <button
          type="button"
          onClick={handleClear}
          className="flex h-6 w-6 items-center justify-center rounded-full text-green-700 hover:bg-green-100"
          aria-label="Remove promo code"
        >
          <X className="h-3.5 w-3.5" strokeWidth={2} aria-hidden />
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleApply} className="flex flex-col gap-1.5">
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Tag
            className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-ink-400"
            strokeWidth={2}
            aria-hidden
          />
          <input
            value={code}
            onChange={(e) => setCode(e.target.value.toUpperCase())}
            placeholder="Promo code"
            className="w-full rounded-full border border-ink-100 bg-cream-100 pl-10 pr-4 py-2.5 text-sm outline-none focus:border-brand-400 transition-colors"
          />
        </div>
        <button
          type="submit"
          disabled={!code.trim() || checking}
          className="flex items-center justify-center rounded-full bg-ink-900 px-4 py-2.5 text-sm font-semibold text-cream-100 hover:bg-ink-800 disabled:opacity-40 transition-colors shrink-0"
        >
          {checking ? <Loader2 className="h-4 w-4 animate-spin" strokeWidth={2} aria-hidden /> : "Apply"}
        </button>
      </div>
      {message && (
        <p className={`text-xs px-1 ${message.ok ? "text-green-700" : "text-brand-500"}`}>{message.text}</p>
      )}
    </form>
  );
}
