import { IMAGE_URL } from "./secret";

export const GET_DASHBOARD_INFO = "/public-api/v1/admin/all-appdashboard-data";
export const GET_DISTRICT_INFO = "/public-api/v1/admin/all-district";
export const GET_DISTRICT_AREA_INFO =
  "/public-api/v1/admin/all-districtarea/:id";
export const GET_DISTRICT_SUB_AREA_INFO =
  "/public-api/v1/admin/all-districtsubarea/:id";
export const GET_BANKING_OUTLET = "/public-api/v1/admin/nearest-banking-outlet";

export const OTP_FOR_REGISTARTION = "/api/v1/customer/send-otp";
export const USER_REGISTARTION = "/api/v1/customer/register";

// FOOD
export const EXPLORE_FOOD_MODULE = "/client-app-api/v1/food/explore-module";
export const EXPLORE_FOOD_STORE = "/client-app-api/v1/food/explore-store";
export const FOOD_PLACE_ORDER = "/client-app-api/v1/food/order";
export const FOOD_ORDER_INFO = "/client-app-api/v1/food/order-info";

export const FOOD_ITEMS_IMAGES = `${IMAGE_URL}/food-items-images`;

export const FOOD_SLIDER_TYPE_SUBTYPE_IMAGES = `${IMAGE_URL}/food-slider-type-subtype-images`;

export const NEAREST_FOOD_STORE = "/client-app-api/v1/food/get-nearest-store";
export const SEARCH_FOOD_STORE = "/client-app-api/v1/food/find-store";

// MEDICINE
export const SEARCH_MEDICINE_STORE = "/client-app-api/v1/medicine/find-store";
export const EXPLORE_MEDICINE_STORE =
  "/client-app-api/v1/medicine/explore-store";
export const SEARCH_MEDICINE_ITEMS = "/client-app-api/v1/medicine/search-items";
export const MEDICINE_ITEMS_BY_SUBTYPE =
  "/client-app-api/v1/medicine/items-by-subtype";
export const MEDICINE_ITEMS_BY_CUSTOMTYPE =
  "/client-app-api/v1/medicine/items-by-customType";
export const MEDICINE_ITEM_DETAILS = "/client-app-api/v1/medicine/item-details";
export const MEDICINE_PLACE_ORDER = "/client-app-api/v1/medicine/order";
export const MEDICINE_ORDER_INFO = "/client-app-api/v1/medicine/order-info";

export const MEDICINE_SLIDER_TYPE_SUBTYPE_IMAGES = `${IMAGE_URL}/medicine-slider-type-subtype-images`;
export const MEDICINE_ITEMS_IMAGES = `${IMAGE_URL}/medicine-items-images`;

export const POST_NEAREST_MEDICINE_STORE =
  "/api/v1/medicine/public/nearest-store";
export const NEAREST_MEDICINE_STORE =
  "/client-app-api/v1/medicine/get-nearest-store";

// GROCERY
export const EXPLORE_GROCERY_STORE = "/client-app-api/v1/grocery/explore-store";
export const SEARCH_GROCERY_ITEMS = "/client-app-api/v1/grocery/search-items";
export const GROCERY_ITEMS_BY_SUBTYPE =
  "/client-app-api/v1/grocery/items-by-subtype";
export const GROCERY_ITEMS_BY_CUSTOMTYPE =
  "/client-app-api/v1/grocery/items-by-customType";
export const GROCERY_ITEM_DETAILS = "/client-app-api/v1/grocery/item-details";
export const GROCERY_PLACE_ORDER = "/client-app-api/v1/grocery/order";
export const GROCERY_ORDER_INFO = "/client-app-api/v1/grocery/order-info";
export const GROCERY_SLIDER_TYPE_SUBTYPE_IMAGES = `${IMAGE_URL}/grocery-slider-type-subtype-images`;
export const GROCERY_ITEMS_IMAGES = `${IMAGE_URL}/grocery-items-images`;

export const NEAREST_GROCERY_STORE =
  "/client-app-api/v1/grocery/get-nearest-store";

export const SEARCH_GROCERY_STORE = "/client-app-api/v1/grocery/find-store";
