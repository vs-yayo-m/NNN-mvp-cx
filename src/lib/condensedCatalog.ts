// src/lib/condensedCatalog.ts
// Builds the condensed menu catalog sent to Groq — id, name, category, tags,
// veg flag only (no descriptions/prices) to keep the prompt small and fast,
// per blueprint §8.2. Shared by both AI route handlers so the "only real
// menu IDs" contract lives in exactly one place.
// ============================================================================

import { getAvailableMenuItems } from "@/data/menu";

export interface CondensedMenuItem {
  id: string;
  name: string;
  category: string;
  tags: string[];
  veg: boolean;
}

export function getCondensedCatalog(): CondensedMenuItem[] {
  return getAvailableMenuItems().map((item) => ({
    id: item.id,
    name: item.name,
    category: item.categoryId,
    tags: item.tags,
    veg: item.isVeg,
  }));
}

/** The set of every valid, currently-available menu item id — used to
 * validate and filter whatever ids Groq returns, so a hallucinated id can
 * never reach the client. */
export function getValidMenuItemIds(): Set<string> {
  return new Set(getAvailableMenuItems().map((item) => item.id));
}
