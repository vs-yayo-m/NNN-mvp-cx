const isBrowser = () => typeof window !== "undefined";

export function readStorage<T>(key: string, fallback: T): T {
  if (!isBrowser()) return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export function writeStorage<T>(key: string, value: T): void {
  if (!isBrowser()) return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // storage full or unavailable \u2014 fail silently in this prototype
  }
}

export const STORAGE_KEYS = {
  cart: "nnn_cart_v1",
  orders: "nnn_orders_v1",
  guest: "nnn_guest_v1",
  recentSearches: "nnn_recent_searches_v1",
};
