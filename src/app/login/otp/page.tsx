"use client";

// ============================================================================
// Login — Screen 2: OTP Entry, per blueprint §3.2 step 3–5.
// Full screen (not a modal) — feels serious/secure. Displays the mock OTP
// on-screen since there's no real SMS provider. On correct entry, branches:
// new phone -> /login/name (Screen 3); known phone -> logs in and returns
// to prior context immediately.
// ============================================================================

import { useState, useEffect, Suspense, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ShieldCheck, ArrowLeft, CheckCircle2, Loader2 } from "lucide-react";
import OtpInput from "@/modules/auth/components/OtpInput";
import { useAuth } from "@/lib/authStore";
import { simulateLatency } from "@/lib/utils";

const MOCK_OTP = "1234";
const RESEND_SECONDS = 30;

function OtpContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const phone = searchParams.get("phone") ?? "";
  const { isKnownPhone, loginReturning, getReturnContext, clearReturnContext } = useAuth();

  const [status, setStatus] = useState<"idle" | "verifying" | "success" | "error">("idle");
  const [resetKey, setResetKey] = useState(0);
  const [countdown, setCountdown] = useState(RESEND_SECONDS);

  useEffect(() => {
    if (countdown <= 0) return;
    const timer = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [countdown]);

  const redirectToContext = useCallback(() => {
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
  }, [getReturnContext, clearReturnContext, router]);

  async function handleComplete(code: string) {
    setStatus("verifying");
    await simulateLatency(400, 800);

    if (code !== MOCK_OTP) {
      setStatus("error");
      setTimeout(() => {
        setStatus("idle");
        setResetKey((k) => k + 1);
      }, 900);
      return;
    }

    setStatus("success");

    // Branch: new user vs returning user, per §3.2 step 5.
    if (isKnownPhone(phone)) {
      loginReturning(phone);
      setTimeout(() => redirectToContext(), 700);
    } else {
      setTimeout(() => router.push(`/login/name?phone=${phone}`), 700);
    }
  }

  function handleResend() {
    setCountdown(RESEND_SECONDS);
    setResetKey((k) => k + 1);
  }

  return (
    <div className="mx-auto max-w-sm px-4 py-12 flex flex-col gap-6">
      <div className="text-center">
        <span className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-brand-50 text-brand-500">
          <ShieldCheck className="h-7 w-7" strokeWidth={1.75} aria-hidden />
        </span>
        <h1 className="font-display text-2xl font-semibold text-ink-900 mt-3">Verify your number</h1>
        <p className="text-sm text-ink-400 mt-1">
          We sent a code to <span className="font-semibold text-ink-800">+977 {phone}</span>
        </p>
      </div>

      {/* Demo mode banner — explicit per blueprint, since there's no real SMS provider */}
      <div className="rounded-xl2 border border-gold-200 bg-gold-50 px-4 py-3 text-center text-sm text-ink-800">
        Demo mode — your code is <span className="font-bold tracking-wider">{MOCK_OTP}</span>
      </div>

      <div className="flex flex-col items-center gap-3">
        <OtpInput onComplete={handleComplete} resetKey={resetKey} disabled={status === "verifying" || status === "success"} />

        {status === "error" && (
          <p className="text-sm text-brand-500 font-medium animate-fade-in">Incorrect code — try again.</p>
        )}
        {status === "verifying" && (
          <p className="text-sm text-ink-400 flex items-center gap-2">
            <Loader2 className="h-3.5 w-3.5 animate-spin text-brand-500" strokeWidth={2} aria-hidden />
            Verifying…
          </p>
        )}
        {status === "success" && (
          <p className="text-sm text-green-700 font-medium flex items-center gap-1.5 animate-fade-in">
            <CheckCircle2 className="h-4 w-4" strokeWidth={2} aria-hidden />
            Verified
          </p>
        )}
      </div>

      <div className="flex items-center justify-between text-sm">
        <Link href="/login" className="flex items-center gap-1 text-ink-400 hover:text-ink-600">
          <ArrowLeft className="h-3.5 w-3.5" strokeWidth={2} aria-hidden />
          Change number
        </Link>
        {countdown > 0 ? (
          <span className="text-ink-400">Resend in {countdown}s</span>
        ) : (
          <button type="button" onClick={handleResend} className="text-brand-500 font-semibold">
            Resend code
          </button>
        )}
      </div>
    </div>
  );
}

export default function OtpPage() {
  return (
    <Suspense fallback={<div className="mx-auto max-w-sm px-4 py-12" />}>
      <OtpContent />
    </Suspense>
  );
}
