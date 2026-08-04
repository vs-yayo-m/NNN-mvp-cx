"use client";

// ============================================================================
// Login — Screen 1: Phone Entry, per blueprint §3.2 step 2.
// On submit, stores the phone in sessionStorage-equivalent (just passed via
// query param to keep this simple and reload-safe) and moves to OTP screen.
// ============================================================================

import { useRouter } from "next/navigation";
import PhoneInputForm from "@/modules/auth/components/PhoneInputForm";

export default function LoginPage() {
  const router = useRouter();

  function handlePhoneSubmit(phone: string) {
    router.push(`/login/otp?phone=${phone}`);
  }

  return (
    <div className="mx-auto max-w-sm px-4 py-12 flex flex-col gap-6">
      <div className="text-center">
        <span className="text-4xl" aria-hidden>
          👋
        </span>
        <h1 className="font-display text-2xl font-semibold text-ink-900 mt-3">Welcome</h1>
        <p className="text-sm text-ink-400 mt-1">
          Enter your mobile number to log in or create an account.
        </p>
      </div>

      <PhoneInputForm onSubmit={handlePhoneSubmit} />

      <p className="text-xs text-ink-400 text-center">
        By continuing, you agree to receive order updates via SMS.
      </p>
    </div>
  );
}
