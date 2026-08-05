"use client";

// ============================================================================
// Auth store — Context + useReducer, persisted to localStorage.
// Handles the OTP login flow's session state: current phone/name, whether
// onboarding (name capture) is needed, and the "known phone numbers" list
// used to distinguish new vs. returning users per blueprint §3.2.
// ============================================================================

import {
  createContext,
  useContext,
  useEffect,
  useReducer,
  useCallback,
  type ReactNode,
} from "react";
import type { AuthState, UserProfile, LoginReturnContext } from "@/types";
import { readStorage, writeStorage, removeStorage, STORAGE_KEYS } from "./storage";

type AuthAction =
  | { type: "HYDRATE"; payload: AuthState }
  | { type: "LOGIN"; payload: UserProfile }
  | { type: "LOGOUT" };

const initialState: AuthState = {
  isLoggedIn: false,
  profile: null,
};

function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case "HYDRATE":
      return action.payload;
    case "LOGIN":
      return { isLoggedIn: true, profile: action.payload };
    case "LOGOUT":
      return initialState;
    default:
      return state;
  }
}

interface AuthContextValue {
  state: AuthState;
  /** Returns true if this phone has an existing profile (returning user). */
  isKnownPhone: (phone: string) => boolean;
  /** Logs in a returning user whose profile already exists in storage. */
  loginReturning: (phone: string) => UserProfile | null;
  /** Completes onboarding for a brand-new phone number. */
  completeOnboarding: (phone: string, name: string) => UserProfile;
  logout: () => void;
  setReturnContext: (ctx: LoginReturnContext) => void;
  getReturnContext: () => LoginReturnContext | null;
  clearReturnContext: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

interface KnownProfilesMap {
  [phone: string]: UserProfile;
}

function readKnownProfiles(): KnownProfilesMap {
  return readStorage<KnownProfilesMap>(STORAGE_KEYS.knownPhones, {});
}

function writeKnownProfiles(map: KnownProfilesMap): void {
  writeStorage(STORAGE_KEYS.knownPhones, map);
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(authReducer, initialState);

  useEffect(() => {
    const stored = readStorage<AuthState>(STORAGE_KEYS.auth, initialState);
    dispatch({ type: "HYDRATE", payload: stored });
  }, []);

  useEffect(() => {
    writeStorage(STORAGE_KEYS.auth, state);
  }, [state]);

  const isKnownPhone = useCallback((phone: string): boolean => {
    const known = readKnownProfiles();
    return Boolean(known[phone]);
  }, []);

  const loginReturning = useCallback((phone: string): UserProfile | null => {
    const known = readKnownProfiles();
    const profile = known[phone];
    if (!profile) return null;
    dispatch({ type: "LOGIN", payload: profile });
    return profile;
  }, []);

  const completeOnboarding = useCallback((phone: string, name: string): UserProfile => {
    const profile: UserProfile = {
      phone,
      name: name.trim(),
      createdAt: new Date().toISOString(),
    };
    const known = readKnownProfiles();
    known[phone] = profile;
    writeKnownProfiles(known);
    dispatch({ type: "LOGIN", payload: profile });
    return profile;
  }, []);

  const logout = useCallback(() => {
    dispatch({ type: "LOGOUT" });
  }, []);

  const setReturnContext = useCallback((ctx: LoginReturnContext) => {
    writeStorage(STORAGE_KEYS.loginReturnContext, ctx);
  }, []);

  const getReturnContext = useCallback((): LoginReturnContext | null => {
    return readStorage<LoginReturnContext | null>(STORAGE_KEYS.loginReturnContext, null);
  }, []);

  const clearReturnContext = useCallback(() => {
    removeStorage(STORAGE_KEYS.loginReturnContext);
  }, []);

  const value: AuthContextValue = {
    state,
    isKnownPhone,
    loginReturning,
    completeOnboarding,
    logout,
    setReturnContext,
    getReturnContext,
    clearReturnContext,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
