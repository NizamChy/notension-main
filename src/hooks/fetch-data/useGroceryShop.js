import { getApiClient } from "@/lib/apiClient";
import {
  SEARCH_GROCERY_STORE,
  EXPLORE_GROCERY_STORE,
  NEAREST_GROCERY_STORE,
} from "@/api-endpoints/api-endpoint";
import { useState } from "react";
import { GROCERY_URL } from "@/api-endpoints/secret";
import { useDispatch, useSelector } from "react-redux";
import { handleDashboardReducer } from "@/redux/dashboardReducer";
import { handleItemsByStoreReducer } from "@/redux/items-by-shop";

export const useGroceryShop = () => {
  const [progressing, setProgressing] = useState(false);

  const dispatch = useDispatch();

  const { userLatitude, userLongitude, districtId } = useSelector(
    (state) => state.user
  );

  const Axios = getApiClient(GROCERY_URL);

  const resetReducer = () => {
    dispatch(
      handleItemsByStoreReducer({
        type: "CLEAR_ALL",
        data: true,
      })
    );

    dispatch(
      handleDashboardReducer({
        type: "SET_CURRENT_MODULE",
        data: "Grocery",
      })
    );
  };

  // 1000000

  const getNearestGroceryStoreInfo = (setNearestInfo, distance = 1000) => {
    resetReducer();
    setProgressing(true);
    const props = {
      shop_longitude: userLongitude,
      shop_latitude: userLatitude,
      max_distance: 1000,
      districtId: districtId,
    };

    //saveLoadingStatus(true);
    Axios.post(NEAREST_GROCERY_STORE, props)
      .then((response) => {
        setNearestInfo(response?.data?.result);
        setProgressing(false);
      })
      .catch((error) => {
        setProgressing(false);
      });
  };

  const handleSearchStore = (searchText, setNearestInfo) => {
    if (searchText?.length > 1) {
      setProgressing(true);
      Axios.get(SEARCH_GROCERY_STORE, {
        params: {
          search: searchText,
        },
      })
        .then((res) => {
          setNearestInfo(res.data.result);
          setProgressing(false);
        })
        .catch((error) => {
          setProgressing(false);
        });

    }
  };

  // storeId: "6527d0a1b7199de299cd2284",
  // custom_store_id: "GS111112",

  const exploreStore = (data) => {
    // resetFoodStore();
    resetReducer();

    setProgressing(true);
    Axios.get(EXPLORE_GROCERY_STORE, {
      params: {
        storeId: data?._id,
        custom_store_id: data?.custom_store_id,
      },
    })
      .then((res) => {
        if (
          res?.data?.result?.ShopDetails[0]?.is_closed ||
          !res?.data?.result?.ShopDetails[0]?.is_active ||
          res?.data?.result?.ShopDetails[0]?.is_banned
        ) {
          alert("Sorry we're closed !!", "See you tomorrow !!");
        } else {
          dispatch(
            handleDashboardReducer({
              type: "EXPLORE_STORE",
              data: res?.data?.result,
            })
          );

          dispatch(
            handleItemsByStoreReducer({
              type: "EXPLORE_STORE_ITEMS",
              data: res?.data?.result,
            })
          );

        }

        //   "res?.data?.result?.shopDetails : ",
        //   res?.data?.result?.ShopDetails[0]
        // );

        setProgressing(false);
      })
      .catch((error) => {
        setProgressing(false);
      });
  };

  return {
    progressing,
    resetReducer,
    exploreStore,
    setProgressing,
    handleSearchStore,
    getNearestGroceryStoreInfo,
  };
};
