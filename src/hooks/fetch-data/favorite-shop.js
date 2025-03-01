import axios from "axios";
import { useState } from "react";
import {
  FAVORITE_STORE_ADD,
  FAVORITE_STORE_PUSH,
  FAVORITE_STORE_REMOVE,
} from "@/api-endpoints/api-endpoint";
import { toast } from "react-toastify";
import { USER_URL } from "@/api-endpoints/secret";
import { useDispatch, useSelector } from "react-redux";
import { handleDashboardReducer } from "@/redux/dashboardReducer";
import { handleItemsByStoreReducer } from "@/redux/items-by-shop";
import { handleUserChoiceReducer } from "@/redux/userChoiceReducer";

axios.defaults.withCredentials = true;

const Axios = axios.create({
  baseURL: USER_URL,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

export const useFavouriteStore = () => {
  const [error, setError] = useState(false);
  const [visible, setVisible] = useState(false);

  const dispatch = useDispatch();
  const loggedinUserInfo = useSelector((state) => state.user.userInfo);

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

          alert(
            "Hold on! You can add up to ten (10) Store to your Favorites list!"
          );
        }
      } else if (merchantType === 1) {
        favouriteList = favouriteMedicineStore.length;
        if (favouriteList > 9) {
          isAllowed = false;
          alert(
            "Hold on! You can add up to ten (10) Store to your Favorites list!"
          );
        }
      } else {
        favouriteList = favouriteFoodShop.length;
        if (favouriteList > 29) {
          isAllowed = false;
          alert(
            "Hold on! You can add up to thirty (30) Store to your Favorites list!"
          );
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
        // console.log("Error.........+", error);
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
    toast.success("Added to your Favorites list!");
  };

  const removeFromReducer = (Info) => {
    dispatch(
      handleUserChoiceReducer({
        type: "REMOVE_FROM_FAVOURITE_MERCHANT_LIST",
        data: Info,
      })
    );
    toast.success("Removed from your Favorites list!");
  };

  const resetReducer = (module) => {
    dispatch(
      handleItemsByStoreReducer({
        type: "CLEAR_ALL",
        data: true,
      })
    );

    dispatch(
      handleDashboardReducer({
        type: "SET_CURRENT_MODULE",
        data: module,
      })
    );
  };

  const setCurrentModule = () => {
    dispatch(
      handleDashboardReducer({
        type: "SET_CURRENT_MODULE",
        data: "dashboard",
      })
    );
  };

  // useEffect(() => {
  //   if (error) {
  //     //userLogOut();
  //   }
  // }, [error]);

  return {
    visible,
    resetReducer,
    setCurrentModule,
    addToFavouriteList,
    isAddedToFavouriteList,
    removeFromfavoriteList,
  };
};
