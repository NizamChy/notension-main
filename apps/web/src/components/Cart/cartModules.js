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

// The store the shopper has open, from each module's store query.
const NO_STORE = {};
const useVisitedFoodStore = () => useFoodStore().store ?? NO_STORE;
const useVisitedGroceryStore = () => useGroceryStore().store ?? NO_STORE;
const useVisitedMedicineStore = () => useMedicineStore().store ?? NO_STORE;

// Per-module differences for the shared cart UI.
export const CART_MODULES = {
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
