import { useSessionStore } from "@/stores/sessionStore";
import { usePreferencesStore } from "@/stores/preferencesStore";
import { getApiClient } from "@/lib/apiClient";
import { useState } from "react";
import notify from "@/utils/notify";
import {
  FAVORITE_STORE_ADD,
  FAVORITE_STORE_PUSH,
  FAVORITE_STORE_REMOVE,
} from "@/api-endpoints/api-endpoint";
import { USER_URL } from "@/api-endpoints/env";
import { useDispatch, useSelector } from "react-redux";
import { handleDashboardReducer } from "@/redux/dashboardReducer";
import { handleItemsByStoreReducer } from "@/redux/items-by-shop";
import { handleUserChoiceReducer } from "@/redux/userChoiceReducer";

const Axios = getApiClient(USER_URL);

export const useFavouriteStore = () => {
  const [visible, setVisible] = useState(false);

  const dispatch = useDispatch();
  const loggedinUserInfo = useSessionStore((s) => s.userInfo);

  const {
    currentFoodShop,
    defaultGroceryStore,
    defaultMedicineStore,
    currentGroceryStore,
    currentMedicineStore,
    favouriteFoodShop,
    favouriteGroceryStore,
    favouriteMedicineStore,
  } = useSelector((state) => state.userChoice);

  const isAddedToFavouriteList = (_id, merchantType) => {
    let existingIndex;

    if (merchantType === 0) {
      existingIndex = favouriteGroceryStore.findIndex(
        (shop) => shop?.storeId === _id
      );
    } else if (merchantType === 1) {
      existingIndex = favouriteMedicineStore.findIndex(
        (shop) => shop?.storeId === _id
      );
    } else {
      existingIndex = favouriteFoodShop.findIndex(
        (shop) => shop?.storeId === _id
      );
    }

    if (existingIndex > -1) {
      return true;
    } else {
      return false;
    }
  };

  const addToFavouriteList = (data, merchantType) => {
    let favouriteList = 0;
    let isAllowed = true;
    if (
      data?._id !== "" &&
      data?.custom_store_id !== "" &&
      loggedinUserInfo?._id
    ) {
      setVisible(true);
      const favouriteInfo = {
        merchantType: merchantType,
        customerInfo: loggedinUserInfo?._id,
        custom_customer_id: loggedinUserInfo?.custom_id,
        storeId: data?._id,
        custom_store_id: data?.custom_store_id,
        shop_name: data?.shop_name,
        shop_address: data?.shop_address,
        shop_banner_app: data?.shop_banner_app,
        contact_no: data?.contact_no,
        alternative_contact_no: data?.alternative_contact_no,
      };

      if (merchantType === 0) {
        favouriteList = favouriteGroceryStore.length;
        if (favouriteList > 9) {
          isAllowed = false;

          notify.warning("You can save up to 10 stores in favourites.");
        }
      } else if (merchantType === 1) {
        favouriteList = favouriteMedicineStore.length;
        if (favouriteList > 9) {
          isAllowed = false;
          notify.warning("You can save up to 10 stores in favourites.");
        }
      } else {
        favouriteList = favouriteFoodShop.length;
        if (favouriteList > 29) {
          isAllowed = false;
          notify.warning("You can save up to 30 stores in favourites.");
        }
      }

      if (favouriteList < 1) {
        manageFavouriteStoreList(FAVORITE_STORE_ADD, favouriteInfo, "add");
      } else {
        if (isAllowed) {
          manageFavouriteStoreList(FAVORITE_STORE_PUSH, favouriteInfo, "push");
        } else {
          setVisible(false);
        }
      }
    }
  };

  const removeFromfavoriteList = (data, merchantType) => {
    setVisible(true);

    const favouriteInfo = {
      merchantType: merchantType,
      customerInfo: loggedinUserInfo?._id,
      custom_customer_id: loggedinUserInfo?.custom_id,
      storeId: data?.storeId,
      custom_store_id: data?.custom_store_id,
      shop_name: data?.shop_name,
      shop_address: data?.shop_address,
      shop_banner_app: data?.shop_banner_app,
      contact_no: data?.contact_no,
      alternative_contact_no: data?.alternative_contact_no,
    };

    manageFavouriteStoreList(FAVORITE_STORE_REMOVE, favouriteInfo, "remove");
  };

  const manageFavouriteStoreList = (route, favouriteInfo, action) => {
    Axios.post(route, favouriteInfo)
      .then((res) => {
        manageReducer(favouriteInfo, action, res?.data?.result);
      })
      .catch((error) => {
        setVisible(false);
      });
  };

  const manageReducer = (favouriteInfo, action, response) => {
    if (action === "remove") {
      removeFromReducer({
        merchantType: favouriteInfo?.merchantType,
        storeId: favouriteInfo?.storeId,
      });
    } else {
      addToReducer({
        merchantType: favouriteInfo?.merchantType,
        storeInfo: response,
      });
    }
    setVisible(false);
  };

  const addToReducer = (Info) => {
    dispatch(
      handleUserChoiceReducer({
        type: "ADD_TO_FAVOURITE_MERCHANT_LIST",
        data: Info,
      })
    );
    notify.success("Added to favourites");
  };

  const removeFromReducer = (Info) => {
    dispatch(
      handleUserChoiceReducer({
        type: "REMOVE_FROM_FAVOURITE_MERCHANT_LIST",
        data: Info,
      })
    );

    notify.success("Removed from favourites");
  };

  const resetReducer = (module) => {
    dispatch(
      handleItemsByStoreReducer({
        type: "CLEAR_ALL",
        data: true,
      })
    );

    usePreferencesStore.getState().setCurrentModule(module);
  };

  const setCurrentModule = () => {
    usePreferencesStore.getState().setCurrentModule("dashboard");
  };

  return {
    visible,
    resetReducer,
    setCurrentModule,
    addToFavouriteList,
    isAddedToFavouriteList,
    removeFromfavoriteList,
  };
};
