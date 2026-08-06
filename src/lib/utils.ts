// ============================================================================
// Small shared utilities used across components and stores.
// ============================================================================

/** Formats a number as Nepali Rupees, e.g. formatCurrency(1250) -> "Rs. 1,250" */
export function formatCurrency(amount: number): string {
  const rounded = Math.round(amount);
  return `Rs. ${rounded.toLocaleString("en-IN")}`;
}

/** Generates a short unique id, e.g. for cart lines or local records. */
export function generateId(prefix = "id"): string {
  const random = Math.random().toString(36).slice(2, 9);
  const time = Date.now().toString(36).slice(-4);
  return `${prefix}_${time}${random}`;
}

/** Generates a human-friendly order number, e.g. "NNN-48213". */
export function generateOrderId(): string {
  const num = Math.floor(10000 + Math.random() * 89999);
  return `NNN-${num}`;
}

/** Debounce helper — returns a debounced version of `fn`. */
export function debounce<Args extends unknown[]>(
  fn: (...args: Args) => void,
  delayMs: number
): (...args: Args) => void {
  let timeoutId: ReturnType<typeof setTimeout> | null = null;
  return (...args: Args) => {
    if (timeoutId) clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn(...args), delayMs);
  };
}

/** Simulates realistic network latency so loading states feel real in the demo. */
export function simulateLatency(minMs = 300, maxMs = 900): Promise<void> {
  const delay = minMs + Math.random() * (maxMs - minMs);
  return new Promise((resolve) => setTimeout(resolve, delay));
}

/** Basic Nepali mobile number validation — 10 digits, starts with 9. */
export function isValidNepaliPhone(phone: string): boolean {
  return /^9\d{9}$/.test(phone.trim());
}

/** Masks a phone number for display, e.g. "9812345678" -> "98123 45•••" */
export function maskPhone(phone: string): string {
  if (phone.length < 10) return phone;
  return `${phone.slice(0, 5)} ${phone.slice(5, 7)}•••`;
}
