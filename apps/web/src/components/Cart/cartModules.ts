import type { CartModule } from "@/stores/cartStore";
import { useFoodCart } from "@/hooks/food/useFoodCart";
import { useFoodStore } from "@/hooks/food/useFoodStore";
import { usePlaceFoodOrder } from "@/hooks/food/usePlaceFoodOrder";
import { useGroceryCart } from "@/hooks/grocery/useGroceryCart";
import { useGroceryStore } from "@/hooks/grocery/useGroceryStore";
import { usePlaceGroceryOrder } from "@/hooks/grocery/usePlaceGroceryOrder";
import { useMedicineCart } from "@/hooks/medicine/useMedicineCart";
import { useMedicineStore } from "@/hooks/medicine/useMedicineStore";
import { usePlaceMedicineOrder } from "@/hooks/medicine/usePlaceMedicineOrder";
import {
  FOOD_ITEMS_IMAGES,
  GROCERY_ITEMS_IMAGES,
  MEDICINE_ITEMS_IMAGES,
} from "@/api-endpoints/api-endpoint";

/** The store fields the cart UI reads (visited store or the cart's store). */
export type CartStoreInfo = {
  _id?: string;
  custom_store_id?: string;
  shop_name?: string;
  delivery_notice?: string;
};

export type CartModuleConfig = {
  useVisitedStore: () => CartStoreInfo;
  imageBaseUrl: string;
  /** The cart line's title field. */
  titleField: "product_title_eng" | "item_title_eng";
  useItems: () => {
    incrementQty: (id: string) => void;
    decrementQty: (id: string) => void;
    removeFromCart: (id: string) => void;
  };
  useOrder: () => { shippingCharge: number; discount: number; grandTotal: number };
};

// The store the shopper has open, from each module's store query.
const NO_STORE: CartStoreInfo = {};
const useVisitedFoodStore = (): CartStoreInfo => useFoodStore().store ?? NO_STORE;
const useVisitedGroceryStore = (): CartStoreInfo => useGroceryStore().store ?? NO_STORE;
const useVisitedMedicineStore = (): CartStoreInfo => useMedicineStore().store ?? NO_STORE;

// Per-module differences for the shared cart UI.
export const CART_MODULES: Record<CartModule, CartModuleConfig> = {
  food: {
    useVisitedStore: useVisitedFoodStore,
    imageBaseUrl: FOOD_ITEMS_IMAGES,
    titleField: "product_title_eng",
    useItems: useFoodCart,
    useOrder: usePlaceFoodOrder,
  },
  grocery: {
    useVisitedStore: useVisitedGroceryStore,
    imageBaseUrl: GROCERY_ITEMS_IMAGES,
    titleField: "product_title_eng",
    useItems: useGroceryCart,
    useOrder: usePlaceGroceryOrder,
  },
  medicine: {
    useVisitedStore: useVisitedMedicineStore,
    imageBaseUrl: MEDICINE_ITEMS_IMAGES,
    titleField: "item_title_eng",
    useItems: useMedicineCart,
    useOrder: usePlaceMedicineOrder,
  },
};

/** Whether `name` is a module with a cart (grocery, food or medicine). */
export const isCartModule = (name: string | null | undefined): name is CartModule =>
  !!name && Object.hasOwn(CART_MODULES, name);
