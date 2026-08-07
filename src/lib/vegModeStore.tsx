// /src/lib/vegModeStore.tsx
"use client";

import {
  createContext,
  useContext,
  useEffect,
  useReducer,
  useCallback,
  type ReactNode,
} from "react";
import { readStorage, writeStorage, STORAGE_KEYS } from "./storage";

interface VegModeState {
  isVegOnly: boolean;
}

type VegModeAction =
  | { type: "HYDRATE"; payload: VegModeState }
  | { type: "SET"; payload: boolean }
  | { type: "TOGGLE" };

const initialState: VegModeState = {
  isVegOnly: false,
};

function vegModeReducer(state: VegModeState, action: VegModeAction): VegModeState {
  switch (action.type) {
    case "HYDRATE":
      return action.payload;
    case "SET":
      return { isVegOnly: action.payload };
    case "TOGGLE":
      return { isVegOnly: !state.isVegOnly };
    default:
      return state;
  }
}

interface VegModeContextValue {
  isVegOnly: boolean;
  setVegOnly: (value: boolean) => void;
  toggleVegOnly: () => void;
}

const VegModeContext = createContext<VegModeContextValue | null>(null);

export function VegModeProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(vegModeReducer, initialState);

  // Hydrate from localStorage on mount (client-only) — same pattern as
  // CartProvider/AuthProvider so SSR/client markup never mismatches.
  useEffect(() => {
    const stored = readStorage<VegModeState>(STORAGE_KEYS.vegMode, initialState);
    dispatch({ type: "HYDRATE", payload: stored });
  }, []);

  // Persist on every change, so the preference survives across visits.
  useEffect(() => {
    writeStorage(STORAGE_KEYS.vegMode, state);
  }, [state]);

  const setVegOnly = useCallback((value: boolean) => {
    dispatch({ type: "SET", payload: value });
  }, []);

  const toggleVegOnly = useCallback(() => {
    dispatch({ type: "TOGGLE" });
  }, []);

  const value: VegModeContextValue = {
    isVegOnly: state.isVegOnly,
    setVegOnly,
    toggleVegOnly,
  };

  return (
    <VegModeContext.Provider value={value}>{children}</VegModeContext.Provider>
  );
}

export function useVegMode(): VegModeContextValue {
  const ctx = useContext(VegModeContext);
  if (!ctx) throw new Error("useVegMode must be used within VegModeProvider");
  return ctx;
}
