import { initialCartState, useCartStore } from "./cartStore";
import { initialPreferencesState, usePreferencesStore } from "./preferencesStore";
import { initialSessionState, useSessionStore } from "./sessionStore";
import { initialWishlistState, useWishlistStore } from "./wishlistStore";
import { initialHealthState, useHealthStore } from "./healthStore";

/**
 * Sample/live data switch: wipes the session, the current module, the Fashion
 * wishlist, the patients and appointments, and the grocery, food and medicine
 * carts, but keeps the visitor's Fashion bag. Writes reset state (persist
 * saves it synchronously) instead of removing the keys, so the next load does
 * not fall back to the old pre-migration data.
 */
export function resetForSampleSwitch(): void {
  useSessionStore.setState(initialSessionState);
  usePreferencesStore.setState(initialPreferencesState);
  useWishlistStore.setState(initialWishlistState);
  useHealthStore.setState(initialHealthState);
  useCartStore.setState({
    ...initialCartState,
    fashion: useCartStore.getState().fashion,
  });
}
