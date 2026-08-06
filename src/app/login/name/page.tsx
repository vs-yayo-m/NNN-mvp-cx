"use client";

// ============================================================================
// Login — Screen 3: Name Entry (new users only), per blueprint §3.2 step 5.
// Returning users never see this screen — the OTP screen redirects them
// straight back to their prior context instead.
// ============================================================================

import { useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Smile, Loader2 } from "lucide-react";
import { useAuth } from "@/lib/authStore";
import { simulateLatency } from "@/lib/utils";

function NameCaptureContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const phone = searchParams.get("phone") ?? "";
  const { completeOnboarding, getReturnContext, clearReturnContext } = useAuth();

  const [name, setName] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (name.trim().length < 2) return;

    setSubmitting(true);
    await simulateLatency(300, 600);
    completeOnboarding(phone, name.trim());

    const ctx = getReturnContext();
    clearReturnContext();
    if (!ctx || ctx.type === "home") {
      router.push("/");
    } else if (ctx.type === "checkout") {
      router.push("/checkout");
    } else if (ctx.type === "cart") {
      router.push("/cart");
    } else {
      router.push("/profile");
    }
  }

  return (
    <div className="mx-auto max-w-sm px-4 py-12 flex flex-col gap-6">
      <div className="text-center">
        <span className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-brand-50 text-brand-500">
          <Smile className="h-7 w-7" strokeWidth={1.75} aria-hidden />
        </span>
        <h1 className="font-display text-2xl font-semibold text-ink-900 mt-3">What should we call you?</h1>
        <p className="text-sm text-ink-400 mt-1">This helps us personalize your orders.</p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          autoFocus
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Your name"
          className="rounded-xl2 border border-ink-100 bg-cream-100 px-4 py-3.5 outline-none focus:border-brand-400 transition-colors text-ink-900 placeholder:text-ink-400"
        />
        <button
          type="submit"
          disabled={name.trim().length < 2 || submitting}
          className="rounded-full bg-brand-500 px-5 py-3.5 font-semibold text-cream-100 hover:bg-brand-600 disabled:opacity-40 transition-colors flex items-center justify-center gap-2"
        >
          {submitting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" strokeWidth={2} aria-hidden />
              Setting up your account…
            </>
          ) : (
            "Continue"
          )}
        </button>
      </form>
    </div>
  );
}

export default function NameCapturePage() {
  return (
    <Suspense fallback={<div className="mx-auto max-w-sm px-4 py-12" />}>
      <NameCaptureContent />
    </Suspense>
  );
}
