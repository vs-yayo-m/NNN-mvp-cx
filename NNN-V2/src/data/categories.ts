import type { Category } from "@/types";

// NOTE FOR OWNER: This is placeholder category data structured to match the
// blueprint's real menu shape (Salad, Sandwich, Burger, Snacks, Rolls, Roti,
// Pizza, Khaja Set, Biryani, Thukpa, Chowmein, Nepali Snacks, Rice, Momo,
// plus a separate Bar group: Beer, Wine, Whisky, Vodka, Rum, Shots, Smoke).
// Swap labels/icons freely — nothing else in the app needs to change.
export const categories: Category[] = [
  { id: "momo", label: "Momo", icon: "🥟", sortOrder: 1, group: "food" },
  { id: "biryani", label: "Biryani", icon: "🍛", sortOrder: 2, group: "food" },
  { id: "pizza", label: "Pizza", icon: "🍕", sortOrder: 3, group: "food" },
  { id: "burger", label: "Burger", icon: "🍔", sortOrder: 4, group: "food" },
  { id: "chowmein", label: "Chowmein", icon: "🍜", sortOrder: 5, group: "food" },
  { id: "thukpa", label: "Thukpa", icon: "🥣", sortOrder: 6, group: "food" },
  { id: "khaja-set", label: "Khaja Set", icon: "🍱", sortOrder: 7, group: "food" },
  { id: "nepali-snacks", label: "Nepali Snacks", icon: "🌶️", sortOrder: 8, group: "food" },
  { id: "roti", label: "Roti", icon: "🫓", sortOrder: 9, group: "food" },
  { id: "salad", label: "Salad", icon: "🥗", sortOrder: 10, group: "food" },
  { id: "rice", label: "Rice", icon: "🍚", sortOrder: 11, group: "food" },
  { id: "beer", label: "Beer", icon: "🍺", sortOrder: 12, group: "bar" },
  { id: "whisky", label: "Whisky", icon: "🥃", sortOrder: 13, group: "bar" },
  { id: "wine", label: "Wine", icon: "🍷", sortOrder: 14, group: "bar" },
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
