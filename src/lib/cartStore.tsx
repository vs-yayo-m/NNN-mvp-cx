"use client";

// ============================================================================
// Cart store — Context + useReducer, persisted to localStorage.
// Components only ever call the exported hook functions below; nothing
// outside this file touches localStorage or the reducer directly. This is
// what lets us swap localStorage for Supabase later without touching UI.
// ============================================================================

import {
  createContext,
  useContext,
  useEffect,
  useReducer,
  useCallback,
  useMemo,
  type ReactNode,
} from "react";
import type { CartLine, CartState } from "@/types";
import { readStorage, writeStorage, STORAGE_KEYS } from "./storage";
import { generateId } from "./utils";
import { validatePromoCode } from "@/data/promoCodes";

// Free delivery over this subtotal; flat fee otherwise. Tunable constants —
// safe to change before the ownership demo.
export const DELIVERY_FEE = 80;
export const FREE_DELIVERY_THRESHOLD = 1500;

type CartAction =
  | { type: "ADD_ITEM"; payload: { menuItemId: string; name: string; image: string; variantLabel: string; unitPrice: number; quantity: number } }
  | { type: "REMOVE_LINE"; payload: { lineId: string } }
  | { type: "UPDATE_QUANTITY"; payload: { lineId: string; quantity: number } }
  | { type: "APPLY_PROMO"; payload: { code: string; discount: number } }
  | { type: "CLEAR_PROMO" }
  | { type: "CLEAR_CART" }
  | { type: "HYDRATE"; payload: CartState };

const initialState: CartState = {
  lines: [],
  promoCode: null,
  promoDiscount: 0,
};

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "HYDRATE":
      return action.payload;

    case "ADD_ITEM": {
      const { menuItemId, name, image, variantLabel, unitPrice, quantity } = action.payload;
      const lineId = `${menuItemId}::${variantLabel}`;
      const existing = state.lines.find((l) => l.lineId === lineId);
      if (existing) {
        return {
          ...state,
          lines: state.lines.map((l) =>
            l.lineId === lineId ? { ...l, quantity: l.quantity + quantity } : l
          ),
        };
      }
      const newLine: CartLine = {
        lineId,
        menuItemId,
        name,
        image,
        variantLabel,
        unitPrice,
        quantity,
      };
      return { ...state, lines: [...state.lines, newLine] };
    }

    case "REMOVE_LINE":
      return { ...state, lines: state.lines.filter((l) => l.lineId !== action.payload.lineId) };

    case "UPDATE_QUANTITY": {
      const { lineId, quantity } = action.payload;
      if (quantity <= 0) {
        return { ...state, lines: state.lines.filter((l) => l.lineId !== lineId) };
      }
      return {
        ...state,
        lines: state.lines.map((l) => (l.lineId === lineId ? { ...l, quantity } : l)),
      };
    }

    case "APPLY_PROMO":
      return { ...state, promoCode: action.payload.code, promoDiscount: action.payload.discount };

    case "CLEAR_PROMO":
      return { ...state, promoCode: null, promoDiscount: 0 };

    case "CLEAR_CART":
      return initialState;

    default:
      return state;
  }
}

interface CartContextValue {
  state: CartState;
  addItem: (args: {
    menuItemId: string;
    name: string;
    image: string;
    variantLabel: string;
    unitPrice: number;
    quantity: number;
  }) => void;
  removeLine: (lineId: string) => void;
  updateQuantity: (lineId: string, quantity: number) => void;
  applyPromo: (code: string) => { success: boolean; message: string };
  clearPromo: () => void;
  clearCart: () => void;
  subtotal: number;
  deliveryFee: number;
  total: number;
  itemCount: number;
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  // Hydrate from localStorage on mount (client-only).
  useEffect(() => {
    const stored = readStorage<CartState>(STORAGE_KEYS.cart, initialState);
    dispatch({ type: "HYDRATE", payload: stored });
  }, []);

  // Persist on every change.
  useEffect(() => {
    writeStorage(STORAGE_KEYS.cart, state);
  }, [state]);

  const addItem = useCallback((args: Parameters<CartContextValue["addItem"]>[0]) => {
    dispatch({ type: "ADD_ITEM", payload: args });
  }, []);

  const removeLine = useCallback((lineId: string) => {
    dispatch({ type: "REMOVE_LINE", payload: { lineId } });
  }, []);

  const updateQuantity = useCallback((lineId: string, quantity: number) => {
    dispatch({ type: "UPDATE_QUANTITY", payload: { lineId, quantity } });
  }, []);

  const applyPromo = useCallback((code: string): { success: boolean; message: string } => {
    const subtotalNow = state.lines.reduce((sum, l) => sum + l.unitPrice * l.quantity, 0);
    const result = validatePromoCode(code, subtotalNow);
    if (result.valid) {
      dispatch({ type: "APPLY_PROMO", payload: { code: code.toUpperCase(), discount: result.discount } });
      return { success: true, message: result.message };
    }
    return { success: false, message: result.message };
  }, [state.lines]);

  const clearPromo = useCallback(() => dispatch({ type: "CLEAR_PROMO" }), []);
  const clearCart = useCallback(() => dispatch({ type: "CLEAR_CART" }), []);

  const subtotal = useMemo(
    () => state.lines.reduce((sum, l) => sum + l.unitPrice * l.quantity, 0),
    [state.lines]
  );
  const deliveryFee = useMemo(
    () => (subtotal === 0 || subtotal >= FREE_DELIVERY_THRESHOLD ? 0 : DELIVERY_FEE),
    [subtotal]
  );
  const total = useMemo(
    () => Math.max(0, subtotal + deliveryFee - state.promoDiscount),
    [subtotal, deliveryFee, state.promoDiscount]
  );
  const itemCount = useMemo(
    () => state.lines.reduce((sum, l) => sum + l.quantity, 0),
    [state.lines]
  );

  const value: CartContextValue = {
    state,
    addItem,
    removeLine,
    updateQuantity,
    applyPromo,
    clearPromo,
    clearCart,
    subtotal,
    deliveryFee,
    total,
    itemCount,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}

/** Non-hook helper for reading the id used for a given item+variant combo. */
export function buildLineId(menuItemId: string, variantLabel: string): string {
  return `${menuItemId}::${variantLabel}`;
}
