import { create } from "zustand";
import { persist } from "zustand/middleware";
import { readLegacyRoot } from "./legacy";
import { legacyAwareStorage } from "./storage";

// The account's favourite stores, items, centres and doctors, kept on the
// device as the Redux userChoice lists were (the app never read them back from
// the server). Cleared on logout and on the sample/live switch.

export type FavouriteKind = "store" | "item" | "list";

/** A saved favourite: the server entry plus the snapshot the card shows. */
export type Favourite = { _id?: string; merchantType?: number; [field: string]: unknown };

/** "store:0", "item:1", "list:4", ... */
export type ListKey = `${FavouriteKind}:${number}`;

export type FavouritesState = { lists: Partial<Record<ListKey, Favourite[]>> };

type FavouritesActions = {
  /** Adds entries, replacing any with the same saved id. */
  add: (kind: FavouriteKind, merchantType: number, entries: Favourite[]) => void;
  remove: (kind: FavouriteKind, merchantType: number, refId: string) => void;
  clear: () => void;
};

export const ID_FIELD: Record<FavouriteKind, "storeId" | "productId" | "mongodbId"> = {
  store: "storeId",
  item: "productId",
  list: "mongodbId",
};

export const listKey = (kind: FavouriteKind, merchantType: number): ListKey => `${kind}:${merchantType}`;

export const initialFavouritesState: FavouritesState = { lists: {} };

// Where each list lived in the old Redux userChoice slice.
const LEGACY_FIELDS: [ListKey, string][] = [
  ["store:0", "favouriteGroceryStore"],
  ["store:1", "favouriteMedicineStore"],
  ["store:2", "favouriteFoodShop"],
  ["item:0", "favouriteGroceryItems"],
  ["item:1", "favouriteMedicineItems"],
  ["list:3", "favouriteConsultationCentre"],
  ["list:4", "favouriteDoctors"],
];

const isEntry = (v: unknown): v is Favourite => !!v && typeof v === "object" && !Array.isArray(v);

/** Builds the store state from the old Redux `userChoice` favourite lists. */
export function favouritesFromLegacy(s: Pick<Storage, "getItem">): FavouritesState | null {
  const userChoice = readLegacyRoot(s)?.userChoice;
  if (!userChoice) return null;
  const lists: FavouritesState["lists"] = {};
  for (const [key, field] of LEGACY_FIELDS) {
    const saved = userChoice[field];
    if (Array.isArray(saved) && saved.length > 0) lists[key] = saved.filter(isEntry);
  }
  return Object.keys(lists).length > 0 ? { lists } : null;
}

export const useFavouritesStore = create<FavouritesState & FavouritesActions>()(
  persist(
    (set, get) => ({
      ...initialFavouritesState,
      add: (kind, merchantType, entries) => {
        const key = listKey(kind, merchantType);
        const idField = ID_FIELD[kind];
        const added = entries.filter(isEntry);
        const ids = new Set(added.map((e) => e[idField]));
        const kept = (get().lists[key] ?? []).filter((e) => !ids.has(e[idField]));
        set({ lists: { ...get().lists, [key]: [...kept, ...added] } });
      },
      remove: (kind, merchantType, refId) => {
        const key = listKey(kind, merchantType);
        const idField = ID_FIELD[kind];
        set({
          lists: { ...get().lists, [key]: (get().lists[key] ?? []).filter((e) => e[idField] !== refId) },
        });
      },
      clear: () => set(initialFavouritesState),
    }),
    {
      name: "notension-favourites",
      version: 1,
      skipHydration: true,
      storage: legacyAwareStorage<FavouritesState>("notension-favourites", 1, favouritesFromLegacy),
      partialize: (s): FavouritesState => ({ lists: s.lists }),
    },
  ),
);

const EMPTY: Favourite[] = [];

/** One favourite list (stable reference while it does not change). */
export const useFavouriteEntries = (kind: FavouriteKind, merchantType: number): Favourite[] =>
  useFavouritesStore((s) => s.lists[listKey(kind, merchantType)] ?? EMPTY);
