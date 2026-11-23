import { useCartStore } from "./cartStore";
import { usePreferencesStore } from "./preferencesStore";
import { useSessionStore } from "./sessionStore";
import { useWishlistStore } from "./wishlistStore";
import { useHealthStore } from "./healthStore";
import { useFavouritesStore } from "./favouritesStore";
import type { LegacyAwareStorage } from "./storage";
import { removeLegacyData } from "./legacy";

type Persisted = {
  persist: {
    rehydrate: () => Promise<void> | void;
    getOptions: () => { storage?: unknown };
  };
  setState: (partial: object) => void;
};

/** True when the store's own key already holds a saved value. */
function hasOwnValue(store: Persisted): boolean {
  const storage = store.persist.getOptions().storage as
    | Partial<LegacyAwareStorage<unknown>>
    | undefined;
  return storage?.hasOwn?.() ?? true;
}

/**
 * Loads the Zustand stores from storage. A store whose own key was empty
 * (first load after the Redux era) is then written under the new key, and
 * once every store is saved the old `persist:root` / `cart` keys are deleted.
 * A store with a saved key is never rewritten here, even if rehydrate dropped
 * it. Never rejects, so the app always renders even if a store fails to
 * rehydrate (the old keys are then kept for the next load).
 */
export async function hydrateStores(): Promise<void> {
  try {
    const stores: Persisted[] = [
      useCartStore,
      useSessionStore,
      usePreferencesStore,
      useWishlistStore,
      useHealthStore,
      useFavouritesStore,
    ];
    const needsWrite = stores.map((s) => !hasOwnValue(s));
    await Promise.all(stores.map((s) => s.persist.rehydrate()));
    stores.forEach((s, i) => {
      // An empty setState runs the persist middleware's write.
      if (needsWrite[i]) s.setState({});
    });
    removeLegacyData();
  } catch (error) {
    // Keep initial state; the app still renders.
    if (process.env.NODE_ENV !== "production") console.warn("store hydration failed", error);
  }
}
