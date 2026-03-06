"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useSyncExternalStore,
} from "react";
import { ACCENT_OPTIONS, type AccentId } from "@/lib/theme";

const ACCENT_STORAGE_KEY = "revelio-accent";
const DEFAULT_ACCENT: AccentId = "orange";

interface AccentContextValue {
  accentId: AccentId;
  accentColor: string;
  setAccentId: (id: AccentId) => void;
}

const AccentContext = createContext<AccentContextValue | null>(null);
const listeners = new Set<() => void>();

const isAccentId = (value: string): value is AccentId =>
  ACCENT_OPTIONS.some((option) => option.id === value);

const getStoredAccentId = (): AccentId => {
  if (typeof window === "undefined") return DEFAULT_ACCENT;
  const storedAccent = window.localStorage.getItem(ACCENT_STORAGE_KEY);
  return storedAccent && isAccentId(storedAccent)
    ? storedAccent
    : DEFAULT_ACCENT;
};

const notifyAccentChange = () => {
  listeners.forEach((listener) => listener());
};

const subscribeAccent = (onStoreChange: () => void) => {
  listeners.add(onStoreChange);
  if (typeof window !== "undefined") {
    window.addEventListener("storage", onStoreChange);
  }
  return () => {
    listeners.delete(onStoreChange);
    if (typeof window !== "undefined") {
      window.removeEventListener("storage", onStoreChange);
    }
  };
};

const setStoredAccentId = (accentId: AccentId) => {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(ACCENT_STORAGE_KEY, accentId);
  notifyAccentChange();
};

const AccentProvider = ({ children }: { children: React.ReactNode }) => {
  const accentId = useSyncExternalStore(
    subscribeAccent,
    getStoredAccentId,
    () => DEFAULT_ACCENT,
  );
  const accentColor =
    ACCENT_OPTIONS.find((option) => option.id === accentId)?.value ??
    ACCENT_OPTIONS[0].value;

  const setAccentId = useCallback((id: AccentId) => {
    if (id === getStoredAccentId()) return;
    setStoredAccentId(id);
  }, []);

  useEffect(() => {
    document.documentElement.style.setProperty("--primary", accentColor);
  }, [accentColor]);

  const value = useMemo(
    () => ({ accentId, accentColor, setAccentId }),
    [accentId, accentColor, setAccentId],
  );

  return (
    <AccentContext.Provider value={value}>{children}</AccentContext.Provider>
  );
};

export const useAccent = (): AccentContextValue => {
  const context = useContext(AccentContext);
  if (!context) {
    throw new Error("useAccent must be used within an AccentProvider");
  }
  return context;
};

export default AccentProvider;
