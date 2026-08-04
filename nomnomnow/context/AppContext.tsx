"use client";

import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { CartLine, GuestInfo, MenuItem, Order, OrderType } from "@/lib/types";
import { genId } from "@/lib/utils";
import { readStorage, writeStorage, STORAGE_KEYS } from "@/lib/storage";
import { SITE } from "@/data/site-config";

interface AppContextValue {
  cart: CartLine[];
  cartCount: number;
  cartSubtotal: number;
  addToCart: (item: MenuItem, variantLabel: string | undefined, unitPrice: number, quantity?: number) => void;
  updateQuantity: (lineId: string, quantity: number) => void;
  removeLine: (lineId: string) => void;
  clearCart: () => void;
  guest: GuestInfo;
  setGuest: (g: GuestInfo) => void;
  orders: Order[];
  placeOrder: (args: { orderType: OrderType; isRecurring?: boolean; recurringTime?: string }) => Order;
  hydrated: boolean;
}

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartLine[]>([]);
  const [guest, setGuestState] = useState<GuestInfo>({ name: "", phone: "" });
  const [orders, setOrders] = useState<Order[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setCart(readStorage(STORAGE_KEYS.cart, [] as CartLine[]));
    setGuestState(readStorage(STORAGE_KEYS.guest, { name: "", phone: "" } as GuestInfo));
    setOrders(readStorage(STORAGE_KEYS.orders, [] as Order[]));
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) writeStorage(STORAGE_KEYS.cart, cart);
  }, [cart, hydrated]);

  useEffect(() => {
    if (hydrated) writeStorage(STORAGE_KEYS.guest, guest);
  }, [guest, hydrated]);

  useEffect(() => {
    if (hydrated) writeStorage(STORAGE_KEYS.orders, orders);
  }, [orders, hydrated]);

  const addToCart: AppContextValue["addToCart"] = (item, variantLabel, unitPrice, quantity = 1) => {
    setCart((prev) => {
      const existing = prev.find((l) => l.itemId === item.id && l.variantLabel === variantLabel);
      if (existing) {
        return prev.map((l) =>
          l.lineId === existing.lineId ? { ...l, quantity: l.quantity + quantity } : l
        );
      }
      const newLine: CartLine = {
        lineId: genId("line"),
        itemId: item.id,
        name: item.name,
        image: item.image,
        unitPrice,
        variantLabel,
        quantity,
      };
      return [...prev, newLine];
    });
  };

  const updateQuantity = (lineId: string, quantity: number) => {
    setCart((prev) =>
      quantity <= 0 ? prev.filter((l) => l.lineId !== lineId) : prev.map((l) => (l.lineId === lineId ? { ...l, quantity } : l))
    );
  };

  const removeLine = (lineId: string) => setCart((prev) => prev.filter((l) => l.lineId !== lineId));
  const clearCart = () => setCart([]);
  const setGuest = (g: GuestInfo) => setGuestState(g);

  const placeOrder: AppContextValue["placeOrder"] = ({ orderType, isRecurring, recurringTime }) => {
    const subtotal = cart.reduce((s, l) => s + l.unitPrice * l.quantity, 0);
    const deliveryFee = orderType === "pickup" || subtotal >= SITE.freeDeliveryThreshold ? 0 : SITE.deliveryFee;
    const order: Order = {
      id: genId("NNN"),
      createdAt: new Date().toISOString(),
      lines: cart,
      subtotal,
      deliveryFee,
      total: subtotal + deliveryFee,
      orderType,
      guest,
      status: "placed",
      branch: SITE.branch,
      isRecurring,
      recurringTime,
    };
    setOrders((prev) => [order, ...prev]);
    setCart([]);
    return order;
  };

  const cartCount = cart.reduce((s, l) => s + l.quantity, 0);
  const cartSubtotal = cart.reduce((s, l) => s + l.unitPrice * l.quantity, 0);

  const value = useMemo(
    () => ({
      cart,
      cartCount,
      cartSubtotal,
      addToCart,
      updateQuantity,
      removeLine,
      clearCart,
      guest,
      setGuest,
      orders,
      placeOrder,
      hydrated,
    }),
    [cart, guest, orders, hydrated]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp(): AppContextValue {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}
