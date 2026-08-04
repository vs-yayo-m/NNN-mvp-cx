export type MenuSection = "kitchen" | "bar";

export interface Variant {
  label: string; // e.g. "30ml", "Steam", "Full"
  price: number;
}

export interface MenuItem {
  id: string;
  section: MenuSection;
  category: string; // e.g. "Momo", "Whisky"
  subcategory?: string; // e.g. "Chicken Momo"
  name: string;
  price?: number; // used when no variants
  variants?: Variant[];
  description?: string;
  image: string;
  isAvailable: boolean;
  isVeg: boolean | null; // null = not applicable (e.g. drinks/smokes)
  isPopular?: boolean;
  isSpecialToday?: boolean;
  tags?: string[];
  spiceLevel?: 0 | 1 | 2 | 3;
}

export interface CartLine {
  lineId: string;
  itemId: string;
  name: string;
  image: string;
  unitPrice: number;
  variantLabel?: string;
  quantity: number;
  notes?: string;
}

export type OrderType = "delivery" | "pickup";
export type OrderStatus =
  | "placed"
  | "confirmed"
  | "preparing"
  | "out_for_delivery"
  | "ready_for_pickup"
  | "completed";

export interface GuestInfo {
  name: string;
  phone: string;
  address?: string;
  landmark?: string;
  notes?: string;
}

export interface Order {
  id: string;
  createdAt: string;
  lines: CartLine[];
  subtotal: number;
  deliveryFee: number;
  total: number;
  orderType: OrderType;
  guest: GuestInfo;
  status: OrderStatus;
  branch: string;
  isRecurring?: boolean;
  recurringTime?: string;
}
