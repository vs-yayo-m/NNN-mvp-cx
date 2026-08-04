export const SITE = {
  name: "Nom Nom Now",
  tagline: "Butwal's kitchen & bar, one tap away",
  branch: "Butwal (Main)",
  city: "Butwal, Nepal",
  currency: "Rs.",
  deliveryFee: 60,
  freeDeliveryThreshold: 1200,
  supportPhone: "+977-98XXXXXXXX",
};

export interface CategoryMeta {
  key: string;
  label: string;
  section: "kitchen" | "bar";
  icon: string; // emoji, swap for real icon later
}

export const CATEGORIES: CategoryMeta[] = [
  { key: "Momo", label: "Momo", section: "kitchen", icon: "\u{1F95F}" },
  { key: "Pizza", label: "Pizza", section: "kitchen", icon: "\u{1F355}" },
  { key: "Burger", label: "Burger", section: "kitchen", icon: "\u{1F354}" },
  { key: "Biryani", label: "Biryani", section: "kitchen", icon: "\u{1F35B}" },
  { key: "Thukpa", label: "Thukpa", section: "kitchen", icon: "\u{1F35C}" },
  { key: "Chowmein", label: "Chowmein", section: "kitchen", icon: "\u{1F35D}" },
  { key: "Ramen / Current", label: "Ramen", section: "kitchen", icon: "\u{1F35C}" },
  { key: "Curry", label: "Curry", section: "kitchen", icon: "\u{1F372}" },
  { key: "Rice", label: "Rice", section: "kitchen", icon: "\u{1F35A}" },
  { key: "Khaja Set", label: "Khaja Set", section: "kitchen", icon: "\u{1F371}" },
  { key: "Non-Veg Snacks", label: "Non-Veg Snacks", section: "kitchen", icon: "\u{1F357}" },
  { key: "Veg Snacks", label: "Veg Snacks", section: "kitchen", icon: "\u{1F954}" },
  { key: "Nepali Snacks", label: "Nepali Snacks", section: "kitchen", icon: "\u{1F972}" },
  { key: "Special Buff Items", label: "Buff Special", section: "kitchen", icon: "\u{1F979}" },
  { key: "Rolls", label: "Rolls", section: "kitchen", icon: "\u{1F32F}" },
  { key: "Sandwich", label: "Sandwich", section: "kitchen", icon: "\u{1F96A}" },
  { key: "Salad", label: "Salad", section: "kitchen", icon: "\u{1F957}" },
  { key: "Roti", label: "Roti", section: "kitchen", icon: "\u{1FAD3}" },
  { key: "Beer", label: "Beer", section: "bar", icon: "\u{1F37A}" },
  { key: "Whisky", label: "Whisky", section: "bar", icon: "\u{1F943}" },
  { key: "Vodka", label: "Vodka", section: "bar", icon: "\u{1F942}" },
  { key: "Rum", label: "Rum", section: "bar", icon: "\u{1F942}" },
  { key: "Wine", label: "Wine", section: "bar", icon: "\u{1F377}" },
  { key: "Shots", label: "Shots", section: "bar", icon: "\u{1F943}" },
  { key: "Soft Drinks", label: "Soft Drinks", section: "bar", icon: "\u{1F964}" },
  { key: "Smoke", label: "Smoke Corner", section: "bar", icon: "\u{1F6AC}" },
];

export const HERO_BANNERS = [
  {
    id: "b1",
    title: "Today's Special: Combo Chicken",
    subtitle: "2 drumsticks, 2 wings, 2 sausages, 3 momos & a side salad",
    cta: "Order the combo",
    image: "https://placehold.co/1200x700/E63B2E/F5EFE6?text=Combo+Chicken",
    query: "Combo Chicken",
  },
  {
    id: "b2",
    title: "Momo o'clock, always",
    subtitle: "Steam, fry, kothey, jhol \u2014 six ways to momo",
    cta: "See the momo wall",
    image: "https://placehold.co/1200x700/F2A93B/12100E?text=Momo+Wall",
    query: "Momo",
  },
  {
    id: "b3",
    title: "The bar corner is open",
    subtitle: "Beer, whisky, wine \u2014 order ahead for the table",
    cta: "Browse the bar",
    image: "https://placehold.co/1200x700/262019/F5EFE6?text=Bar+Corner",
    query: "__bar__",
  },
];
