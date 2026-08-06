// ============================================================================
// Nom Nom Now — Shared Type Definitions
// Every store, component, and API route imports from here. Keep this the
// single source of truth for shape so the data layer can be swapped for a
// real backend (Supabase) later without touching component code.
// ============================================================================

export type OrderType = "delivery" | "pickup";

export type PaymentMethod = "cod" | "esewa" | "khalti";

export type OrderStatus =
  | "received"
  | "preparing"
  | "out_for_delivery"
  | "ready_for_pickup"
  | "completed";

// ---------------------------------------------------------------------------
// Menu
// ---------------------------------------------------------------------------

export interface MenuItemVariant {
  label: string; // e.g. "Steam", "180ml", "Full"
  price: number; // NPR
}

export interface MenuItem {
  id: string;
  categoryId: string;
  subcategory?: string;
  name: string;
  description?: string;
  image: string; // external URL OR "/menu/filename.jpg"
  isVeg: boolean;
  isAvailable: boolean;
  isPopular: boolean;
  isTodaysSpecial: boolean;
  tags: string[];
  variants: MenuItemVariant[];
  /** true for items belonging to the Bar vertical (Wine, Beer, Whisky, etc.) */
  isBarItem?: boolean;
}

export interface Category {
  id: string;
  label: string;
  icon: string; // Lucide icon name — see lib/categoryIcons.tsx for the lookup
  sortOrder: number;
  group: "food" | "bar";
}

// ---------------------------------------------------------------------------
// Cart
// ---------------------------------------------------------------------------

export interface CartLine {
  /** unique id for this cart line: `${menuItemId}::${variantLabel}` */
  lineId: string;
  menuItemId: string;
  name: string;
  image: string;
  variantLabel: string;
  unitPrice: number;
  quantity: number;
}

export interface CartState {
  lines: CartLine[];
  promoCode: string | null;
  promoDiscount: number; // NPR, computed
}

// ---------------------------------------------------------------------------
// Auth / Profile
// ---------------------------------------------------------------------------

export interface UserProfile {
  phone: string; // digits only, no country code
  name: string;
  createdAt: string; // ISO
}

export interface AuthState {
  isLoggedIn: boolean;
  profile: UserProfile | null;
}

// Where the user was trying to go before we interrupted them with login.
// Stored so we can send them back after OTP + (optional) name capture.
export type LoginReturnContext =
  | { type: "checkout" }
  | { type: "profile" }
  | { type: "home" }
  | { type: "cart" };

// ---------------------------------------------------------------------------
// Orders
// ---------------------------------------------------------------------------

export interface OrderLine {
  menuItemId: string;
  name: string;
  image: string;
  variantLabel: string;
  unitPrice: number;
  quantity: number;
}

export interface DeliveryDetails {
  name: string;
  phone: string;
  address: string;
  landmark?: string;
}

// ---------------------------------------------------------------------------
// Saved addresses (Phase B)
// ---------------------------------------------------------------------------

export interface SavedAddress {
  id: string;
  label: string; // e.g. "Home", "Work"
  address: string;
  landmark?: string;
  isDefault: boolean;
}

export interface Order {
  id: string; // e.g. "NNN-10234"
  createdAt: string; // ISO timestamp — drives the status stepper simulation
  lines: OrderLine[];
  subtotal: number;
  deliveryFee: number;
  promoCode: string | null;
  promoDiscount: number;
  total: number;
  orderType: OrderType;
  paymentMethod: PaymentMethod;
  details: DeliveryDetails;
  status: OrderStatus;
}

// ---------------------------------------------------------------------------
// Recurring orders (Phase B — type defined now so Phase A data shapes agree)
// ---------------------------------------------------------------------------

export type RecurringFrequency = "daily" | "weekdays" | "weekly";

export interface RecurringOrder {
  id: string;
  createdFromOrderId: string;
  lines: OrderLine[];
  frequency: RecurringFrequency;
  timeOfDay: string; // "HH:mm"
  startDate: string; // ISO date
  isPaused: boolean;
}
