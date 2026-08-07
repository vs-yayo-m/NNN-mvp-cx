 
// src/data/menu.ts
import type { MenuItem } from "@/types";

export const menuItems: MenuItem[] = [
  // ------------------------------------------------------------------ MOMO
  {
    id: "momo-veg",
    categoryId: "momo",
    name: "Vegetable Momo",
    description: "Steamed dumplings packed with finely chopped seasonal vegetables and Himalayan herbs.",
    image: "https://images.unsplash.com/photo-1694923450868-b432a8ee52aa?q=80&w=800&auto=format&fit=crop",
    isVeg: true,
    isAvailable: true,
    isPopular: true,
    isTodaysSpecial: false,
    tags: ["bestseller", "steamed"],
    variants: [
      { label: "Steam", price: 180 },
      { label: "Fry", price: 200 },
      { label: "Chilly", price: 220 },
      { label: "Kothey", price: 210 },
      { label: "Jhol", price: 210 },
      { label: "Sadeko", price: 210 },
    ],
  },
  {
    id: "momo-chicken",
    categoryId: "momo",
    name: "Chicken Momo",
    description: "Juicy minced chicken dumplings, hand-folded and served with our house tomato achar.",
    image: "https://images.unsplash.com/photo-1541833931-38a2b1d33f2c?w=800&q=80",
    isVeg: false,
    isAvailable: true,
    isPopular: true,
    isTodaysSpecial: true,
    tags: ["bestseller", "spicy"],
    variants: [
      { label: "Steam", price: 220 },
      { label: "Fry", price: 240 },
      { label: "Chilly", price: 260 },
      { label: "Kothey", price: 250 },
      { label: "Jhol", price: 250 },
      { label: "Sadeko", price: 250 },
    ],
  },
  {
    id: "momo-buff",
    categoryId: "momo",
    name: "Buff Momo",
    description: "A Kathmandu classic — minced water-buffalo dumplings with a bold, peppery finish.",
    image: "https://images.unsplash.com/photo-1585032226651-759b368d7246?w=800&q=80",
    isVeg: false,
    isAvailable: true,
    isPopular: true,
    isTodaysSpecial: false,
    tags: ["spicy", "local-favorite"],
    variants: [
      { label: "Steam", price: 200 },
      { label: "Fry", price: 220 },
      { label: "Chilly", price: 240 },
      { label: "Kothey", price: 230 },
      { label: "Jhol", price: 230 },
      { label: "Sadeko", price: 230 },
    ],
  },
  {
    id: "momo-double-trouble-platter",
    categoryId: "momo",
    name: "Double Trouble Momo Platter",
    description: "Half chicken, half veg — steam and fry side by side, built for sharing.",
    image: "https://images.unsplash.com/photo-1496116218417-1a781b1c416c?w=800&q=80",
    isVeg: false,
    isAvailable: true,
    isPopular: true,
    isTodaysSpecial: true,
    tags: ["sharing", "bestseller"],
    variants: [{ label: "Full Platter", price: 480 }],
  },

  // -------------------------------------------------------------- BIRYANI
  {
    id: "biryani-chicken",
    categoryId: "biryani",
    name: "Chicken Biryani",
    description: "Slow-cooked basmati layered with spiced chicken, fried onion, and saffron.",
    image: "https://images.unsplash.com/photo-1563379091339-03246963d96c?w=800&q=80",
    isVeg: false,
    isAvailable: true,
    isPopular: true,
    isTodaysSpecial: false,
    tags: ["bestseller", "spicy"],
    variants: [
      { label: "Half", price: 260 },
      { label: "Full", price: 420 },
    ],
  },
  {
    id: "biryani-veg",
    categoryId: "biryani",
    name: "Vegetable Biryani",
    description: "Fragrant basmati with garden vegetables, cashew, and whole garam masala.",
    image: "https://images.unsplash.com/photo-1596797038530-2c107229654b?w=800&q=80",
    isVeg: true,
    isAvailable: true,
    isPopular: false,
    isTodaysSpecial: false,
    tags: ["mild"],
    variants: [
      { label: "Half", price: 220 },
      { label: "Full", price: 360 },
    ],
  },
  {
    id: "biryani-egg",
    categoryId: "biryani",
    name: "Egg Biryani",
    description: "Classic dum-style biryani topped with a spiced boiled egg.",
    image: "https://images.unsplash.com/photo-1642821373181-696a54913e93?w=800&q=80",
    isVeg: false,
    isAvailable: false,
    isPopular: false,
    isTodaysSpecial: false,
    tags: [],
    variants: [
      { label: "Half", price: 230 },
      { label: "Full", price: 380 },
    ],
  },

  // ---------------------------------------------------------------- PIZZA
  {
    id: "pizza-margherita",
    categoryId: "pizza",
    name: "Margherita Pizza",
    description: "San Marzano tomato, fresh mozzarella, basil, stone-baked crust.",
    image: "https://images.unsplash.com/photo-1598023696416-0193a0bcd302?w=800&q=80",
    isVeg: true,
    isAvailable: true,
    isPopular: true,
    isTodaysSpecial: false,
    tags: ["classic"],
    variants: [
      { label: "8-inch", price: 350 },
      { label: "12-inch", price: 550 },
    ],
  },
  {
    id: "pizza-chicken-tikka",
    categoryId: "pizza",
    name: "Chicken Tikka Pizza",
    description: "Tandoor-charred chicken tikka, red onion, mint drizzle, mozzarella.",
    image: "https://images.unsplash.com/photo-1628840042765-356cda07504e?w=800&q=80",
    isVeg: false,
    isAvailable: true,
    isPopular: true,
    isTodaysSpecial: true,
    tags: ["bestseller", "spicy"],
    variants: [
      { label: "8-inch", price: 420 },
      { label: "12-inch", price: 680 },
    ],
  },
  {
    id: "pizza-veg-supreme",
    categoryId: "pizza",
    name: "Veg Supreme Pizza",
    description: "Bell pepper, mushroom, olive, sweet corn, red onion, mozzarella.",
    image: "https://images.unsplash.com/photo-1571407970349-bc81e7e96d47?w=800&q=80",
    isVeg: true,
    isAvailable: true,
    isPopular: false,
    isTodaysSpecial: false,
    tags: [],
    variants: [
      { label: "8-inch", price: 380 },
      { label: "12-inch", price: 600 },
    ],
  },

  // --------------------------------------------------------------- BURGER
  {
    id: "burger-chicken",
    categoryId: "burger",
    name: "Crispy Chicken Burger",
    description: "Buttermilk-fried chicken thigh, house slaw, chipotle mayo, brioche bun.",
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&q=80",
    isVeg: false,
    isAvailable: true,
    isPopular: true,
    isTodaysSpecial: false,
    tags: ["bestseller"],
    variants: [{ label: "Regular", price: 320 }],
  },
  {
    id: "burger-veg",
    categoryId: "burger",
    name: "Veg Cutlet Burger",
    description: "Spiced potato-vegetable patty, lettuce, tomato, tangy mayo.",
    image: "https://images.unsplash.com/photo-1550317138-10000687a72b?w=800&q=80",
    isVeg: true,
    isAvailable: true,
    isPopular: false,
    isTodaysSpecial: false,
    tags: [],
    variants: [{ label: "Regular", price: 240 }],
  },

  // ------------------------------------------------------------ CHOWMEIN
  {
    id: "chowmein-chicken",
    categoryId: "chowmein",
    name: "Chicken Chowmein",
    description: "Wok-tossed noodles, chicken, cabbage, carrot, spring onion.",
    image: "https://images.unsplash.com/photo-1585032226651-759b368d7246?w=800&q=80",
    isVeg: false,
    isAvailable: true,
    isPopular: true,
    isTodaysSpecial: false,
    tags: ["bestseller"],
    variants: [
      { label: "Half", price: 180 },
      { label: "Full", price: 260 },
    ],
  },
  {
    id: "chowmein-veg",
    categoryId: "chowmein",
    name: "Vegetable Chowmein",
    description: "Wok-tossed noodles with seasonal vegetables and a light soy glaze.",
    image: "https://images.unsplash.com/photo-1612929633738-8fe44f7ec841?w=800&q=80",
    isVeg: true,
    isAvailable: true,
    isPopular: false,
    isTodaysSpecial: false,
    tags: [],
    variants: [
      { label: "Half", price: 150 },
      { label: "Full", price: 220 },
    ],
  },

  // -------------------------------------------------------------- THUKPA
  {
    id: "thukpa-chicken",
    categoryId: "thukpa",
    name: "Chicken Thukpa",
    description: "Tibetan hand-pulled noodle soup, chicken, bok choy, warming broth.",
    image: "https://images.unsplash.com/photo-1591814468924-caf88d1232e1?w=800&q=80",
    isVeg: false,
    isAvailable: true,
    isPopular: true,
    isTodaysSpecial: false,
    tags: ["comfort-food"],
    variants: [{ label: "Bowl", price: 260 }],
  },
  {
    id: "thukpa-veg",
    categoryId: "thukpa",
    name: "Vegetable Thukpa",
    description: "Hearty noodle soup with seasonal vegetables in a warming broth.",
    image: "https://images.unsplash.com/photo-1547592166-23ac45744acd?w=800&q=80",
    isVeg: true,
    isAvailable: true,
    isPopular: false,
    isTodaysSpecial: false,
    tags: [],
    variants: [{ label: "Bowl", price: 220 }],
  },

  // ---------------------------------------------------------- KHAJA SET
  {
    id: "khaja-set-classic",
    categoryId: "khaja-set",
    name: "Classic Khaja Set",
    description: "Beaten rice, spiced potato, black-eyed bean sadeko, pickle, and a fried egg.",
    image: "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=800&q=80",
    isVeg: false,
    isAvailable: true,
    isPopular: true,
    isTodaysSpecial: true,
    tags: ["traditional", "bestseller"],
    variants: [{ label: "Full Set", price: 340 }],
  },

  // ----------------------------------------------------------- NEPALI SNACKS
  {
    id: "nepali-snacks-sekuwa",
    categoryId: "nepali-snacks",
    name: "Chicken Sekuwa",
    description: "Charcoal-grilled marinated chicken skewers, served with chiura and achar.",
    image: "https://images.unsplash.com/photo-1529193591184-b1d58069ecdd?w=800&q=80",
    isVeg: false,
    isAvailable: true,
    isPopular: true,
    isTodaysSpecial: false,
    tags: ["spicy", "grilled", "bar"],
    variants: [{ label: "Plate", price: 380 }],
  },
  {
    id: "nepali-snacks-aloo-chop",
    categoryId: "nepali-snacks",
    name: "Aloo Chop",
    description: "Crisp-fried spiced potato patties with tamarind chutney.",
    image: "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=800&q=80",
    isVeg: true,
    isAvailable: true,
    isPopular: false,
    isTodaysSpecial: false,
    tags: ["snack"],
    variants: [{ label: "Plate (6 pcs)", price: 160 }],
  },

  // --------------------------------------------------------------- ROTI
  {
    id: "roti-plain",
    categoryId: "roti",
    name: "Plain Roti",
    description: "Soft whole-wheat flatbread, made fresh to order.",
    image: "https://images.unsplash.com/photo-1626132647523-66c2b9e2e0a7?w=800&q=80",
    isVeg: true,
    isAvailable: true,
    isPopular: false,
    isTodaysSpecial: false,
    tags: [],
    variants: [{ label: "Piece", price: 40 }],
  },
  {
    id: "roti-butter",
    categoryId: "roti",
    name: "Butter Roti",
    description: "Whole-wheat flatbread finished with a brush of clarified butter.",
    image: "https://images.unsplash.com/photo-1626132647523-66c2b9e2e0a7?w=800&q=80",
    isVeg: true,
    isAvailable: true,
    isPopular: false,
    isTodaysSpecial: false,
    tags: [],
    variants: [{ label: "Piece", price: 55 }],
  },

  // -------------------------------------------------------------- SALAD
  {
    id: "salad-garden",
    categoryId: "salad",
    name: "Garden Fresh Salad",
    description: "Cucumber, tomato, red onion, carrot, house lemon-herb dressing.",
    image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&q=80",
    isVeg: true,
    isAvailable: true,
    isPopular: false,
    isTodaysSpecial: false,
    tags: ["light", "vegan"],
    variants: [{ label: "Bowl", price: 180 }],
  },

  // ---------------------------------------------------------------- RICE
  {
    id: "rice-plain-steamed",
    categoryId: "rice",
    name: "Steamed Rice",
    description: "Plain steamed basmati rice.",
    image: "https://images.unsplash.com/photo-1550367363-ea12860cc124?w=800&q=80",
    isVeg: true,
    isAvailable: true,
    isPopular: false,
    isTodaysSpecial: false,
    tags: [],
    variants: [
      { label: "Half", price: 80 },
      { label: "Full", price: 140 },
    ],
  },
  {
    id: "rice-fried-chicken",
    categoryId: "rice",
    name: "Chicken Fried Rice",
    description: "Wok-fried rice with chicken, egg, and garden vegetables.",
    image: "https://images.unsplash.com/photo-1512058564366-18510be2db19?w=800&q=80",
    isVeg: false,
    isAvailable: true,
    isPopular: true,
    isTodaysSpecial: false,
    tags: ["bestseller"],
    variants: [
      { label: "Half", price: 190 },
      { label: "Full", price: 280 },
    ],
  },

  // ---------------------------------------------------------------- BEER
  {
    id: "beer-gorkha",
    categoryId: "beer",
    name: "Gorkha Beer",
    description: "Crisp, locally brewed lager. Served ice cold.",
    image: "https://images.unsplash.com/photo-1608270586620-248524c67de9?w=800&q=80",
    isVeg: true,
    isAvailable: true,
    isPopular: true,
    isTodaysSpecial: false,
    tags: ["bar", "local"],
    isBarItem: true,
    variants: [{ label: "650ml", price: 350 }],
  },
  {
    id: "beer-tuborg",
    categoryId: "beer",
    name: "Tuborg Strong",
    description: "Bold, full-bodied strong lager.",
    image: "https://images.unsplash.com/photo-1614313511387-1436a4480ebb?w=800&q=80",
    isVeg: true,
    isAvailable: true,
    isPopular: false,
    isTodaysSpecial: false,
    tags: ["bar"],
    isBarItem: true,
    variants: [{ label: "650ml", price: 380 }],
  },

  // -------------------------------------------------------------- WHISKY
  {
    id: "whisky-signature",
    categoryId: "whisky",
    name: "Signature Blended Whisky",
    description: "House-select blended whisky, smooth and smoky finish.",
    image: "https://images.unsplash.com/photo-1569529465841-dfecdab7503b?w=800&q=80",
    isVeg: true,
    isAvailable: true,
    isPopular: true,
    isTodaysSpecial: true,
    tags: ["bar", "premium"],
    isBarItem: true,
    variants: [
      { label: "30ml", price: 220 },
      { label: "60ml", price: 400 },
      { label: "90ml", price: 580 },
      { label: "180ml", price: 1050 },
      { label: "360ml", price: 1950 },
      { label: "Full Bottle", price: 3600 },
    ],
  },
  {
    id: "whisky-single-malt",
    categoryId: "whisky",
    name: "Single Malt Reserve",
    description: "Aged single malt with notes of oak and honey.",
    image: "https://images.unsplash.com/photo-1527281400683-1aae777175f8?w=800&q=80",
    isVeg: true,
    isAvailable: true,
    isPopular: false,
    isTodaysSpecial: false,
    tags: ["bar", "premium"],
    isBarItem: true,
    variants: [
      { label: "30ml", price: 350 },
      { label: "60ml", price: 650 },
      { label: "90ml", price: 950 },
      { label: "180ml", price: 1750 },
      { label: "360ml", price: 3200 },
      { label: "Full Bottle", price: 5800 },
    ],
  },

  // ---------------------------------------------------------------- WINE
  {
    id: "wine-red-house",
    categoryId: "wine",
    name: "House Red Wine",
    description: "Medium-bodied red, smooth tannins, food-friendly.",
    image: "https://images.unsplash.com/photo-1553361371-9b22f78e8b1d?w=800&q=80",
    isVeg: true,
    isAvailable: true,
    isPopular: false,
    isTodaysSpecial: false,
    tags: ["bar"],
    isBarItem: true,
    variants: [
      { label: "Glass", price: 450 },
      { label: "Bottle", price: 2400 },
    ],
  },
  {
    id: "wine-white-house",
    categoryId: "wine",
    name: "House White Wine",
    description: "Crisp and light, notes of green apple and citrus.",
    image: "https://images.unsplash.com/photo-1566452348683-9426ba8dc0c9?w=800&q=80",
    isVeg: true,
    isAvailable: false,
    isPopular: false,
    isTodaysSpecial: false,
    tags: ["bar"],
    isBarItem: true,
    variants: [
      { label: "Glass", price: 450 },
      { label: "Bottle", price: 2400 },
    ],
  },
];

