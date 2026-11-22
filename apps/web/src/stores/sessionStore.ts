import { create } from "zustand";
import { persist } from "zustand/middleware";
import { readLegacyRoot } from "./legacy";
import { legacyAwareStorage } from "./storage";

/** The delivery location saved by SAVE_USER_CURRENT_LOCATION (see utils/userLocation). */
export type UserLocation = {
  userLatitude: string;
  userLongitude: string;
  districtId: string;
  districtName?: string;
  address?: string;
  [k: string]: unknown;
};

export type SessionState = {
  isLoggedin: boolean;
  userInfo: Record<string, unknown>;
  currentUserLocation: UserLocation | Record<string, never>;
  userLatitude: string;
  userLongitude: string;
  districtId: string;
  deliveryAddress: string;
};

type SessionActions = {
  login: (userInfo: Record<string, unknown>) => void;
  saveLocation: (loc: UserLocation) => void;
  clearAccount: () => void;
};

export const initialSessionState: SessionState = {
  isLoggedin: false,
  userInfo: {},
  currentUserLocation: {},
  userLatitude: "00",
  userLongitude: "00",
  districtId: "00",
  deliveryAddress: "",
};

function isRecord(v: unknown): v is Record<string, unknown> {
  return !!v && typeof v === "object" && !Array.isArray(v);
}

/** Builds the store state from the old Redux `user` slice; bad fields take defaults. */
export function sessionFromLegacy(s: Pick<Storage, "getItem">): SessionState | null {
  const root = readLegacyRoot(s);
  const user = root?.user;
  if (!isRecord(user)) return null;
  const str = (v: unknown, fallback: string) => (typeof v === "string" ? v : fallback);
  const d = initialSessionState;
  return {
    isLoggedin: typeof user.isLoggedin === "boolean" ? user.isLoggedin : d.isLoggedin,
    userInfo: isRecord(user.userInfo) ? user.userInfo : {},
    currentUserLocation: isRecord(user.currentUserLocation)
      ? (user.currentUserLocation as UserLocation)
      : {},
    userLatitude: str(user.userLatitude, d.userLatitude),
    userLongitude: str(user.userLongitude, d.userLongitude),
    districtId: str(user.districtId, d.districtId),
    deliveryAddress: str(user.deliveryAddress, d.deliveryAddress),
  };
}

export const useSessionStore = create<SessionState & SessionActions>()(
  persist(
    (set) => ({
      ...initialSessionState,

      login: (userInfo) => set({ isLoggedin: true, userInfo }),

      saveLocation: (loc) =>
        set({
          currentUserLocation: loc,
          userLatitude: loc?.userLatitude || "00",
          userLongitude: loc?.userLongitude || "00",
          districtId: loc?.districtId || "00",
        }),

      // Account data goes; the chosen location and delivery address stay.
      clearAccount: () => set({ isLoggedin: false, userInfo: {} }),
    }),
    {
      name: "notension-session",
      version: 1,
      skipHydration: true,
      storage: legacyAwareStorage<SessionState>(
        "notension-session",
        1,
        sessionFromLegacy,
      ),
      partialize: (s): SessionState => ({
        isLoggedin: s.isLoggedin,
        userInfo: s.userInfo,
        currentUserLocation: s.currentUserLocation,
        userLatitude: s.userLatitude,
        userLongitude: s.userLongitude,
        districtId: s.districtId,
        deliveryAddress: s.deliveryAddress,
      }),
    },
  ),
);
