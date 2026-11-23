import { useCartStore } from "./cartStore";
import { usePreferencesStore } from "./preferencesStore";
import { useSessionStore } from "./sessionStore";
import { useWishlistStore } from "./wishlistStore";
import type { LegacyAwareStorage } from "./storage";

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
 * (first load after the Redux era) is then written under the new key, so
 * migrated data never depends on `persist:root` again. A store with a saved
 * key is never rewritten here, even if rehydrate dropped it. Never rejects,
 * so the PersistGate always lifts even if a store fails to rehydrate.
 */
export async function hydrateStores(): Promise<void> {
  try {
    const stores: Persisted[] = [
      useCartStore,
      useSessionStore,
      usePreferencesStore,
      useWishlistStore,
    ];
    const needsWrite = stores.map((s) => !hasOwnValue(s));
    await Promise.all(stores.map((s) => s.persist.rehydrate()));
    stores.forEach((s, i) => {
      // An empty setState runs the persist middleware's write.
      if (needsWrite[i]) s.setState({});
    });
  } catch (error) {
    // Keep initial state; the app still renders.
    if (process.env.NODE_ENV !== "production") console.warn("store hydration failed", error);
  }
}
