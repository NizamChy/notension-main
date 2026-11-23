import { useModuleCart } from "@/stores/useModuleCart";
import { requestStoreSwitch } from "@/components/Cart/StoreSwitch";
import type { MedicineItem } from "@/lib/api/medicine";
import { useMedicineStore } from "./useMedicineStore";

/** The medicine cart, with the visited pharmacy taken from the store query. */
export function useMedicineCart() {
  const cart = useModuleCart("medicine");
  const { store: visitedStore } = useMedicineStore();
  const cartStore = cart.storeInfo as { _id?: string; shop_name?: string };

  const getCurrentQty = (item: { _id?: string }) =>
    cart.items?.find((line) => line?._id === item?._id)?.quantity ?? 0;

  const saveStoreAndProduct = (product: Parameters<typeof cart.add>[0]) => {
    cart.add(product);
    cart.saveStoreInfo((visitedStore ?? {}) as Record<string, unknown>);
  };

  const addToCart = (item: Partial<MedicineItem>): boolean => {
    // The pharmacy is still loading (or closed): nothing to save the cart against yet.
    if (!visitedStore) return false;
    const product = {
      _id: item?._id as string,
      medStoreProductInfo: item?.medStoreProductInfo,
      item_title_eng: item?.item_title_eng || "",
      item_title_beng: item?.item_title_beng || "",
      pack_size: item?.pack_size || "",
      purchase_price: item?.purchase_price || 0,
      max_retail_price: item?.max_retail_price || 0,
      sale_price: item?.sale_price || 0,
      unit_symbol: item?.unit_symbol || "",
      max_allowed: item?.max_allowed || 0,
      quantity: 1,
      delivered_qty: 0,
      inc_qty: 1,
      app_image: item?.app_image,
    };

    if (cart.items.length > 0) {
      if (cartStore?._id && cartStore._id !== visitedStore?._id) {
        requestStoreSwitch({
          fromStore: cartStore.shop_name,
          toStore: visitedStore?.shop_name,
          onConfirm: () => {
            cart.clear();
            saveStoreAndProduct(product);
          },
        });
        return false;
      }
      cart.add(product);
    } else {
      saveStoreAndProduct(product);
    }
    return true;
  };

  return {
    addToCart,
    incrementQty: (id: string) => cart.increment(id),
    decrementQty: (id: string) => cart.decrement(id),
    getCurrentQty,
    removeFromCart: (id: string) => cart.remove(id),
  };
}