// ---------------------------------------------------------------------------
// Query helpers — components should go through these, never filter menuItems
// directly, so the "hide unavailable items" rule is enforced in one place.
//
// Every helper below now also accepts an optional `vegOnly` flag. When true,
// items with isVeg === false are excluded. Pages/components should pass the
// current `useVegMode().isVegOnly` value through — see Header.tsx for the
// toggle UI and vegModeStore.tsx for where that boolean lives globally.
// ---------------------------------------------------------------------------

export function getAvailableMenuItems(vegOnly = false): MenuItem[] {
  return menuItems.filter(
    (item) => item.isAvailable && (!vegOnly || item.isVeg)
  );
}

export function getMenuItemById(id: string): MenuItem | undefined {
  return menuItems.find((item) => item.id === id);
}

export function getItemsByCategory(categoryId: string, vegOnly = false): MenuItem[] {
  return getAvailableMenuItems(vegOnly).filter(
    (item) => item.categoryId === categoryId
  );
}

export function getTodaysSpecials(vegOnly = false): MenuItem[] {
  return getAvailableMenuItems(vegOnly).filter((item) => item.isTodaysSpecial);
}

export function getPopularItems(vegOnly = false): MenuItem[] {
  return getAvailableMenuItems(vegOnly).filter((item) => item.isPopular);
}
