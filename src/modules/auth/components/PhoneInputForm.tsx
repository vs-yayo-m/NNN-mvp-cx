"use client";

// ============================================================================
// PhoneInputForm — Login Screen 1 per blueprint §3.2. Single field, +977
// prefix shown but not editable in MVP, basic client-side format validation.
// ============================================================================

import { useState } from "react";
import { isValidNepaliPhone } from "@/lib/utils";

interface PhoneInputFormProps {
  onSubmit: (phone: string) => void;
  initialPhone?: string;
}

export default function PhoneInputForm({ onSubmit, initialPhone = "" }: PhoneInputFormProps) {
  const [phone, setPhone] = useState(initialPhone);
  const [touched, setTouched] = useState(false);

  const isValid = isValidNepaliPhone(phone);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setTouched(true);
    if (isValid) onSubmit(phone.trim());
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div>
        <label htmlFor="phone" className="block text-sm font-semibold text-ink-800 mb-2">
          Mobile Number
        </label>
        <div
          className={`flex items-center rounded-xl2 border bg-cream-100 px-4 py-3.5 transition-colors ${
            touched && !isValid ? "border-brand-500" : "border-ink-100 focus-within:border-brand-400"
          }`}
        >
          <span className="text-ink-600 font-medium pr-3 border-r border-ink-100 mr-3">+977</span>
          <input
            id="phone"
            type="tel"
            inputMode="numeric"
            autoComplete="tel-national"
            placeholder="98XXXXXXXX"
            value={phone}
            onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
            className="flex-1 bg-transparent outline-none text-ink-900 placeholder:text-ink-400"
          />
        </div>
        {touched && !isValid && (
          <p className="mt-1.5 text-xs text-brand-500">Enter a valid 10-digit mobile number.</p>
        )}
      </div>

      <button
        type="submit"
        disabled={!phone}
        className="rounded-full bg-brand-500 px-5 py-3.5 font-semibold text-cream-100 hover:bg-brand-600 disabled:opacity-40 disabled:hover:bg-brand-500 transition-colors"
      >
        Continue
      </button>
    </form>
  );
}
