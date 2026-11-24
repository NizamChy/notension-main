import { useSyncExternalStore } from "react";

const subscribe = () => () => {};

/**
 * `false` on the server and while hydrating, `true` afterwards (and on every
 * client-side render after that). Replaces the `mounted` flag set in an
 * effect without the extra cascading render.
 */
export function useIsClient(): boolean {
  return useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );
}
