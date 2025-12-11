import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  kownNurse: [],
  currentFoodShop: {},
  favouriteDoctors: [],
  favouriteFoodShop: [],
  favouriteFoodItems: [],
  currentGroceryStore: {},
  defaultGroceryStore: {},
  defaultMedicineStore: {},
  currentMedicineStore: {},
  favouriteGroceryStore: [],
  favouriteGroceryItems: [],
  kownAmbulanceProvider: [],
  favouriteMedicineStore: [],
  favouriteMedicineItems: [],
  favouriteConsultationCentre: [],
  currentItemDetails: {},
  favouriteFashionItems: [],
};

const userChoiceSlice = createSlice({
  name: "userChoice",
  initialState,
  reducers: {
    handleUserChoiceReducer: (state, { payload }) => {
      const { type, data } = payload;

      switch (type) {
        case "SAVE_DEFAULT_STORE":
          state.defaultGroceryStore = data;
          break;

        case "SAVE_CURRENT_MERCHANT":
          state.defaultMedicineStore = data;
          break;

        case "ADD_TO_FAVOURITE_MERCHANT_LIST": {
          const { merchantType, storeInfo, favouriteList } = data;

          switch (merchantType) {
            case 0:
              state.favouriteGroceryStore = [
                ...state.favouriteGroceryStore,
                ...storeInfo,
              ];
              break;
            case 1:
              state.favouriteMedicineStore = [
                ...state.favouriteMedicineStore,
                ...storeInfo,
              ];
              break;
            case 2:
              state.favouriteFoodShop = [
                ...state.favouriteFoodShop,
                ...storeInfo,
              ];
              break;
            case 3:
              state.favouriteConsultationCentre = [
                ...state.favouriteConsultationCentre,
                ...favouriteList,
              ];
              break;
            case 4:
              state.favouriteDoctors = [
                ...state.favouriteDoctors,
                ...favouriteList,
              ];
              break;
            default:
              break;
          }
          break;
        }

        case "REMOVE_FROM_FAVOURITE_MERCHANT_LIST": {
          const { merchantType, storeId, mongodbId } = data;

          switch (merchantType) {
            case 0:
              state.favouriteGroceryStore = state.favouriteGroceryStore.filter(
                (info) => info?.storeId !== storeId
              );
              break;
            case 1:
              state.favouriteMedicineStore =
                state.favouriteMedicineStore.filter(
                  (info) => info?.storeId !== storeId
                );
              break;
            case 2:
              state.favouriteFoodShop = state.favouriteFoodShop.filter(
                (info) => info?.storeId !== storeId
              );
              break;
            case 3:
              state.favouriteConsultationCentre =
                state.favouriteConsultationCentre.filter(
                  (info) => info?.mongodbId !== mongodbId
                );
              break;
            case 4:
              state.favouriteDoctors = state.favouriteDoctors.filter(
                (info) => info?.mongodbId !== mongodbId
              );
              break;
            default:
              break;
          }
          break;
        }

        case "ADD_TO_FAVOURITE_ITEM_LIST": {
          const { merchantType, itemInfo } = data;

          if (merchantType === 0) {
            state.favouriteGroceryItems = [
              ...state.favouriteGroceryItems,
              ...itemInfo,
            ];
          } else if (merchantType === 1) {
            state.favouriteMedicineItems = [
              ...state.favouriteMedicineItems,
              ...itemInfo,
            ];
          }
          break;
        }

        case "REMOVE_FROM_FAVOURITE_ITEM_LIST": {
          const { merchantType, productId } = data;

          if (merchantType === 0) {
            state.favouriteGroceryItems = state.favouriteGroceryItems.filter(
              (info) => info?.productId !== productId
            );
          } else {
            state.favouriteMedicineItems = state.favouriteMedicineItems.filter(
              (info) => info?.productId !== productId
            );
          }
          break;
        }

        case "ADD_TO_FAVOURITE_FASHION_ITEMS": {
          const { itemInfo } = data;

          state.favouriteFashionItems = [
            ...(state.favouriteFashionItems || []),
            ...itemInfo,
          ];
          break;
        }

        case "REMOVE_FROM_FAVOURITE_FASHION_ITEMS": {
          const { productId } = data;

          state.favouriteFashionItems = (
            state.favouriteFashionItems || []
          ).filter((info) => info?._id !== productId);
          break;
        }

        case "RESET_USER_CHOICE":
          return {
            ...initialState,
          };

        case "SAVE_CURRENT_ITEM_DETAILS":
          state.currentItemDetails = data;
          break;

        default:
          break;
      }
    },
  },
});

export const { handleUserChoiceReducer } = userChoiceSlice.actions;

export default userChoiceSlice.reducer;
