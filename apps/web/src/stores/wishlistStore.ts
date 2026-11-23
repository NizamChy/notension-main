import { create } from "zustand";
import { persist } from "zustand/middleware";
import { readLegacyRoot } from "./legacy";
import { legacyAwareStorage } from "./storage";

/** A saved Fashion product: the product as the card or details page had it. */
export type WishlistItem = { _id: string; [field: string]: unknown };

export type WishlistState = {
  items: WishlistItem[];
};

type WishlistActions = {
  add: (item: WishlistItem) => void;
  remove: (id: string) => void;
  /** Adds the product, or removes it when it is already saved. Returns true when added. */
  toggle: (item: WishlistItem) => boolean;
  clear: () => void;
};

export const initialWishlistState: WishlistState = { items: [] };

const isItem = (v: unknown): v is WishlistItem =>
  !!v && typeof v === "object" && !Array.isArray(v) && typeof (v as { _id?: unknown })._id === "string";

/** Builds the store state from the old Redux `userChoice.favouriteFashionItems`. */
export function wishlistFromLegacy(s: Pick<Storage, "getItem">): WishlistState | null {
  const userChoice = readLegacyRoot(s)?.userChoice;
  const saved = userChoice?.favouriteFashionItems;
  if (!Array.isArray(saved)) return null;
  // One entry per product: the old reducer never checked for repeats.
  const items = saved.filter(isItem).filter((item, i, all) => all.findIndex((o) => o._id === item._id) === i);
  return items.length > 0 ? { items } : null;
}

export const useWishlistStore = create<WishlistState & WishlistActions>()(
  persist(
    (set, get) => ({
      ...initialWishlistState,
      add: (item) => {
        if (get().items.some((o) => o._id === item._id)) return;
        set({ items: [...get().items, item] });
      },
      remove: (id) => set({ items: get().items.filter((o) => o._id !== id) }),
      toggle: (item) => {
        const saved = get().items.some((o) => o._id === item._id);
        if (saved) get().remove(item._id);
        else get().add(item);
        return !saved;
      },
      clear: () => set(initialWishlistState),
    }),
    {
      name: "notension-wishlist",
      version: 1,
      skipHydration: true,
      storage: legacyAwareStorage<WishlistState>("notension-wishlist", 1, wishlistFromLegacy),
      partialize: (s): WishlistState => ({ items: s.items }),
    },
  ),
);

/** True when the product is in the wishlist (re-renders only when that changes). */
export const useIsWishlisted = (id: string | null | undefined) =>
  useWishlistStore((s) => !!id && s.items.some((o) => o._id === id));
