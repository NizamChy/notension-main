import useFoodItems from "@/hooks/fetch-data/useFoodItems";
import useGroceryItems from "@/hooks/fetch-data/useGroceryItems";
import useMedicineItems from "@/hooks/fetch-data/useMedicineItems";
import { useOrderFood } from "@/hooks/place-order/useOrderFood";
import { useOrderGrocery } from "@/hooks/place-order/useOrderGrocery";
import { useOrderMedicine } from "@/hooks/place-order/useOrderMedicine";
import {
  FOOD_ITEMS_IMAGES,
  GROCERY_ITEMS_IMAGES,
  MEDICINE_ITEMS_IMAGES,
} from "@/api-endpoints/api-endpoint";

// Per-module differences for the shared cart UI.
export const CART_MODULES = {
  food: {
    itemsKey: "foodItems",
    totalKey: "totalAmountFood",
    visitedStoreKey: "visitedFoodStore",
    imageBaseUrl: FOOD_ITEMS_IMAGES,
    titleField: "product_title_eng",
    useItems: useFoodItems,
    useOrder: () => {
      const { getGrandTotalFood, ...rest } = useOrderFood();
      return { ...rest, getGrandTotal: getGrandTotalFood };
    },
  },
  grocery: {
    itemsKey: "groceryItems",
    totalKey: "totalAmountGrocery",
    visitedStoreKey: "visitedGroceryStore",
    imageBaseUrl: GROCERY_ITEMS_IMAGES,
    titleField: "product_title_eng",
    useItems: useGroceryItems,
    useOrder: () => {
      const { getGrandTotalGrocery, ...rest } = useOrderGrocery();
      return { ...rest, getGrandTotal: getGrandTotalGrocery };
    },
  },
  medicine: {
    itemsKey: "medicineItems",
    totalKey: "totalAmountMedicine",
    visitedStoreKey: "visitedMedicineStore",
    imageBaseUrl: MEDICINE_ITEMS_IMAGES,
    titleField: "item_title_eng",
    useItems: useMedicineItems,
    useOrder: () => {
      const { getGrandTotalMedicine, ...rest } = useOrderMedicine();
      return { ...rest, getGrandTotal: getGrandTotalMedicine };
    },
  },
};
