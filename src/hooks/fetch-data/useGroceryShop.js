import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { GROCERY_URL } from "@/api-endpoints/secret";
import {
  EXPLORE_FOOD_STORE,
  EXPLORE_GROCERY_STORE,
  NEAREST_GROCERY_STORE,
  SEARCH_GROCERY_STORE,
} from "@/api-endpoints/api-endpoint";
import { handleDashboardReducer } from "@/redux/dashboardReducer";
import { handleItemsByStoreReducer } from "@/redux/items-by-shop";

axios.defaults.withCredentials = true;

export const useGroceryShop = () => {
  const dispatch = useDispatch();
  const [error, setError] = useState(false);

  const [progressing, setProgressing] = useState(false);

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

  // 1000000

  const getNearestGroceryStoreInfo = (setNearestInfo, distance = 1000) => {
    // resetReducer();
    setProgressing(true);
    const props = {
      shop_longitude: userLongitude,
      shop_latitude: userLatitude,
      max_distance: 1000,
      districtId: districtId,
    };
    //console.log(props);
    //saveLoadingStatus(true);
    Axios.post(NEAREST_GROCERY_STORE, props)
      .then((response) => {
        console.log(response?.data);
        setNearestInfo(response?.data?.result);
        setProgressing(false);
      })
      .catch((error) => {
        console.log("Error : ", error?.response?.data);
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

    setProgressing(true);
    Axios.get(EXPLORE_GROCERY_STORE, {
      params: {
        storeId: data?._id,
        custom_store_id: data?.custom_store_id,
      },
    })
      .then((res) => {
        // console.log(res);

        // console.log(res?.data?.result);

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

  useEffect(() => {
    if (error) {
      //userLogOut();
    }
  }, [error]);

  return {
    progressing,
    setProgressing,
    exploreStore,
    getNearestGroceryStoreInfo,
    handleSearchStore,
  };
};
