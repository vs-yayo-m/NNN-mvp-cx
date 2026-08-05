"use client";

// ============================================================================
// OtpInput — 4 segmented boxes. Numeric keyboard, auto-focus-advance,
// backspace-to-previous, paste support (pasting "1234" fills all boxes),
// and auto-submit when the 4th digit is entered.
// ============================================================================

import { useRef, useState, useEffect } from "react";

interface OtpInputProps {
  length?: number;
  onComplete: (code: string) => void;
  /** Clears/resets the boxes — bump this value to force a reset (e.g. after "Resend"). */
  resetKey?: number;
  disabled?: boolean;
}

export default function OtpInput({ length = 4, onComplete, resetKey, disabled }: OtpInputProps) {
  const [digits, setDigits] = useState<string[]>(Array(length).fill(""));
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    setDigits(Array(length).fill(""));
    inputRefs.current[0]?.focus();
  }, [resetKey, length]);

  function handleChange(index: number, value: string) {
    const digit = value.replace(/\D/g, "").slice(-1);
    const next = [...digits];
    next[index] = digit;
    setDigits(next);

    if (digit && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }

    if (next.every((d) => d !== "") && next.join("").length === length) {
      onComplete(next.join(""));
    }
  }

  function handleKeyDown(index: number, e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Backspace" && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  }

  function handlePaste(e: React.ClipboardEvent<HTMLInputElement>) {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, length);
    if (!pasted) return;
    const next = Array(length).fill("");
    for (let i = 0; i < pasted.length; i++) next[i] = pasted[i];
    setDigits(next);
    const lastIndex = Math.min(pasted.length, length) - 1;
    inputRefs.current[lastIndex]?.focus();
    if (pasted.length === length) {
      onComplete(pasted);
    }
  }

  return (
    <div className="flex items-center gap-3 justify-center">
      {digits.map((digit, index) => (
        <input
          key={index}
          ref={(el) => {
            inputRefs.current[index] = el;
          }}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={digit}
          disabled={disabled}
          onChange={(e) => handleChange(index, e.target.value)}
          onKeyDown={(e) => handleKeyDown(index, e)}
          onPaste={handlePaste}
          className="h-14 w-12 sm:h-16 sm:w-14 rounded-xl2 border-2 border-ink-100 bg-cream-100 text-center text-2xl font-semibold text-ink-900 outline-none focus:border-brand-400 transition-colors disabled:opacity-50"
        />
      ))}
    </div>
  );
}
