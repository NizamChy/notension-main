import {
  FOOD_ITEMS_IMAGES,
  GROCERY_ITEMS_IMAGES,
  MEDICINE_ITEMS_IMAGES,
} from "@/api-endpoints/api-endpoint";
import { useFoodOrders } from "@/hooks/food/useFoodOrders";
import { useGroceryOrders } from "@/hooks/grocery/useGroceryOrders";
import { useMedicineOrders } from "@/hooks/medicine/useMedicineOrders";
import type { OrderView } from "./OrderUI";

export type OrderModuleName = "grocery" | "medicine" | "food";

type OrderModule = {
  useOrders: () => { orders: OrderView[]; isLoading: boolean; isLoggedIn: boolean };
  /** The store pages live under `${basePath}/<slug>/<storeId>/<customStoreId>`. */
  basePath: string;
  imageBase: string;
};

// Per-module parts of the order pages (list, modal, mobile details).
export const ORDER_MODULES: Record<OrderModuleName, OrderModule> = {
  grocery: { useOrders: useGroceryOrders, basePath: "/grocery", imageBase: GROCERY_ITEMS_IMAGES },
  medicine: { useOrders: useMedicineOrders, basePath: "/medicine", imageBase: MEDICINE_ITEMS_IMAGES },
  food: { useOrders: useFoodOrders, basePath: "/food/store", imageBase: FOOD_ITEMS_IMAGES },
};
