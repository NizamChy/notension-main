import { IMAGE_URL } from "./secret";

export const GET_DASHBOARD_INFO = "/public-api/v1/admin/all-appdashboard-data";
export const GET_DISTRICT_INFO = "/public-api/v1/admin/all-district";
export const GET_DISTRICT_AREA_INFO =
  "/public-api/v1/admin/all-districtarea/:id";
export const GET_DISTRICT_SUB_AREA_INFO =
  "/public-api/v1/admin/all-districtsubarea/:id";
export const USER_REGISTARTION = "/api/v1/customer/register";
export const OTP_FOR_REGISTARTION = "/api/v1/customer/send-otp";
export const GET_BANKING_OUTLET = "/public-api/v1/admin/nearest-banking-outlet";

// FAVORITE
export const FAVORITE_STORE_ADD = "/api/v1/customer/add-favourite-store";
export const FAVORITE_STORE_PUSH = "/api/v1/customer/push-store";
export const FAVORITE_STORE_REMOVE = "/api/v1/customer/remove-store";
export const FAVORITE_STORE_INFO = "/api/v1/customer/get-favourite-store-info";
export const FAVORITE_PRODUCT_ADD = "/api/v1/customer/add-favourite-item";
export const FAVORITE_PRODUCT_PUSH = "/api/v1/customer/push-item";
export const FAVORITE_PRODUCT_REMOVE = "/api/v1/customer/remove-item";
export const FAVORITE_PRODUCT_INFO = "/api/v1/customer/get-favourite-item-info";

export const ADD_TO_FAVOURITE = "/api/v1/customer/add-to-favourite-list";
export const PUSH_TO_FAVOURITE = "/api/v1/customer/push-to-favourite-list";
export const REMOVE_FROM_FAVOURITE =
  "/api/v1/customer/remove-from-favourite-list";
export const FAVORITE_INFO = "/api/v1/customer/get-favourite-list";

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

// DOCTOR
export const EXPLORE_FIND_DOCTOR =
  "/client-app-api/v1/health-care/explore-find-doctors";
export const FIND_NEAREST_DOCTOR =
  "/client-app-api/v1/health-care/get-nearest-doctors";
export const FIND_DOCTOR_BY_DEPT =
  "/client-app-api/v1/health-care/get-doctors-by-dept";
export const NEAREST_CONSULTATION_CENTER =
  "/client-app-api/v1/health-care/get-nearest-consultation-certer";
export const SEARCH_CONSULTATION_CENTER =
  "/client-app-api/v1/health-care/search-consultation-certer";
export const CONSULTATION_CENTER_BY_DISTRICT =
  "/client-app-api/v1/health-care/get-consultation-certer";
export const EXPLORE_CONSULTATION_CENTER =
  "/client-app-api/v1/health-care/explore-consultation-certer";
export const FIND_DOCTOR_BY_CONSULTATION_CENTER =
  "/client-app-api/v1/health-care/get-doctors-by-center";
export const GET_DOCTOR_PROFILE =
  "/client-app-api/v1/health-care/get-doctor-profile";

export const HEALTH_CARE_IMAGES = `${IMAGE_URL}/medical-service-provider-images`;

export const EXPLORE_MEDICAL_SERVICE_PROVIDER =
  "/client-app-api/v1/health-care/explore-medical-service-provider";
export const FIND_MEDICAL_SERVICE_PROVIDER =
  "/client-app-api/v1/health-care/get-medical-service-provider";
export const FIND_AMBULANCE_SERVICE_PROVIDER =
  "/client-app-api/v1/health-care/get-ambulance-service-provider";

export const GET_PATIENTS = "/client-app-api/v1/health-care/get-patients-info";
export const REGISTER_PATIENT =
  "/client-app-api/v1/health-care/register-patient";
export const MANAGE_PATIENT = "/client-app-api/v1/health-care/manage-patient";
export const BOOK_APPOINTMENT =
  "/client-app-api/v1/health-care/book-appointment";
