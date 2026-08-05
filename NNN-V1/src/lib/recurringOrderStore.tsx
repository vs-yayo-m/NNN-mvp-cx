"use client";

// ============================================================================
// Recurring order store — Context + useReducer, persisted to localStorage.
// Per blueprint §3.4: this demonstrates the configuration UI and management
// UI only. No real scheduler/cron runs — pause/resume/delete just mutate
// local state.
// ============================================================================

import {
  createContext,
  useContext,
  useEffect,
  useReducer,
  useCallback,
  type ReactNode,
} from "react";
import type { RecurringOrder, OrderLine, RecurringFrequency } from "@/types";
import { readStorage, writeStorage, STORAGE_KEYS } from "./storage";
import { generateId } from "./utils";

type RecurringAction =
  | { type: "HYDRATE"; payload: RecurringOrder[] }
  | { type: "ADD"; payload: RecurringOrder }
  | { type: "TOGGLE_PAUSE"; payload: { id: string } }
  | { type: "DELETE"; payload: { id: string } };

function recurringReducer(state: RecurringOrder[], action: RecurringAction): RecurringOrder[] {
  switch (action.type) {
    case "HYDRATE":
      return action.payload;
    case "ADD":
      return [action.payload, ...state];
    case "TOGGLE_PAUSE":
      return state.map((r) => (r.id === action.payload.id ? { ...r, isPaused: !r.isPaused } : r));
    case "DELETE":
      return state.filter((r) => r.id !== action.payload.id);
    default:
      return state;
  }
}

interface CreateRecurringArgs {
  createdFromOrderId: string;
  lines: OrderLine[];
  frequency: RecurringFrequency;
  timeOfDay: string;
  startDate: string;
}

interface RecurringOrderContextValue {
  recurringOrders: RecurringOrder[];
  createRecurringOrder: (args: CreateRecurringArgs) => void;
  togglePause: (id: string) => void;
  deleteRecurringOrder: (id: string) => void;
}

const RecurringOrderContext = createContext<RecurringOrderContextValue | null>(null);

export function RecurringOrderProvider({ children }: { children: ReactNode }) {
  const [recurringOrders, dispatch] = useReducer(recurringReducer, []);

  useEffect(() => {
    const stored = readStorage<RecurringOrder[]>(STORAGE_KEYS.recurringOrders, []);
    dispatch({ type: "HYDRATE", payload: stored });
  }, []);

  useEffect(() => {
    writeStorage(STORAGE_KEYS.recurringOrders, recurringOrders);
  }, [recurringOrders]);

  const createRecurringOrder = useCallback((args: CreateRecurringArgs) => {
    const order: RecurringOrder = {
      id: generateId("rec"),
      createdFromOrderId: args.createdFromOrderId,
      lines: args.lines,
      frequency: args.frequency,
      timeOfDay: args.timeOfDay,
      startDate: args.startDate,
      isPaused: false,
    };
    dispatch({ type: "ADD", payload: order });
  }, []);

  const togglePause = useCallback((id: string) => {
    dispatch({ type: "TOGGLE_PAUSE", payload: { id } });
  }, []);

  const deleteRecurringOrder = useCallback((id: string) => {
    dispatch({ type: "DELETE", payload: { id } });
  }, []);

  return (
    <RecurringOrderContext.Provider
      value={{ recurringOrders, createRecurringOrder, togglePause, deleteRecurringOrder }}
    >
      {children}
    </RecurringOrderContext.Provider>
  );
}

export function useRecurringOrders(): RecurringOrderContextValue {
  const ctx = useContext(RecurringOrderContext);
  if (!ctx) throw new Error("useRecurringOrders must be used within RecurringOrderProvider");
  return ctx;
}

/** Human-readable summary, e.g. "Chicken Momo (Steam) — every weekday at 1:00 PM" */
export function summarizeRecurringOrder(order: RecurringOrder): string {
  const itemSummary =
    order.lines.length === 1
      ? `${order.lines[0].name} (${order.lines[0].variantLabel})`
      : `${order.lines[0].name} + ${order.lines.length - 1} more`;

  const frequencyLabel: Record<RecurringFrequency, string> = {
    daily: "every day",
    weekdays: "every weekday",
    weekly: "every week",
  };

  const [hourStr, minuteStr] = order.timeOfDay.split(":");
  const hour = parseInt(hourStr, 10);
  const minute = minuteStr;
  const period = hour >= 12 ? "PM" : "AM";
  const displayHour = hour % 12 === 0 ? 12 : hour % 12;

  return `${itemSummary} — ${frequencyLabel[order.frequency]} at ${displayHour}:${minute} ${period}`;
}
