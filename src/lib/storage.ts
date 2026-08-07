// /src/lib/storage.ts
// ============================================================================
// Typed localStorage helpers. Every store (cart/auth/order/vegMode) goes
// through these functions instead of calling localStorage directly, so
// swapping in a real backend later means changing THIS file (and the store
// functions that call it), never the components.
// ============================================================================

const STORAGE_PREFIX = "nomnomnow:";

/** Safe check — localStorage doesn't exist during server-side rendering. */
function isBrowser(): boolean {
  return typeof window !== "undefined";
}

export function readStorage<T>(key: string, fallback: T): T {
  if (!isBrowser()) return fallback;
  try {
    const raw = window.localStorage.getItem(STORAGE_PREFIX + key);
    if (raw === null) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    // Corrupt data should never crash the app — fall back silently.
    return fallback;
  }
}

export function writeStorage<T>(key: string, value: T): void {
  if (!isBrowser()) return;
  try {
    window.localStorage.setItem(STORAGE_PREFIX + key, JSON.stringify(value));
  } catch {
    // Storage full or unavailable (e.g. private browsing) — fail silently
    // rather than breaking the user's flow.
  }
}

export function removeStorage(key: string): void {
  if (!isBrowser()) return;
  try {
    window.localStorage.removeItem(STORAGE_PREFIX + key);
  } catch {
    // no-op
  }
}

export const STORAGE_KEYS = {
  cart: "cart",
  auth: "auth",
  orders: "orders",
  knownPhones: "known-phones",
  loginReturnContext: "login-return-context",
  recurringOrders: "recurring-orders",
  addresses: "addresses",
  vegMode: "veg-mode",
} as const;