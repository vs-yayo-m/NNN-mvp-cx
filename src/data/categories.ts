import type { Category } from "@/types";

// NOTE FOR OWNER: This is placeholder category data structured to match the
// blueprint's real menu shape (Salad, Sandwich, Burger, Snacks, Rolls, Roti,
// Pizza, Khaja Set, Biryani, Thukpa, Chowmein, Nepali Snacks, Rice, Momo,
// plus a separate Bar group: Beer, Wine, Whisky, Vodka, Rum, Shots, Smoke).
// The `icon` field holds a Lucide icon name (see lib/categoryIcons.tsx for
// the name -> component lookup) rather than an emoji, so every category
// renders with a proper vector icon. Swap labels/icons freely — nothing
// else in the app needs to change as long as the icon name exists in
// lib/categoryIcons.tsx's CATEGORY_ICON_MAP.
export const categories: Category[] = [
  { id: "momo", label: "Momo", icon: "dumpling", sortOrder: 1, group: "food" },
  { id: "biryani", label: "Biryani", icon: "rice-bowl", sortOrder: 2, group: "food" },
  { id: "pizza", label: "Pizza", icon: "pizza", sortOrder: 3, group: "food" },
  { id: "burger", label: "Burger", icon: "sandwich", sortOrder: 4, group: "food" },
  { id: "chowmein", label: "Chowmein", icon: "noodles", sortOrder: 5, group: "food" },
  { id: "thukpa", label: "Thukpa", icon: "soup", sortOrder: 6, group: "food" },
  { id: "khaja-set", label: "Khaja Set", icon: "package", sortOrder: 7, group: "food" },
  { id: "nepali-snacks", label: "Nepali Snacks", icon: "flame", sortOrder: 8, group: "food" },
  { id: "roti", label: "Roti", icon: "circle", sortOrder: 9, group: "food" },
  { id: "salad", label: "Salad", icon: "salad", sortOrder: 10, group: "food" },
  { id: "rice", label: "Rice", icon: "rice-bowl", sortOrder: 11, group: "food" },
  { id: "beer", label: "Beer", icon: "beer", sortOrder: 12, group: "bar" },
  { id: "whisky", label: "Whisky", icon: "whisky", sortOrder: 13, group: "bar" },
  { id: "wine", label: "Wine", icon: "wine", sortOrder: 14, group: "bar" },
];

export function getCategoryById(id: string): Category | undefined {
  return categories.find((c) => c.id === id);
}

export const foodCategories = categories
  .filter((c) => c.group === "food")
  .sort((a, b) => a.sortOrder - b.sortOrder);

export const barCategories = categories
  .filter((c) => c.group === "bar")
  .sort((a, b) => a.sortOrder - b.sortOrder);
