import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  callUs: "",
  ditance: [],
  typeInfo: [],
  isLoading: true,
  districtInfo: [],
  shopCategory: [],
  typeInfoByShop: [],
  tutorial_banner: "",
  DashboardSlider: [],
  starting_slider: [],
  visitedFoodStore: {},
  favourite_banner: [],
  districtAreaInfo: [],
  subtypeInfoByShop: [],
  isFoodCartCheck: false,
  showProductPrice: true,
  registration_banner: "",
  visitedGroceryStore: {},
  districtSubAreaInfo: [],
  visitedMedicineStore: {},
  free_services_slider: [],
  free_services_banner: [],
  advertisement_slider: [],
  business_type_banner: [],
  isGroceryCartCheck: false,
  ad_slider_by_district: {},
  isMedicineCartCheck: false,
  currentModule: "dashboard",
  medical_services_banner: [],
  isFetchingFromStorage: true,
  show_tutorial_banner: false,
  visitedDineInRestaurent: {},
  internetConnectionAvailable: true,
};

const dashboardSlice = createSlice({
  name: "dashboard",
  initialState,
  reducers: {
    handleDashboardReducer: (state, { payload }) => {
      const { type, data } = payload;

      switch (type) {
        case "SAVE_DASHBOARD_INFO":
          state.isLoading = false;
          state.favourite_banner =
            data?.allAppDashboard[0]?.favourite_banner || [];
          state.starting_slider =
            data?.allAppDashboard[0]?.starting_slider || [];
          state.business_type_banner =
            data?.allAppDashboard[0]?.business_type_banner || [];
          state.advertisement_slider =
            data?.allAppDashboard[0]?.advertisement_slider || [];
          state.medical_services_banner =
            data?.allAppDashboard[0]?.medical_services_banner || [];
          state.free_services_slider =
            data?.allAppDashboard[0]?.free_services_slider || [];
          state.free_services_banner =
            data?.allAppDashboard[0]?.free_services_banner || [];
          state.tutorial_banner =
            data?.allAppDashboard[0]?.tutorial_banner || "";
          state.show_tutorial_banner =
            data?.allAppDashboard[0]?.show_tutorial_banner || false;
          state.registration_banner =
            data?.allAppDashboard[0]?.registration_banner || "";
          state.ad_slider_by_district = data?.DashboardSlider || {};
          break;

        case "SAVE_LOADING_STATUS":
          state.isLoading = data;
          break;

        case "SAVE_GROCERY_CART_CHECK_STATUS":
          state.isGroceryCartCheck = data;
          break;

        case "SAVE_MEDICINE_CART_CHECK_STATUS":
          state.isMedicineCartCheck = data;
          break;

        case "SAVE_FOOD_CART_CHECK_STATUS":
          state.isFoodCartCheck = data;
          break;

        case "SAVE_CONNECTION_STATUS":
          state.internetConnectionAvailable = data;
          break;

        case "SAVE_AREA_INFO":
          state.districtInfo = data.districtInfo;
          state.districtAreaInfo = data.districtInfo;
          state.districtSubAreaInfo = data.districtInfo;
          break;

        case "EXPLORE_STORE": {
          const showProductPrice =
            data?.ShopDetails[0]?.show_product_price !== undefined
              ? data?.ShopDetails[0]?.show_product_price
              : true;

          const typeInfoGeneral =
            data?.ProductTypeByShop?.map((info) => ({
              id: info?.typeInfo,
              custom_type_id: info?.custom_type_id,
              name: info?.typeName,
              image: "medical_equipment.png",
              parent: null,
              subtype:
                info.statusType === "General"
                  ? data?.ProductSubTypeByShop?.filter(
                      (subtype) => subtype?.typeInfo === info?.typeInfo
                    )
                  : [],
            })) || [];

          state.isLoading = false;
          state.visitedGroceryStore = data?.ShopDetails[0] || {};
          state.typeInfoByShop = data?.ProductTypeByShop || [];
          state.subtypeInfoByShop = data?.ProductSubTypeByShop || [];
          state.DashboardSlider = data?.DashboardSlider || [];
          state.showProductPrice = showProductPrice;
          state.typeInfo = typeInfoGeneral;
          break;
        }

        case "VISITED_STORE":
          state.visitedGroceryStore = data;
          break;

        case "EXPLORE_MED_STORE": {
          const showProductPrice =
            data?.ShopDetails[0]?.show_product_price !== undefined
              ? data?.ShopDetails[0]?.show_product_price
              : true;

          const typeInfoGeneral =
            data?.ProductTypeByShop?.map((info) => ({
              id: info?.typeInfo,
              custom_type_id: info.custom_type_id,
              name: info?.typeName,
              image: "medical_equipment.png",
              parent: null,
              subtype:
                info.statusType === "General"
                  ? data?.ProductSubTypeByShop?.filter(
                      (subtype) => subtype.typeInfo === info?.typeInfo
                    )
                  : [],
            })) || [];

          state.isLoading = false;
          state.visitedMedicineStore = data?.ShopDetails[0] || {};
          state.typeInfoByShop = data?.ProductTypeByShop || [];
          state.subtypeInfoByShop = data?.ProductSubTypeByShop || [];
          state.DashboardSlider = data?.DashboardSlider || [];
          state.showProductPrice = showProductPrice;
          state.typeInfo = typeInfoGeneral;
          break;
        }

        case "VISITED_MED_STORE":
          state.visitedMedicineStore = data;
          break;

        case "EXPLORE_FOOD_MODULE":
          state.isLoading = false;
          state.shopCategory = data?.shopCategory || [];
          state.DashboardSlider = data?.DashboardSlider || [];
          break;

        case "EXPLORE_FOOD_STORE":
          state.isLoading = false;
          state.visitedMedicineStore = data?.ShopDetails[0] || {};
          state.typeInfoByShop = data?.ProductTypeByShop || [];
          state.subtypeInfoByShop = data?.ProductSubTypeByShop || [];
          state.DashboardSlider = data?.DashboardSlider || [];
          break;

        case "VISITED_FOOD_STORE":
          state.visitedFoodStore = data;
          state.currentModule = "Food";
          break;

        case "SET_CURRENT_MODULE":
          state.currentModule = data;
          break;

        case "RESET_DASHBOARD_REDUCER":
          return {
            ...initialState,
          };

        default:
          break;
      }
    },
  },
});

export const { handleDashboardReducer } = dashboardSlice.actions;

export default dashboardSlice.reducer;
