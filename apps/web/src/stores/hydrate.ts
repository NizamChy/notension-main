import { useCartStore } from "./cartStore";
import { useSessionStore } from "./sessionStore";

/**
 * Loads both Zustand stores from storage. Never rejects, so the PersistGate
 * always lifts even if a store fails to rehydrate.
 */
export async function hydrateStores(): Promise<void> {
  try {
    await Promise.all([
      useCartStore.persist.rehydrate(),
      useSessionStore.persist.rehydrate(),
    ]);
  } catch {
    // Keep initial state; the app still renders.
  }
}
