import { initialCartState, useCartStore } from "./cartStore";
import { initialSessionState, useSessionStore } from "./sessionStore";

/**
 * Sample/live data switch: wipes the session and the grocery, food and
 * medicine carts but keeps the visitor's Fashion bag. Writes reset state
 * (persist saves it synchronously) instead of removing the keys, so the next
 * load does not fall back to the old pre-migration data.
 */
export function resetForSampleSwitch(): void {
  useSessionStore.setState(initialSessionState);
  useCartStore.setState({
    ...initialCartState,
    fashion: useCartStore.getState().fashion,
  });
}
