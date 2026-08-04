// /nomnomnow/data/menu-data.ts
import { MenuItem, Variant } from "@/lib/types";

let n = 0;
const id = (p: string) => `${p}-${n++}`;
const img = (text: string, bg: string, fg = "F5EFE6") =>
  `https://placehold.co/600x480/${bg}/${fg}?text=${encodeURIComponent(text)}`;

type Base = Partial<MenuItem> & { name: string; category: string; price?: number; variants?: Variant[] };

function build(section: "kitchen", defaults: { bg: string }) {
  return (b: Base): MenuItem => ({
    id: id(b.category.slice(0, 3).toLowerCase()),
    section,
    category: b.category,
    subcategory: b.subcategory,
    name: b.name,
    price: b.price,
    variants: b.variants,
    description: b.description,
    image: b.image ?? img(b.name, defaults.bg, b.isVeg === false ? "F5EFE6" : "12100E"),
    isAvailable: b.isAvailable ?? true,
    isVeg: b.isVeg ?? null,
    isPopular: b.isPopular ?? false,
    isSpecialToday: b.isSpecialToday ?? false,
    tags: b.tags ?? [],
    spiceLevel: b.spiceLevel ?? 0,
  });
}

const veg = build("kitchen", { bg: "3E8560" });
const nonveg = build("kitchen", { bg: "B92A20" });
const neutral = build("kitchen", { bg: "F2A93B" });

