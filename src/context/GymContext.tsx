/**
 * GymContext.tsx
 *
 * Tracks the currently selected gym for trainer sessions.
 * Gym owners interact with all their gyms simultaneously (no selection needed),
 * but the context is still useful for filtered views in owner reports.
 *
 * Persists the selected gym ID to localStorage so refreshes don't reset state.
 */

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { Gym } from "../types";

const SELECTED_GYM_KEY = "anyfeast_selected_gym";

// ─── Context Shape ────────────────────────────────────────────────────────────

interface GymContextValue {
  selectedGym: Gym | null;
  selectGym: (gym: Gym) => void;
  clearSelectedGym: () => void;
}

// ─── Context Creation ─────────────────────────────────────────────────────────

const GymContext = createContext<GymContextValue | undefined>(undefined);

// ─── Provider ─────────────────────────────────────────────────────────────────

export const GymProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [selectedGym, setSelectedGym] = useState<Gym | null>(() => {
    // Restore from localStorage on first render
    const raw = localStorage.getItem(SELECTED_GYM_KEY);
    if (!raw) return null;
    try {
      return JSON.parse(raw) as Gym;
    } catch {
      return null;
    }
  });

  // Sync to localStorage whenever selection changes
  useEffect(() => {
    if (selectedGym) {
      localStorage.setItem(SELECTED_GYM_KEY, JSON.stringify(selectedGym));
    } else {
      localStorage.removeItem(SELECTED_GYM_KEY);
    }
  }, [selectedGym]);

  const selectGym = useCallback((gym: Gym) => {
    setSelectedGym(gym);
  }, []);

  const clearSelectedGym = useCallback(() => {
    setSelectedGym(null);
    localStorage.removeItem(SELECTED_GYM_KEY);
  }, []);

  const value = useMemo<GymContextValue>(
    () => ({ selectedGym, selectGym, clearSelectedGym }),
    [selectedGym, selectGym, clearSelectedGym]
  );

  return <GymContext.Provider value={value}>{children}</GymContext.Provider>;
};

// ─── Hook ─────────────────────────────────────────────────────────────────────

export const useGym = (): GymContextValue => {
  const ctx = useContext(GymContext);
  if (!ctx) {
    throw new Error("useGym must be used inside <GymProvider>");
  }
  return ctx;
};
