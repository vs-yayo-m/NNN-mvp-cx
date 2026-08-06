"use client";

// ============================================================================
// Order store — Context + useReducer, persisted to localStorage.
// Creates orders from cart + checkout details, keeps order history, and
// simulates status progression over time so the tracking screen visibly
// moves during a live demo without a real backend or delivery fleet.
// ============================================================================

import {
  createContext,
  useContext,
  useEffect,
  useReducer,
  useCallback,
  type ReactNode,
} from "react";
import type { Order, OrderLine, OrderType, PaymentMethod, DeliveryDetails, OrderStatus, CartLine } from "@/types";
import { readStorage, writeStorage, STORAGE_KEYS } from "./storage";
import { generateOrderId } from "./utils";

// ---------------------------------------------------------------------------
// Status simulation timings — TUNABLE. These are scaled-down demo timings,
// not real-world delivery durations, so the tracking screen visibly
// progresses during a live pitch. Adjust freely before a real demo.
// ---------------------------------------------------------------------------
export const STATUS_TIMELINE_SECONDS: Record<Exclude<OrderStatus, "received">, number> = {
  preparing: 8,
  out_for_delivery: 22,
  ready_for_pickup: 22,
  completed: 40,
};

/** Computes the current status of an order based on elapsed time since creation. */
export function computeSimulatedStatus(order: Order): OrderStatus {
  const elapsedSeconds = (Date.now() - new Date(order.createdAt).getTime()) / 1000;
  const finalStatus: OrderStatus = order.orderType === "pickup" ? "ready_for_pickup" : "out_for_delivery";
  const finalKey = order.orderType === "pickup" ? "ready_for_pickup" : "out_for_delivery";

  if (elapsedSeconds >= STATUS_TIMELINE_SECONDS.completed) return "completed";
  if (elapsedSeconds >= STATUS_TIMELINE_SECONDS[finalKey]) return finalStatus;
  if (elapsedSeconds >= STATUS_TIMELINE_SECONDS.preparing) return "preparing";
  return "received";
}

type OrderAction =
  | { type: "HYDRATE"; payload: Order[] }
  | { type: "ADD_ORDER"; payload: Order }
  | { type: "UPDATE_STATUS"; payload: { orderId: string; status: OrderStatus } };

function orderReducer(state: Order[], action: OrderAction): Order[] {
  switch (action.type) {
    case "HYDRATE":
      return action.payload;
    case "ADD_ORDER":
      return [action.payload, ...state];
    case "UPDATE_STATUS":
      return state.map((o) =>
        o.id === action.payload.orderId ? { ...o, status: action.payload.status } : o
      );
    default:
      return state;
  }
}

interface CreateOrderArgs {
  cartLines: CartLine[];
  subtotal: number;
  deliveryFee: number;
  promoCode: string | null;
  promoDiscount: number;
  orderType: OrderType;
  paymentMethod: PaymentMethod;
  details: DeliveryDetails;
}

interface OrderContextValue {
  orders: Order[];
  createOrder: (args: CreateOrderArgs) => Order;
  getOrderById: (id: string) => Order | undefined;
  refreshOrderStatus: (id: string) => void;
}

const OrderContext = createContext<OrderContextValue | null>(null);

export function OrderProvider({ children }: { children: ReactNode }) {
  const [orders, dispatch] = useReducer(orderReducer, []);

  useEffect(() => {
    const stored = readStorage<Order[]>(STORAGE_KEYS.orders, []);
    dispatch({ type: "HYDRATE", payload: stored });
  }, []);

  useEffect(() => {
    writeStorage(STORAGE_KEYS.orders, orders);
  }, [orders]);

  const createOrder = useCallback((args: CreateOrderArgs): Order => {
    const lines: OrderLine[] = args.cartLines.map((l) => ({
      menuItemId: l.menuItemId,
      name: l.name,
      image: l.image,
      variantLabel: l.variantLabel,
      unitPrice: l.unitPrice,
      quantity: l.quantity,
    }));
    const total = Math.max(0, args.subtotal + args.deliveryFee - args.promoDiscount);
    const order: Order = {
      id: generateOrderId(),
      createdAt: new Date().toISOString(),
      lines,
      subtotal: args.subtotal,
      deliveryFee: args.deliveryFee,
      promoCode: args.promoCode,
      promoDiscount: args.promoDiscount,
      total,
      orderType: args.orderType,
      paymentMethod: args.paymentMethod,
      details: args.details,
      status: "received",
    };
    dispatch({ type: "ADD_ORDER", payload: order });
    return order;
  }, []);

  const getOrderById = useCallback(
    (id: string): Order | undefined => orders.find((o) => o.id === id),
    [orders]
  );

  const refreshOrderStatus = useCallback(
    (id: string) => {
      const order = orders.find((o) => o.id === id);
      if (!order) return;
      const newStatus = computeSimulatedStatus(order);
      if (newStatus !== order.status) {
        dispatch({ type: "UPDATE_STATUS", payload: { orderId: id, status: newStatus } });
      }
    },
    [orders]
  );

  const value: OrderContextValue = { orders, createOrder, getOrderById, refreshOrderStatus };

  return <OrderContext.Provider value={value}>{children}</OrderContext.Provider>;
}

export function useOrders(): OrderContextValue {
  const ctx = useContext(OrderContext);
  if (!ctx) throw new Error("useOrders must be used within OrderProvider");
  return ctx;
}
