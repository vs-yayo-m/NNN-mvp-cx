"use client";

// ============================================================================
// Address store — Context + useReducer, persisted to localStorage.
// Saved delivery addresses (add/edit/delete), per blueprint §3.3.
// ============================================================================

import {
  createContext,
  useContext,
  useEffect,
  useReducer,
  useCallback,
  type ReactNode,
} from "react";
import type { SavedAddress } from "@/types";
import { readStorage, writeStorage, STORAGE_KEYS } from "./storage";
import { generateId } from "./utils";

type AddressAction =
  | { type: "HYDRATE"; payload: SavedAddress[] }
  | { type: "ADD"; payload: SavedAddress }
  | { type: "UPDATE"; payload: SavedAddress }
  | { type: "DELETE"; payload: { id: string } };

function addressReducer(state: SavedAddress[], action: AddressAction): SavedAddress[] {
  switch (action.type) {
    case "HYDRATE":
      return action.payload;
    case "ADD": {
      // If the new address is marked default, un-default all others.
      const next = action.payload.isDefault
        ? state.map((a) => ({ ...a, isDefault: false }))
        : state;
      return [...next, action.payload];
    }
    case "UPDATE": {
      const next = action.payload.isDefault
        ? state.map((a) => ({ ...a, isDefault: false }))
        : state;
      return next.map((a) => (a.id === action.payload.id ? action.payload : a));
    }
    case "DELETE":
      return state.filter((a) => a.id !== action.payload.id);
    default:
      return state;
  }
}

interface AddressContextValue {
  addresses: SavedAddress[];
  addAddress: (input: Omit<SavedAddress, "id">) => void;
  updateAddress: (address: SavedAddress) => void;
  deleteAddress: (id: string) => void;
}

const AddressContext = createContext<AddressContextValue | null>(null);

export function AddressProvider({ children }: { children: ReactNode }) {
  const [addresses, dispatch] = useReducer(addressReducer, []);

  useEffect(() => {
    const stored = readStorage<SavedAddress[]>(STORAGE_KEYS.addresses, []);
    dispatch({ type: "HYDRATE", payload: stored });
  }, []);

  useEffect(() => {
    writeStorage(STORAGE_KEYS.addresses, addresses);
  }, [addresses]);

  const addAddress = useCallback((input: Omit<SavedAddress, "id">) => {
    dispatch({ type: "ADD", payload: { ...input, id: generateId("addr") } });
  }, []);

  const updateAddress = useCallback((address: SavedAddress) => {
    dispatch({ type: "UPDATE", payload: address });
  }, []);

  const deleteAddress = useCallback((id: string) => {
    dispatch({ type: "DELETE", payload: { id } });
  }, []);

  return (
    <AddressContext.Provider value={{ addresses, addAddress, updateAddress, deleteAddress }}>
      {children}
    </AddressContext.Provider>
  );
}

export function useAddresses(): AddressContextValue {
  const ctx = useContext(AddressContext);
  if (!ctx) throw new Error("useAddresses must be used within AddressProvider");
  return ctx;
}
