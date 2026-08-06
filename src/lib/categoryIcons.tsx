// ============================================================================
// categoryIcons.tsx — maps the string icon names used in data/categories.ts
// to actual Lucide icon components. Kept separate from data/categories.ts
// so that file can stay a plain data module with no React/JSX dependency.
//
// Lucide doesn't ship literal "dumpling" or "noodles" icons, so names below
// map to the closest semantically-appropriate icon rather than a literal
// match — e.g. momo (a dumpling dish) uses UtensilsCrossed, chowmein
// (noodles) uses Soup. This keeps every category rendering a real, crisp
// vector icon instead of an emoji.
// ============================================================================

import {
  UtensilsCrossed,
  ChefHat,
  Pizza,
  Sandwich,
  Soup,
  Package,
  Flame,
  Circle,
  Salad,
  Beer,
  Wine,
  Martini,
  type LucideIcon,
} from "lucide-react";

export const CATEGORY_ICON_MAP: Record<string, LucideIcon> = {
  dumpling: UtensilsCrossed,
  "rice-bowl": ChefHat,
  pizza: Pizza,
  sandwich: Sandwich,
  noodles: Soup,
  soup: Soup,
  package: Package,
  flame: Flame,
  circle: Circle,
  salad: Salad,
  beer: Beer,
  wine: Wine,
  whisky: Martini,
};

/** Falls back to UtensilsCrossed for any unrecognized icon name so a typo
 * in category data never renders a blank space. */
export function getCategoryIcon(iconName: string): LucideIcon {
  return CATEGORY_ICON_MAP[iconName] ?? UtensilsCrossed;
}
