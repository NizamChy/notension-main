import useFoodItems from "@/hooks/fetch-data/useFoodItems";
import { useSelector } from "react-redux";
import useMedicineItems from "@/hooks/fetch-data/useMedicineItems";
import { useOrderFood } from "@/hooks/place-order/useOrderFood";
import { useGroceryCart } from "@/hooks/grocery/useGroceryCart";
import { useGroceryStore } from "@/hooks/grocery/useGroceryStore";
import { usePlaceGroceryOrder } from "@/hooks/grocery/usePlaceGroceryOrder";
import { useOrderMedicine } from "@/hooks/place-order/useOrderMedicine";
import {
  FOOD_ITEMS_IMAGES,
  GROCERY_ITEMS_IMAGES,
  MEDICINE_ITEMS_IMAGES,
} from "@/api-endpoints/api-endpoint";

// The store the shopper has open. Food and Medicine keep it in Redux; Grocery
// reads it from the store query.
const useVisitedFoodStore = () =>
  useSelector((state) => state.dashboard.visitedFoodStore);
const NO_STORE = {};
const useVisitedGroceryStore = () => useGroceryStore().store ?? NO_STORE;
const useVisitedMedicineStore = () =>
  useSelector((state) => state.dashboard.visitedMedicineStore);

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
    useItems: useMedicineItems,
    useOrder: useOrderMedicine,
  },
};
