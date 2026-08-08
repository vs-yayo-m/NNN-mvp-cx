 
// src/data/menu.ts
import type { MenuItem } from "@/types";

export const menuItems: MenuItem[] = [
  // ------------------------------------------------------------------ MOMO
  {
    id: "momo-veg",
    categoryId: "momo",
    name: "Vegetable Momo",
    description: "Steam, Fry, Chilly, Kothey, jhol and Sadeko are available",
    image: "https://images.unsplash.com/photo-1694923450868-b432a8ee52aa?q=80&w=800&auto=format&fit=crop",
    isVeg: true,
    isAvailable: true,
    isPopular: true,
    isTodaysSpecial: false,
    tags: ["bestseller", "steamed"],
    variants: [
      { label: "Steam", price: 140 },
      { label: "Fry", price: 150 },
      { label: "Chilly", price: 195 },
      { label: "Kothey", price: 230 },
      { label: "Jhol", price: 235 },
      { label: "Sadeko", price: 235 },
    ],
  },
  {
    id: "momo-chicken",
    categoryId: "momo",
    name: "Chicken Momo",
    description: "Steam, Fry, Chilly, Kothey, jhol and Sadeko are available",
    image: "https://plus.unsplash.com/premium_photo-1673769108032-83c49135e142?w=1200&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8Y2hpY2tlbiUyMG1vbW98ZW58MHx8MHx8fDA%3D",
    isVeg: false,
    isAvailable: true,
    isPopular: true,
    isTodaysSpecial: true,
    tags: ["bestseller", "spicy"],
    variants: [
      { label: "Steam", price: 190 },
      { label: "Fry", price: 210 },
      { label: "Chilly", price: 250 },
      { label: "Kothey", price: 270 },
      { label: "Jhol", price: 270 },
      { label: "Sadeko", price: 265 },
    ],
  },
  {
    id: "momo-buff",
    categoryId: "momo",
    name: "Buff Momo",
    description: "Steam, Fry, Chilly, Kothey, jhol and Sadeko are available.",
    image: "https://plus.unsplash.com/premium_photo-1661600407445-f672740d5c53?w=1200&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8bW9tb3N8ZW58MHx8MHx8fDA%3D",
    isVeg: false,
    isAvailable: true,
    isPopular: true,
    isTodaysSpecial: false,
    tags: ["spicy", "local-favorite"],
    variants: [
      { label: "Steam", price: 180 },
      { label: "Fry", price: 200 },
      { label: "Chilly", price: 250 },
      { label: "Kothey", price: 265 },
      { label: "Jhol", price: 270 },
      { label: "Sadeko", price: 265 },
    ],
  },
  {
    id: "momo-double-trouble-platter",
    categoryId: "momo",
    name: "Double Trouble Momo Platter",
    description: "Veg , Chicken and Buff options are available.",
    image: "https://images.unsplash.com/photo-1664990035720-faac522df41f?w=1200&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8RG91YmxlJTIwVHJvdWJsZSUyME1vbW8lMjBQbGF0dGVyfGVufDB8fDB8fHww",
    isVeg: null,
    isAvailable: true,
    isPopular: true,
    isTodaysSpecial: true,
    tags: ["sharing", "bestseller"],
    variants: [
      { label: "Veg",
        price: 290 },
      { label: "Chicken",
        price: 340 },
      { label: "Buff",
        price: 330 
      }
    ],
  },

  // BIRYANI
  {
    id: "biryani-chicken",
    categoryId: "biryani",
    name: "Chicken Biryani",
    description: "Slow-cooked basmati layered with spiced chicken, fried onion, and saffron.",
    image: "https://images.unsplash.com/photo-1719239885399-f87d992e0f18?q=80&w=1287&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
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
    image: "https://images.unsplash.com/photo-1697155406055-2db32d47ca07?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
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
    image: "https://images.unsplash.com/photo-1631451680425-642e782583ac?w=1200&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8ZWdncyUyMGJpcnlhbml8ZW58MHx8MHx8fDA%3D",
    isVeg: false,
    isAvailable: true,
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
    id: "mix-veg-pizza",
    categoryId: "pizza",
    name: "Mix Veg Pizza",
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
    id: "chicken-veg-pizza",
    categoryId: "pizza",
    name: "Chicken Pizza",
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
    name: "Chicken Burger",
    description: "Buttermilk-fried chicken thigh, house slaw, chipotle mayo, brioche bun.",
    image: "https://images.unsplash.com/photo-1606755962773-d324e0a13086?w=1200&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8Y2hpY2tlbiUyMEJ1cmdlcnxlbnwwfHwwfHx8MA%3D%3D",
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
    name: "Veg Burger",
    description: "Spiced potato-vegetable patty, lettuce, tomato, tangy mayo.",
    image: "https://images.unsplash.com/photo-1586190848861-99aa4a171e90?w=1200&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8dmVnJTIwQnVyZ2VyfGVufDB8fDB8fHww",
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
    image: "https://images.unsplash.com/photo-1757445060049-0531425f8643?w=1200&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8VmVnZXRhYmxlJTIwQ2hvd21laW58ZW58MHx8MHx8fDA%3D",
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
    image: "https://images.unsplash.com/photo-1595678522254-781a08ef8579?w=1200&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8Y2hpY2tlbiUyMHRodWtwYSUyMGZvb2R8ZW58MHx8MHx8fDA%3D",
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
    image: "https://plus.unsplash.com/premium_photo-1664392038033-e1f7054a3c59?w=1200&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8dmVnJTIwdGh1a3BhJTIwZm9vZHxlbnwwfHwwfHx8MA%3D%3D",
    isVeg: true,
    isAvailable: true,
    isPopular: false,
    isTodaysSpecial: false,
    tags: [],
    variants: [{ label: "Bowl", price: 220 }],
  },

// ---------------------------------------------------------- KHAJA SET
{
  id: "khaja-set-veg",
  categoryId: "khaja-set",
  name: "Veg Khaja Set",
  description:
    "Paneer pakoda, sadheko bhatmas, piro aloo, Nepali achar, and potato wages.",
  image:
    "https://images.unsplash.com/photo-1671970922492-4d2a4c7a2ffe?w=1200&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8VmVnJTIwS2hhamElMjBTZXR8ZW58MHx8MHx8fDA%3D",
  isVeg: true,
  isAvailable: true,
  isPopular: true,
  isTodaysSpecial: true,
  tags: ["traditional", "bestseller"],
  variants: [
    {
      label: "Full Set",
      price: 360,
    },
  ],
},

{
  id: "khaja-set-non-veg",
  categoryId: "khaja-set",
  name: "Non Veg Khaja Set",
  description:
    "Bhutuwa, duck choila, palpali chicken, Nepali achar, served with cheura bhatmas.",
  image:
    "https://images.unsplash.com/photo-1559561724-732dbca7be1e?w=1200&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTF8fE5vbiUyMHZlZyUyMEtoYWphJTIwU2V0fGVufDB8fDB8fHww",
  isVeg: false,
  isAvailable: true,
  isPopular: true,
  isTodaysSpecial: false,
  tags: ["traditional", "bestseller"],
  variants: [
    {
      label: "Full Set",
      price: 490,
    },
  ],
},

  // -----------------------------------------------------------   SNACKS
  {
    id: "french-fries",
    categoryId: "snacks",
    name: "French Fries",
    description: "Crisp-fried spiced potato patties",
    image: "https://images.unsplash.com/photo-1529193591184-b1d58069ecdd?w=800&q=80",
    isVeg: true,
    isAvailable: true,
    isPopular: true,
    isTodaysSpecial: false,
    tags: ["spicy", "grilled"],
    variants: [{ label: "Plate", price: 380 }],
  },
  {
    id: "hot-wings",
    categoryId: "snacks",
    name: "Hot Wings",
    description: "Crisp-fried chicken Hot wings.",
    image: "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=800&q=80",
    isVeg: true,
    isAvailable: true,
    isPopular: true,
    isTodaysSpecial: false,
    tags: ["snack"],
    variants: [{ label: "Plate (1 pcs)", price: 360 }],
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
