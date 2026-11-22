import { useSessionStore } from "@/stores/sessionStore";
import { getApiClient } from "@/lib/apiClient";
import { useState } from "react";
import notify from "@/utils/notify";
import {
  GROCERY_ITEM_DETAILS,
  FAVORITE_PRODUCT_ADD,
  MEDICINE_ITEM_DETAILS,
  FAVORITE_PRODUCT_PUSH,
  FAVORITE_PRODUCT_REMOVE,
} from "@/api-endpoints/api-endpoint";
import { useDispatch, useSelector } from "react-redux";
import { handleUserChoiceReducer } from "@/redux/userChoiceReducer";
import { GROCERY_URL, MEDICINE_URL, USER_URL } from "@/api-endpoints/env";

const Axios = getApiClient(USER_URL);

// storeRef: a store the caller already knows (the grocery hooks pass the visited store).
// Without it (Medicine) the store comes from state.itemsByStore, as before.
export const useFavouriteItem = (storeRef) => {
  const [message, setMessage] = useState("");
  const [visible, setVisible] = useState(false);
  const [itemDetails, setItemDetails] = useState(null);
  const [showErrorMessage, setShowErrorMessage] = useState(false);

  const dispatch = useDispatch();

  const byStore = useSelector((state) => state.itemsByStore);
  const source = storeRef ?? byStore;
  const merchantId = source.merchantId;
  const customstore_id = source.customstore_id;

  const loggedinUserInfo = useSessionStore((s) => s.userInfo);

  const { favouriteGroceryItems, favouriteMedicineItems } = useSelector(
    (state) => state.userChoice
  );

  const isAddedToFavouriteItems = (productId, merchantType) => {
    let existingIndex;

    if (merchantType === 0) {
      existingIndex = favouriteGroceryItems.findIndex(
        (shop) => shop?.productId === productId
      );
    } else {
      existingIndex = favouriteMedicineItems.findIndex(
        (shop) => shop?.productId === productId
      );
    }

    if (existingIndex > -1) {
      return true;
    } else {
      return false;
    }
  };

  const addToFavouriteItems = (data, merchantType) => {
    let favouriteItems = 0;
    let favouriteInfo;
    if (data?._id !== "" && loggedinUserInfo?._id) {
      setVisible(true);
      if (merchantType === 0) {
        favouriteItems = favouriteGroceryItems.length;
        favouriteInfo = {
          merchantType: merchantType,
          customerInfo: loggedinUserInfo?._id,
          custom_customer_id: loggedinUserInfo?.custom_id,
          productId: data?.productInfoTable,
          product_title_eng: data?.product_title_eng,
          product_title_beng: data?.product_title_beng,
          pack_size: data?.pack_size,
          app_image: data?.app_image,
        };
      } else {
        favouriteInfo = {
          merchantType: merchantType,
          customerInfo: loggedinUserInfo?._id,
          custom_customer_id: loggedinUserInfo?.custom_id,
          productId: data?.medStoreProductInfo,
          item_title_eng: data?.item_title_eng,
          strength: data?.strength,
          pack_size: data?.pack_size,
          app_image: data?.app_image,
        };
        favouriteItems = favouriteMedicineItems.length;
      }

      if (favouriteItems < 1) {
        manageFavouriteStoreItems(FAVORITE_PRODUCT_ADD, favouriteInfo, "add");
      } else {
        if (favouriteItems > 99) {
          notify.warning("You can save up to 100 items in favourites.");
        } else {
          manageFavouriteStoreItems(
            FAVORITE_PRODUCT_PUSH,
            favouriteInfo,
            "push"
          );
        }
      }
    }
  };

  const removeFromfavoriteItems = (data, merchantType) => {
    setVisible(true);
    let favouriteInfo = {
      merchantType: merchantType,
      customerInfo: loggedinUserInfo?._id,
      custom_customer_id: loggedinUserInfo?.custom_id,
      ...data,
    };

    setTimeout(() => {
      manageFavouriteStoreItems(
        FAVORITE_PRODUCT_REMOVE,
        favouriteInfo,
        "remove"
      );
    }, 500);
  };

  const manageFavouriteStoreItems = (route, favouriteInfo, action) => {
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
        productId: favouriteInfo?.productId,
      });
    } else {
      addToReducer({
        merchantType: favouriteInfo?.merchantType,
        itemInfo: response,
      });
    }

    setVisible(false);
  };

  const addToReducer = (Info) => {
    dispatch(
      handleUserChoiceReducer({
        type: "ADD_TO_FAVOURITE_ITEM_LIST",
        data: Info,
      })
    );
    notify.success("Added to favourites");
  };

  const removeFromReducer = (Info) => {
    dispatch(
      handleUserChoiceReducer({
        type: "REMOVE_FROM_FAVOURITE_ITEM_LIST",
        data: Info,
      })
    );
    notify.success("Removed from favourites");
  };

  const AxiosGrocery = getApiClient(GROCERY_URL);

  const getGroceryProductDetails = (productInfoTable) => {
    setShowErrorMessage(false);
    setVisible(true);
    AxiosGrocery.get(GROCERY_ITEM_DETAILS, {
      params: {
        productInfoTable: productInfoTable,
        groceryStoreId: merchantId,
        custom_store_id: customstore_id,
      },
    })
      .then((res) => {
        setVisible(false);
        if (res?.data?.success) {
          setItemDetails(res?.data?.result);
        } else {
          setMessage("এই মুহুর্তে পণ্যটি দোকানে নেই !!");
          setShowErrorMessage(true);
        }
      })
      .catch((error) => {
        setVisible(false);
      });
  };

  const AxiosMedicine = getApiClient(MEDICINE_URL);

  const getMedicineProductDetails = (medStoreProductInfo) => {

    setShowErrorMessage(false);
    setVisible(true);
    AxiosMedicine.get(MEDICINE_ITEM_DETAILS, {
      params: {
        medStoreProductInfo: medStoreProductInfo,
        merchantId: merchantId,
        custom_store_id: customstore_id,
      },
    })
      .then((res) => {

        setVisible(false);
        if (res?.data?.success) {
          setItemDetails(res?.data?.result);
        } else {
          setMessage("এই মুহুর্তে পণ্যটি দোকানে নেই !!");

          setShowErrorMessage(true);
        }
      })
      .catch((error) => {
        setVisible(false);
      });
  };

  return {
    getMedicineProductDetails,
    getGroceryProductDetails,
    removeFromfavoriteItems,
    isAddedToFavouriteItems,
    addToFavouriteItems,
    setShowErrorMessage,
    showErrorMessage,
    itemDetails,
    message,
    visible,
  };
};