export const KITCHEN_ITEMS: MenuItem[] = [
  // SALAD
  veg({ category: "Salad", name: "Green Salad", price: 150, isVeg: true }),
  veg({ category: "Salad", name: "Nepali Salad", price: 140, isVeg: true, spiceLevel: 1 }),

  // SANDWICH
  veg({ category: "Sandwich", name: "Veg Sandwich", price: 175, isVeg: true }),
  nonveg({ category: "Sandwich", name: "Chicken Sandwich", price: 210, isVeg: false }),
  veg({ category: "Sandwich", name: "Classic Cheese Sandwich (Veg)", price: 215, isVeg: true }),
  nonveg({ category: "Sandwich", name: "Classic Cheese Sandwich (Chicken)", price: 250, isVeg: false }),

  // BURGER
  veg({ category: "Burger", name: "Veg Burger", price: 180, isVeg: true }),
  nonveg({ category: "Burger", name: "Chicken Burger", price: 200, isVeg: false }),
  veg({ category: "Burger", name: "Nom Nom Classic Cheese Burger (Veg)", price: 220, isVeg: true, isPopular: true }),
  nonveg({ category: "Burger", name: "Nom Nom Classic Cheese Burger (Chicken)", price: 240, isVeg: false, isPopular: true }),
  veg({ category: "Burger", name: "Happy Meal Burger (Veg)", price: 240, isVeg: true }),
  nonveg({ category: "Burger", name: "Happy Meal Burger (Chicken)", price: 275, isVeg: false }),

  // VEG SNACKS
  veg({ category: "Veg Snacks", name: "French Fry", price: 150, isVeg: true, isPopular: true }),
  veg({ category: "Veg Snacks", name: "Paneer Chilly", price: 350, isVeg: true, spiceLevel: 2 }),
  veg({ category: "Veg Snacks", name: "Honey Chilly Potato", price: 220, isVeg: true, spiceLevel: 1, isPopular: true }),
  veg({ category: "Veg Snacks", name: "Chilly Potato", price: 180, isVeg: true, spiceLevel: 2 }),
  veg({ category: "Veg Snacks", name: "Mushroom Chilly", price: 290, isVeg: true, spiceLevel: 2 }),
  veg({ category: "Veg Snacks", name: "Veg Pakoda", price: 190, isVeg: true }),
  veg({ category: "Veg Snacks", name: "Paneer Pakoda", price: 330, isVeg: true }),
  veg({ category: "Veg Snacks", name: "Masala Pappad", price: 130, isVeg: true }),
  veg({ category: "Veg Snacks", name: "Sweet Corn Boiled", price: 170, isVeg: true }),
  veg({ category: "Veg Snacks", name: "Sweet Corn Fried", price: 190, isVeg: true }),
  veg({ category: "Veg Snacks", name: "Sweet Corn Sadeko", price: 190, isVeg: true, spiceLevel: 1 }),
  veg({ category: "Veg Snacks", name: "Saut\u00e9 Mix Veg", price: 280, isVeg: true }),

  // ROLLS
  veg({ category: "Rolls", name: "Veg Roll", price: 160, isVeg: true }),
  nonveg({ category: "Rolls", name: "Spicy Chicken Roll", price: 220, isVeg: false, spiceLevel: 2 }),
  nonveg({ category: "Rolls", name: "Chicken Egg Roll", price: 240, isVeg: false }),
  veg({ category: "Rolls", name: "Mix Veg Roll", description: "Paneer, mushroom & extra veg", price: 230, isVeg: true }),
  nonveg({ category: "Rolls", name: "Mix Chicken Roll", description: "Chicken, egg & sausage", price: 280, isVeg: false }),

  // NON-VEG SNACKS
  nonveg({ category: "Non-Veg Snacks", name: "Chari Popcorn", price: 300, isVeg: false }),
  nonveg({ category: "Non-Veg Snacks", name: "Chicken Chilly", price: 360, isVeg: false, spiceLevel: 2, isPopular: true }),
  nonveg({ category: "Non-Veg Snacks", name: "Chicken Lollypop", price: 300, isVeg: false, isPopular: true }),
  nonveg({ category: "Non-Veg Snacks", name: "Schezwan Lollypop", price: 360, isVeg: false, spiceLevel: 2 }),
  nonveg({ category: "Non-Veg Snacks", name: "Hot Wings", price: 360, isVeg: false, spiceLevel: 2 }),
  nonveg({ category: "Non-Veg Snacks", name: "Crispy Chicken", price: 310, isVeg: false }),
  nonveg({ category: "Non-Veg Snacks", name: "Dragon Chicken", price: 380, isVeg: false, spiceLevel: 3 }),
  nonveg({ category: "Non-Veg Snacks", name: "Chicken Roast", price: 320, isVeg: false }),
  nonveg({ category: "Non-Veg Snacks", name: "Leg Piece Fry", price: 290, isVeg: false }),
  nonveg({ category: "Non-Veg Snacks", name: "Schezwan Leg Piece", price: 330, isVeg: false, spiceLevel: 2 }),
  nonveg({ category: "Non-Veg Snacks", name: "Sausage Chilly", price: 220, isVeg: false, spiceLevel: 1 }),
  nonveg({ category: "Non-Veg Snacks", name: "Sausage Fry", price: 180, isVeg: false }),
  nonveg({ category: "Non-Veg Snacks", name: "Sausage Boiled", price: 170, isVeg: false }),
  nonveg({ category: "Non-Veg Snacks", name: "Chicken 65", price: 360, isVeg: false, spiceLevel: 2 }),
  nonveg({ category: "Non-Veg Snacks", name: "Boiled Chicken", price: 290, isVeg: false }),
  nonveg({ category: "Non-Veg Snacks", name: "Saut\u00e9 Chicken", price: 320, isVeg: false }),
  nonveg({
    category: "Non-Veg Snacks",
    name: "Combo Chicken",
    description: "2 drumsticks, 2 wings, 2 sausages, 3 momos + side salad",
    price: 580,
    isVeg: false,
    isSpecialToday: true,
    isPopular: true,
  }),

  // ROTI
  veg({ category: "Roti", name: "Plain Tawa Roti", price: 20, isVeg: true }),
  veg({ category: "Roti", name: "Butter Tawa Roti", price: 25, isVeg: true }),

  // PIZZA
  veg({ category: "Pizza", name: "Mix Veg Pizza", price: 495, isVeg: true }),
  nonveg({ category: "Pizza", name: "Chicken Pizza", price: 495, isVeg: false }),
  veg({ category: "Pizza", name: "Margarita Pizza", price: 395, isVeg: true }),
  veg({ category: "Pizza", name: "Mushroom Pizza", price: 460, isVeg: true }),
  veg({ category: "Pizza", name: "Veg Momo Pizza", price: 450, isVeg: true }),
  nonveg({ category: "Pizza", name: "Chicken Momo Pizza", price: 480, isVeg: false }),
  veg({ category: "Pizza", name: "Nom Nom Special Pizza (Veg)", price: 555, isVeg: true, isPopular: true }),
  nonveg({ category: "Pizza", name: "Nom Nom Special Pizza (Chicken)", price: 595, isVeg: false, isPopular: true }),
  veg({ category: "Pizza", name: "Cheese Pizza", price: 440, isVeg: true }),
  veg({ category: "Pizza", name: "Extra Cheese", price: 50, isVeg: true, tags: ["add-on"] }),

  // KHAJA SET
  veg({
    category: "Khaja Set",
    name: "Veg Khaja Set",
    description: "Paneer pakoda, sadheko bhatmas, piro aloo, Nepali achar, potato wedges",
    price: 360,
    isVeg: true,
  }),
  nonveg({
    category: "Khaja Set",
    name: "Non Veg Khaja Set",
    description: "Bhutuwa, duck choila, Palpali chicken, Nepali achar with cheura & bhatmas",
    price: 490,
    isVeg: false,
    isPopular: true,
  }),

  // BIRYANI
  veg({ category: "Biryani", name: "Veg Biryani", price: 380, isVeg: true }),
  nonveg({ category: "Biryani", name: "Chicken Biryani", price: 395, isVeg: false, isPopular: true }),
  nonveg({ category: "Biryani", name: "Mutton Biryani", price: 495, isVeg: false }),
  veg({ category: "Biryani", name: "Veg Matka Biryani", price: 485, isVeg: true, tags: ["matka"] }),
  nonveg({ category: "Biryani", name: "Chicken Matka Biryani", price: 495, isVeg: false, tags: ["matka"], isPopular: true }),
  nonveg({ category: "Biryani", name: "Mutton Matka Biryani", price: 595, isVeg: false, tags: ["matka"] }),
  veg({ category: "Biryani", name: "Add Raita", price: 50, isVeg: true, tags: ["add-on"] }),

  // THUKPA
  veg({ category: "Thukpa", name: "Veg Thukpa", price: 170, isVeg: true }),
  nonveg({ category: "Thukpa", name: "Egg Thukpa", price: 195, isVeg: false }),
  nonveg({ category: "Thukpa", name: "Chicken Thukpa", price: 250, isVeg: false, isPopular: true }),
  veg({ category: "Thukpa", name: "Mix Thukpa (Veg)", price: 260, isVeg: true }),
  nonveg({ category: "Thukpa", name: "Mix Thukpa (Chicken)", price: 295, isVeg: false }),

  // CHOWMEIN
  veg({ category: "Chowmein", name: "Veg Chowmein", price: 130, isVeg: true }),
  nonveg({ category: "Chowmein", name: "Egg Chowmein", price: 160, isVeg: false }),
  nonveg({ category: "Chowmein", name: "Chicken Chowmein", price: 195, isVeg: false, isPopular: true }),
  veg({ category: "Chowmein", name: "Mix Chowmein (Veg)", price: 250, isVeg: true }),
  nonveg({ category: "Chowmein", name: "Mix Chowmein (Chicken)", price: 270, isVeg: false }),
  nonveg({ category: "Chowmein", name: "Bhutuwa Chowmein", price: 260, isVeg: false, spiceLevel: 1 }),

  // SPECIAL BUFF ITEMS
  nonveg({ category: "Special Buff Items", name: "Buff Chowmein", price: 240, isVeg: false }),
  nonveg({ category: "Special Buff Items", name: "Buff Thukpa", price: 250, isVeg: false }),
  nonveg({ category: "Special Buff Items", name: "Buff Fried Rice", price: 260, isVeg: false }),
  nonveg({ category: "Special Buff Items", name: "Sukuti", price: 320, isVeg: false, spiceLevel: 2, isPopular: true }),
  nonveg({ category: "Special Buff Items", name: "Choila", price: 340, isVeg: false, spiceLevel: 2, isPopular: true }),
  nonveg({ category: "Special Buff Items", name: "Sadeko Sukuti", price: 330, isVeg: false, spiceLevel: 2 }),
  nonveg({ category: "Special Buff Items", name: "Buff Chilly", price: 300, isVeg: false, spiceLevel: 2 }),

  // NEPALI SNACKS
  veg({ category: "Nepali Snacks", name: "Wai Wai Sadeko", price: 100, isVeg: true, spiceLevel: 1 }),
  veg({ category: "Nepali Snacks", name: "Dry Peanut", price: 160, isVeg: true }),
  veg({ category: "Nepali Snacks", name: "Peanut Sadeko", price: 180, isVeg: true, spiceLevel: 1 }),
  veg({ category: "Nepali Snacks", name: "Bhatmas Sadeko", price: 160, isVeg: true, spiceLevel: 1 }),
  veg({ category: "Nepali Snacks", name: "Jeera Aloo", price: 160, isVeg: true }),
  veg({ category: "Nepali Snacks", name: "Timmurey Aloo", price: 160, isVeg: true, spiceLevel: 2 }),
  veg({ category: "Nepali Snacks", name: "Chatpata Aloo", price: 180, isVeg: true, spiceLevel: 2 }),
  nonveg({ category: "Nepali Snacks", name: "Chicken Sadeko", price: 270, isVeg: false, spiceLevel: 1 }),
  nonveg({ category: "Nepali Snacks", name: "Duck Choila", price: 390, isVeg: false, spiceLevel: 2 }),
  nonveg({ category: "Nepali Snacks", name: "Pahadi Chicken", price: 340, isVeg: false, spiceLevel: 2 }),
  nonveg({ category: "Nepali Snacks", name: "Palpali Chicken", price: 330, isVeg: false, spiceLevel: 1 }),
  nonveg({ category: "Nepali Snacks", name: "Timmurey Chicken", price: 340, isVeg: false, spiceLevel: 2 }),

  // RICE
  veg({ category: "Rice", name: "Plain Rice", price: 110, isVeg: true }),
  veg({ category: "Rice", name: "Jeera Rice", price: 130, isVeg: true }),
  veg({ category: "Rice", name: "Veg Fried Rice", price: 170, isVeg: true }),
  nonveg({ category: "Rice", name: "Egg Fried Rice", price: 190, isVeg: false }),
  nonveg({ category: "Rice", name: "Chicken Fried Rice", price: 220, isVeg: false, isPopular: true }),
  veg({ category: "Rice", name: "Mix Fried Rice (Veg)", price: 230, isVeg: true }),
  nonveg({ category: "Rice", name: "Mix Fried Rice (Chicken)", price: 250, isVeg: false }),

  // RAMEN / CURRENT
  veg({ category: "Ramen / Current", subcategory: "Ramen", name: "Ramen \u2013 Noodle", price: 280, isVeg: true }),
  nonveg({ category: "Ramen / Current", subcategory: "Ramen", name: "Ramen \u2013 Egg", price: 300, isVeg: false }),
  nonveg({ category: "Ramen / Current", subcategory: "Ramen", name: "Ramen \u2013 Sausage", price: 310, isVeg: false }),
  nonveg({ category: "Ramen / Current", subcategory: "Ramen", name: "Ramen \u2013 Chicken", price: 340, isVeg: false }),
  nonveg({ category: "Ramen / Current", subcategory: "Ramen", name: "Ramen \u2013 Mix", price: 395, isVeg: false, isPopular: true }),
  veg({ category: "Ramen / Current", subcategory: "Current", name: "Current \u2013 Noodle", price: 110, isVeg: true }),
  nonveg({ category: "Ramen / Current", subcategory: "Current", name: "Current \u2013 Egg", price: 130, isVeg: false }),
  nonveg({ category: "Ramen / Current", subcategory: "Current", name: "Current \u2013 Sausage", price: 170, isVeg: false }),
  nonveg({ category: "Ramen / Current", subcategory: "Current", name: "Current \u2013 Chicken", price: 190, isVeg: false }),
  nonveg({ category: "Ramen / Current", subcategory: "Current", name: "Current \u2013 Mix", price: 240, isVeg: false }),

  // CURRY
  veg({ category: "Curry", name: "Mix Veg Curry", price: 395, isVeg: true }),
  veg({ category: "Curry", name: "Paneer Curry", price: 380, isVeg: true }),
  veg({ category: "Curry", name: "Kadai Paneer", price: 390, isVeg: true, spiceLevel: 1 }),
  veg({ category: "Curry", name: "Paneer Butter Masala", price: 420, isVeg: true, isPopular: true }),
  nonveg({ category: "Curry", name: "Chicken Curry", price: 380, isVeg: false }),
  nonveg({ category: "Curry", name: "Butter Chicken", price: 460, isVeg: false, isPopular: true }),
  nonveg({ category: "Curry", name: "Kadai Chicken", price: 430, isVeg: false, spiceLevel: 1 }),
  nonveg({ category: "Curry", name: "Mutton Curry", price: 460, isVeg: false }),

  // MOMO \u2013 Veg
  veg({ category: "Momo", subcategory: "Veg Momo", name: "Veg Momo \u2013 Steam", price: 140, isVeg: true, isPopular: true,
  image: "https://images.pexels.com/photos/3607284/pexels-photo-3607284.jpeg?auto=compress&cs=tinysrgb&w=800",
    
  }),
  veg({ category: "Momo", subcategory: "Veg Momo", name: "Veg Momo \u2013 Fry", price: 150, isVeg: true }),
  veg({ category: "Momo", subcategory: "Veg Momo", name: "Veg Momo \u2013 Chilly", price: 195, isVeg: true, spiceLevel: 2 }),
  veg({ category: "Momo", subcategory: "Veg Momo", name: "Veg Momo \u2013 Kothey", price: 230, isVeg: true }),
  veg({ category: "Momo", subcategory: "Veg Momo", name: "Veg Momo \u2013 Jhol", price: 235, isVeg: true, spiceLevel: 1 }),
  veg({ category: "Momo", subcategory: "Veg Momo", name: "Veg Momo \u2013 Sadeko", price: 225, isVeg: true, spiceLevel: 1 }),
  // MOMO \u2013 Chicken
  nonveg({ category: "Momo", subcategory: "Chicken Momo", name: "Chicken Momo \u2013 Steam", price: 190, isVeg: false, isPopular: true }),
  nonveg({ category: "Momo", subcategory: "Chicken Momo", name: "Chicken Momo \u2013 Fry", price: 210, isVeg: false }),
  nonveg({ category: "Momo", subcategory: "Chicken Momo", name: "Chicken Momo \u2013 Chilly", price: 250, isVeg: false, spiceLevel: 2, isPopular: true }),
  nonveg({ category: "Momo", subcategory: "Chicken Momo", name: "Chicken Momo \u2013 Kothey", price: 270, isVeg: false }),
  nonveg({ category: "Momo", subcategory: "Chicken Momo", name: "Chicken Momo \u2013 Jhol", price: 270, isVeg: false, spiceLevel: 1 }),
  nonveg({ category: "Momo", subcategory: "Chicken Momo", name: "Chicken Momo \u2013 Sadeko", price: 265, isVeg: false, spiceLevel: 1 }),
  // MOMO \u2013 Buff
  nonveg({ category: "Momo", subcategory: "Buff Momo", name: "Buff Momo \u2013 Steam", price: 180, isVeg: false }),
  nonveg({ category: "Momo", subcategory: "Buff Momo", name: "Buff Momo \u2013 Fry", price: 200, isVeg: false }),
  nonveg({ category: "Momo", subcategory: "Buff Momo", name: "Buff Momo \u2013 Chilly", price: 250, isVeg: false, spiceLevel: 2 }),
  nonveg({ category: "Momo", subcategory: "Buff Momo", name: "Buff Momo \u2013 Kothey", price: 265, isVeg: false }),
  nonveg({ category: "Momo", subcategory: "Buff Momo", name: "Buff Momo \u2013 Jhol", price: 270, isVeg: false, spiceLevel: 1 }),
  nonveg({ category: "Momo", subcategory: "Buff Momo", name: "Buff Momo \u2013 Sadeko", price: 265, isVeg: false, spiceLevel: 1 }),

  // DOUBLE TROUBLE MOMO PLATTER
  veg({ category: "Momo", subcategory: "Double Trouble Platter", name: "Double Trouble Momo Platter \u2013 Veg", price: 290, isVeg: true }),
  nonveg({ category: "Momo", subcategory: "Double Trouble Platter", name: "Double Trouble Momo Platter \u2013 Chicken", price: 340, isVeg: false, isPopular: true }),
  nonveg({ category: "Momo", subcategory: "Double Trouble Platter", name: "Double Trouble Momo Platter \u2013 Buff", price: 330, isVeg: false }),
];
