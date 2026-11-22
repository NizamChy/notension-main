import { useCartStore } from "./cartStore";
import { useSessionStore } from "./sessionStore";

/**
 * Loads both Zustand stores from storage, then writes the hydrated state under
 * the new keys so migrated data never depends on `persist:root` again. Never
 * rejects, so the PersistGate always lifts even if a store fails to rehydrate.
 */
export async function hydrateStores(): Promise<void> {
  try {
    await Promise.all([
      useCartStore.persist.rehydrate(),
      useSessionStore.persist.rehydrate(),
    ]);
    // An empty setState runs the persist middleware's write.
    useCartStore.setState({});
    useSessionStore.setState({});
  } catch (error) {
    // Keep initial state; the app still renders.
    if (process.env.NODE_ENV !== "production") console.warn("store hydration failed", error);
  }
}
