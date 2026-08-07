// /src/data/categories.ts
import type { Category } from "@/types";

export const categories: Category[] = [
  {
    id: "momo",
    label: "Momo",
    icon: "dumpling",
    image:
      "https://images.unsplash.com/photo-1626777553635-be0efaf25d05?q=80&w=600&h=750&fit=crop&auto=format",
    tagline: "Steamed & fried dumplings",
    sortOrder: 1,
    group: "food",
  },
  {
    id: "biryani",
    label: "Biryani",
    icon: "rice-bowl",
    image:
      "https://images.unsplash.com/photo-1642821373181-696a54913e93?q=80&w=600&h=750&fit=crop&auto=format",
    tagline: "Slow-cooked rice classics",
    sortOrder: 2,
    group: "food",
  },
  {
    id: "pizza",
    label: "Pizza",
    icon: "pizza",
    image:
      "https://images.unsplash.com/photo-1548369937-47519962c11a?q=80&w=600&h=750&fit=crop&auto=format",
    tagline: "Wood-fired & loaded",
    sortOrder: 3,
    group: "food",
  },
  {
    id: "burger",
    label: "Burger",
    icon: "sandwich",
    image:
      "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=600&h=750&fit=crop&auto=format",
    tagline: "Stacked & juicy",
    sortOrder: 4,
    group: "food",
  },
  {
    id: "chowmein",
    label: "Chowmein",
    icon: "noodles",
    image:
      "https://images.unsplash.com/photo-1585032226651-759b368d7246?q=80&w=600&h=750&fit=crop&auto=format",
    tagline: "Wok-tossed noodles",
    sortOrder: 5,
    group: "food",
  },
  {
    id: "thukpa",
    label: "Thukpa",
    icon: "soup",
    image:
      "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?q=80&w=600&h=750&fit=crop&auto=format",
    tagline: "Himalayan noodle soup",
    sortOrder: 6,
    group: "food",
  },
  {
    id: "khaja-set",
    label: "Khaja Set",
    icon: "package",
    image:
      "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?q=80&w=600&h=750&fit=crop&auto=format",
    tagline: "Traditional platter",
    sortOrder: 7,
    group: "food",
  },
  {
    id: "nepali-snacks",
    label: "Nepali Snacks",
    icon: "flame",
    image:
      "https://images.unsplash.com/photo-1601050690597-df0568f70950?q=80&w=600&h=750&fit=crop&auto=format",
    tagline: "Spiced local bites",
    sortOrder: 8,
    group: "food",
  },
  {
    id: "roti",
    label: "Roti",
    icon: "circle",
    image:
      "https://images.unsplash.com/photo-1626132647523-66f5bf380027?q=80&w=600&h=750&fit=crop&auto=format",
    tagline: "Fresh flatbread",
    sortOrder: 9,
    group: "food",
  },
  {
    id: "salad",
    label: "Salad",
    icon: "salad",
    image:
      "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=600&h=750&fit=crop&auto=format",
    tagline: "Fresh & light",
    sortOrder: 10,
    group: "food",
  },
  {
    id: "rice",
    label: "Rice",
    icon: "rice-bowl",
    image:
      "https://images.unsplash.com/photo-1512058564366-18510be2db19?q=80&w=600&h=750&fit=crop&auto=format",
    tagline: "Steamed & fried",
    sortOrder: 11,
    group: "food",
  },
  {
    id: "beer",
    label: "Beer",
    icon: "beer",
    image:
      "https://images.unsplash.com/photo-1608270586620-248524c67de9?q=80&w=600&h=750&fit=crop&auto=format",
    tagline: "Cold & crafted",
    sortOrder: 12,
    group: "bar",
  },
  {
    id: "whisky",
    label: "Whisky",
    icon: "whisky",
    image:
      "https://images.unsplash.com/photo-1527281400683-1aae777175f8?q=80&w=600&h=750&fit=crop&auto=format",
    tagline: "Neat or on the rocks",
    sortOrder: 13,
    group: "bar",
  },
  {
    id: "wine",
    label: "Wine",
    icon: "wine",
    image:
      "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?q=80&w=600&h=750&fit=crop&auto=format",
    tagline: "Red, white & rosé",
    sortOrder: 14,
    group: "bar",
  },
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
