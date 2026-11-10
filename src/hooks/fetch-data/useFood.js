import { getApiClient } from "@/lib/apiClient";
import {
  SEARCH_FOOD_STORE,
  NEAREST_FOOD_STORE,
  EXPLORE_FOOD_STORE,
  EXPLORE_FOOD_MODULE,
} from "@/api-endpoints/api-endpoint";
import { useState } from "react";
import { FOOD_URL } from "@/api-endpoints/secret";
import { useDispatch, useSelector } from "react-redux";
import { handleItemsByStoreReducer } from "@/redux/items-by-shop";
import { handleDashboardReducer } from "@/redux/dashboardReducer";

export const useFood = () => {
  const [progressing, setProgressing] = useState(false);

  const dispatch = useDispatch();

  const { userLatitude, userLongitude, districtId } = useSelector(
    (state) => state.user
  );

  const Axios = getApiClient(FOOD_URL);

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
        data: "Food",
      })
    );
  };

  const exploreFoodModule = () => {
    resetReducer();
    setProgressing(true);

    Axios.get(EXPLORE_FOOD_MODULE, {
      params: {
        district_id: districtId,
      },
    })
      .then((res) => {
        dispatch(
          handleDashboardReducer({
            type: "EXPLORE_FOOD_MODULE",
            data: res?.data?.result,
          })
        );
        setProgressing(false);
      })
      .catch((error) => {
        setProgressing(false);
      });
  };

  const getNearestFoodStoreInfo = (setNearestInfo, data) => {
    setProgressing(true);

    const props = {
      shop_longitude: userLongitude,
      shop_latitude: userLatitude,
      max_distance: data?.regularDistance,
      StoreCategory: data?._id,
      district_id: districtId,
    };

    Axios.post(NEAREST_FOOD_STORE, props)
      .then((response) => {
        setNearestInfo(response?.data?.result);
        setProgressing(false);
      })
      .catch((error) => {
        setProgressing(false);
      });
  };

  const handleSearchStore = (searchText, setNearestInfo, data) => {
    if (searchText.length > 1) {
      setProgressing(true);
      Axios.get(SEARCH_FOOD_STORE, {
        params: {
          search: searchText,
          StoreCategory: data._id,
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

  const exploreStore = (data) => {
    resetFoodStore();

    setProgressing(true);
    Axios.get(EXPLORE_FOOD_STORE, {
      params: {
        storeId: data?._id,
        custom_store_id: data?.custom_store_id,
      },
    })
      .then((res) => {

        if (
          res?.data?.result?.shopDetails[0]?.is_closed ||
          !res?.data?.result?.shopDetails[0]?.is_active ||
          res?.data?.result?.shopDetails[0]?.is_banned
        ) {
          alert("Sorry we're closed !!", "See you tomorrow !!");
        } else {

          dispatch(
            handleItemsByStoreReducer({
              type: "EXPLORE_FOOD_STORE_ITEMS",
              data: res?.data?.result,
            })
          );

          dispatch(
            handleDashboardReducer({
              type: "VISITED_FOOD_STORE",
              data: res?.data?.result?.shopDetails[0] || {},
            })
          );
        }

        //   "res?.data?.result?.shopDetails : ",
        //   res?.data?.result?.shopDetails
        // );

        setProgressing(false);
      })
      .catch((error) => {
        setProgressing(false);
      });
  };

  const resetFoodStore = () => {
    dispatch(
      handleItemsByStoreReducer({
        type: "FOOD_STORE_RESET",
        data: [],
      })
    );
  };

  return {
    progressing,
    exploreStore,
    setProgressing,
    exploreFoodModule,
    handleSearchStore,
    getNearestFoodStoreInfo,
  };
};
