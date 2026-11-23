import useFoodItems from "@/hooks/fetch-data/useFoodItems";
import { useSelector } from "react-redux";
import { useOrderFood } from "@/hooks/place-order/useOrderFood";
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

// The store the shopper has open. Food keeps it in Redux; Grocery and
// Medicine read it from their store query.
const useVisitedFoodStore = () =>
  useSelector((state) => state.dashboard.visitedFoodStore);
const NO_STORE = {};
const useVisitedGroceryStore = () => useGroceryStore().store ?? NO_STORE;
const useVisitedMedicineStore = () => useMedicineStore().store ?? NO_STORE;

// Per-module differences for the shared cart UI.
export const CART_MODULES = {
  food: {
    useVisitedStore: useVisitedFoodStore,
    imageBaseUrl: FOOD_ITEMS_IMAGES,
    titleField: "product_title_eng",
    useItems: useFoodItems,
    useOrder: useOrderFood,
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
