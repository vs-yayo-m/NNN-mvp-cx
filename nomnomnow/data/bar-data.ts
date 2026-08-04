import { MenuItem, Variant } from "@/lib/types";

let n = 0;
const id = (p: string) => `bar-${p}-${n++}`;
const img = (text: string, bg: string, fg = "F5EFE6") =>
  `https://placehold.co/600x480/${bg}/${fg}?text=${encodeURIComponent(text)}`;

type Base = Partial<MenuItem> & { name: string; category: string; price?: number; variants?: Variant[] };

function build(bg: string) {
  return (b: Base): MenuItem => ({
    id: id(b.category.slice(0, 3).toLowerCase()),
    section: "bar",
    category: b.category,
    subcategory: b.subcategory,
    name: b.name,
    price: b.price,
    variants: b.variants,
    description: b.description,
    image: b.image ?? img(b.name, bg),
    isAvailable: b.isAvailable ?? true,
    isVeg: null,
    isPopular: b.isPopular ?? false,
    isSpecialToday: b.isSpecialToday ?? false,
    tags: b.tags ?? [],
    spiceLevel: 0,
  });
}

const soft = build("3E8560");
const smoke = build("262019");
const wine = build("6E2A3A");
const beer = build("B98418");
const spirit = build("2A2118");

const whiskyVariants = (m: Record<string, number>): Variant[] =>
  Object.entries(m).map(([label, price]) => ({ label, price }));

export const BAR_ITEMS: MenuItem[] = [
  // SOFT DRINKS
  soft({ category: "Soft Drinks", name: "Mineral Water", price: 35 }),
  soft({ category: "Soft Drinks", name: "Lemon Water", price: 30 }),
  soft({ category: "Soft Drinks", name: "Hot Lemon", price: 70 }),
  soft({ category: "Soft Drinks", name: "Hot Lemon with Honey", price: 100 }),
  soft({ category: "Soft Drinks", name: "Hot Lemon with Honey & Ginger", price: 120 }),
  soft({ category: "Soft Drinks", name: "Coke 250ml", price: 70, isPopular: true }),
  soft({ category: "Soft Drinks", name: "Sprite 250ml", price: 70 }),
  soft({ category: "Soft Drinks", name: "Lemon Sprite", price: 100 }),
  soft({ category: "Soft Drinks", name: "Red Bull", price: 140 }),
  soft({ category: "Soft Drinks", name: "Red Blue", price: 200 }),
  soft({ category: "Soft Drinks", name: "Real Cranberry (Full)", price: 410 }),

  // SHOTS
  spirit({ category: "Shots", name: "Jagermeister Shot", price: 400, isPopular: true }),
  spirit({ category: "Shots", name: "Jagermeister Full Bottle", price: 10950 }),

  // SMOKE
  smoke({ category: "Smoke", name: "Shikhar Ice", price: 30 }),
  smoke({ category: "Smoke", name: "Surya Red", price: 30 }),
  smoke({ category: "Smoke", name: "Surya Light", price: 30 }),
  smoke({ category: "Smoke", name: "Pan Mint Hookah", price: 400, isPopular: true }),
  smoke({ category: "Smoke", name: "Add Coal", price: 50, tags: ["add-on"] }),

  // WINE
  wine({ category: "Wine", name: "Big Master Red Wine (Glass)", price: 260 }),
  wine({ category: "Wine", name: "Big Master White Wine (Glass)", price: 260 }),
  wine({ category: "Wine", name: "Big Master Red Wine (Full)", price: 1280 }),
  wine({ category: "Wine", name: "Big Master White Wine (Full)", price: 1280 }),

  // BEER
  beer({ category: "Beer", name: "Gorkha Strong 330ml", price: 260, isPopular: true }),
  beer({ category: "Beer", name: "Tuborg Gold 330ml", price: 295, isPopular: true }),
  beer({ category: "Beer", name: "Barahsinghe Pilsner 330ml", price: 290 }),

  // WHISKY
  spirit({
    category: "Whisky",
    subcategory: "OD Regular",
    name: "OD Regular",
    variants: whiskyVariants({ "30ml": 185, "60ml": 365, "90ml": 540, "180ml": 1070, "360ml": 2135, Full: 4260 }),
  }),
  spirit({
    category: "Whisky",
    subcategory: "Gurkhas & Guns",
    name: "Gurkhas & Guns",
    isPopular: true,
    variants: whiskyVariants({ "30ml": 195, "60ml": 385, "90ml": 570, "180ml": 1130, "360ml": 2255, Full: 4500 }),
  }),
  spirit({
    category: "Whisky",
    subcategory: "Black Oak",
    name: "Black Oak",
    variants: whiskyVariants({ "30ml": 95, "60ml": 185, "90ml": 270, "180ml": 530, "360ml": 1055, Full: 2100 }),
  }),
  spirit({
    category: "Whisky",
    subcategory: "Golden Oak",
    name: "Golden Oak",
    variants: whiskyVariants({ "30ml": 85, "60ml": 160, "90ml": 235, "180ml": 465, "360ml": 920, Full: 1830 }),
  }),

  // VODKA
  spirit({
    category: "Vodka",
    subcategory: "8848",
    name: "8848",
    isPopular: true,
    variants: whiskyVariants({ "30ml": 140, "60ml": 235, "90ml": 400, "180ml": 795, "360ml": 1580, Full: 3150 }),
  }),

  // RUM
  spirit({
    category: "Rum",
    subcategory: "Khukri XXX",
    name: "Khukri XXX",
    variants: whiskyVariants({ "30ml": 120, "60ml": 235, "90ml": 350, "180ml": 695, "360ml": 1380, Full: 2750 }),
  }),
  spirit({
    category: "Rum",
    subcategory: "Khukri White",
    name: "Khukri White",
    variants: whiskyVariants({ "30ml": 140, "60ml": 270, "90ml": 395, "180ml": 800, "360ml": 1595, Full: 3180 }),
  }),
];
