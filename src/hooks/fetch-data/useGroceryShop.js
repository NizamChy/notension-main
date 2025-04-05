import axios from "axios";
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

axios.defaults.withCredentials = true;

export const useGroceryShop = () => {
  const [progressing, setProgressing] = useState(false);

  const dispatch = useDispatch();

  const { userLatitude, userLongitude, districtId } = useSelector(
    (state) => state.user
  );

  const Axios = axios.create({
    baseURL: GROCERY_URL,
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  });

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
        // console.log(response?.data);
        setNearestInfo(response?.data?.result);
        setProgressing(false);
      })
      .catch((error) => {
        // console.log("Error : ", error?.response?.data);
        setProgressing(false);
      });
    setTimeout(() => {
      if (progressing) {
        setProgressing(false);
      }
    }, 10000);
  };

  const handleSearchStore = (searchText, setNearestInfo) => {
    if (searchText.length > 1) {
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

      setTimeout(() => {
        if (progressing) {
          setProgressing(false);
        }
      }, 10000);
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

          // dispatch(
          //   handleDashboardReducer({
          //     type: "VISITED_FOOD_STORE",
          //     data: res?.data?.result?.shopDetails[0] || {},
          //   })
          // );
        }

        // console.log(
        //   "res?.data?.result?.shopDetails : ",
        //   res?.data?.result?.ShopDetails[0]
        // );

        setProgressing(false);
      })
      .catch((error) => {
        setProgressing(false);
      });
  };

  //   const resetFoodStore = () => {
  //     dispatch(
  //       handleItemsByStoreReducer({
  //         type: "FOOD_STORE_RESET",
  //         data: [],
  //       })
  //     );
  //   };

  return {
    progressing,
    resetReducer,
    exploreStore,
    setProgressing,
    handleSearchStore,
    getNearestGroceryStoreInfo,
  };
};
