import { useMemo } from "react";
import {
  cartTotal,
  useCartStore,
  type CartItemInput,
  type CartModule,
} from "./cartStore";

/** One module's cart (grocery, food or medicine) with actions bound to it. */
export function useModuleCart(m: CartModule) {
  const cart = useCartStore((s) => s[m]);
  const total = useMemo(() => cartTotal(cart), [cart]);

  const actions = useMemo(
    () => ({
      add: (item: CartItemInput) => useCartStore.getState().add(m, item),
      remove: (id: string) => useCartStore.getState().remove(m, id),
      increment: (id: string) => useCartStore.getState().increment(m, id),
      decrement: (id: string) => useCartStore.getState().decrement(m, id),
      clear: () => useCartStore.getState().clear(m),
      saveStoreInfo: (info: Record<string, unknown>) =>
        useCartStore.getState().saveStoreInfo(m, info),
    }),
    [m],
  );

  return {
    items: cart.items,
    storeInfo: cart.storeInfo,
    startAt: cart.startAt,
    total,
    ...actions,
  };
}
