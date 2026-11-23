import { create } from "zustand";
import { persist } from "zustand/middleware";
import { readLegacyRoot } from "./legacy";
import { legacyAwareStorage } from "./storage";

/** "dashboard", "Grocery", "Medicine", "Food" or a doctor / all-care value. */
export type ModuleName = string;

export type PreferencesState = {
  currentModule: ModuleName;
};

type PreferencesActions = {
  setCurrentModule: (m: ModuleName) => void;
};

export const initialPreferencesState: PreferencesState = {
  currentModule: "dashboard",
};

/** Builds the store state from the old Redux `dashboard` slice. */
export function preferencesFromLegacy(
  s: Pick<Storage, "getItem">,
): PreferencesState | null {
  const dashboard = readLegacyRoot(s)?.dashboard;
  if (!dashboard || typeof dashboard !== "object" || Array.isArray(dashboard)) return null;
  const m = (dashboard as Record<string, unknown>).currentModule;
  return typeof m === "string" && m.length > 0 ? { currentModule: m } : null;
}

export const usePreferencesStore = create<PreferencesState & PreferencesActions>()(
  persist(
    (set) => ({
      ...initialPreferencesState,
      setCurrentModule: (m) => set({ currentModule: m }),
    }),
    {
      name: "notension-preferences",
      version: 1,
      skipHydration: true,
      storage: legacyAwareStorage<PreferencesState>(
        "notension-preferences",
        1,
        preferencesFromLegacy,
      ),
      partialize: (s): PreferencesState => ({ currentModule: s.currentModule }),
    },
  ),
);
