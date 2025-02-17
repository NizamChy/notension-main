import axios from "axios";
import {
  EXPLORE_FOOD_MODULE,
  EXPLORE_FOOD_STORE,
  NEAREST_FOOD_STORE,
  SEARCH_FOOD_STORE,
} from "@/api-endpoints/api-endpoint";
import { useEffect, useState } from "react";
import { FOOD_URL } from "@/api-endpoints/secret";
import { useDispatch, useSelector } from "react-redux";
import { handleDashboardReducer } from "@/redux/dashboardReducer";
import { handleItemsByStoreReducer } from "@/redux/items-by-shop";

axios.defaults.withCredentials = true;

export const useFood = () => {
  const [error, setError] = useState(false);
  const [progressing, setProgressing] = useState(false);

  const dispatch = useDispatch();

  const { userLatitude, userLongitude, districtId } = useSelector(
    (state) => state.user
  );

  const Axios = axios.create({
    baseURL: FOOD_URL,
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
        console.log("res.data.result : ", res.data.result);
        dispatch(
          handleDashboardReducer({
            type: "EXPLORE_FOOD_MODULE",
            data: res?.data?.result,
          })
        );
        setProgressing(false);
      })
      .catch((error) => {
        //console.log('Error : ', error.response)
        setProgressing(false);
      });
    setTimeout(() => {
      if (progressing) {
        setProgressing(false);
      }
    }, 10000);
  };

  const getNearestFoodStoreInfo = (setNearestInfo, data) => {
    setProgressing(true);
    console.log("data::", data);

    const props = {
      shop_longitude: userLongitude,
      shop_latitude: userLatitude,
      max_distance: data?.regularDistance,
      StoreCategory: data?._id,
      district_id: districtId,
    };
    //console.log(props);

    Axios.post(NEAREST_FOOD_STORE, props)
      .then((response) => {
        //console.log("Nearest : ",response.data.result);
        setNearestInfo(response?.data?.result);
        setProgressing(false);
      })
      .catch((error) => {
        //console.log('Error : ', error.response)
        setProgressing(false);
      });
    setTimeout(() => {
      if (progressing) {
        setProgressing(false);
      }
    }, 10000);
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
          //console.log()
          setProgressing(false);
        });

      setTimeout(() => {
        if (progressing) {
          setProgressing(false);
        }
      }, 10000);
    }
  };

  // storeId: "659be6cf89593390adb41141",
  // custom_store_id: "FS111111",

  const exploreStore = (data) => {
    // resetFoodStore();

    setProgressing(true);
    Axios.get(EXPLORE_FOOD_STORE, {
      params: {
        storeId: data?._id,
        custom_store_id: data?.custom_store_id,
      },
    })
      .then((res) => {
        console.log("res?.data?.result", res?.data?.result);

        if (
          res?.data?.result?.shopDetails[0]?.is_closed ||
          !res?.data?.result?.shopDetails[0]?.is_active ||
          res?.data?.result?.shopDetails[0]?.is_banned
        ) {
          alert("Sorry we're closed !!", "See you tomorrow !!");
        } else {
          // dispatch(
          //   handleDashboardReducer({
          //     type: "EXPLORE_STORE",
          //     data: res?.data?.result[0],
          //   })
          // );

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

        console.log(
          "res?.data?.result?.shopDetails : ",
          res?.data?.result?.shopDetails
        );

        setProgressing(false);
      })
      .catch((error) => {
        setProgressing(false);
        console.log(error);
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

  // useEffect(() => {
  //   if (error) {
  //     //userLogOut();
  //   }
  // }, [error]);

  return {
    progressing,
    setProgressing,
    exploreStore,
    getNearestFoodStoreInfo,
    exploreFoodModule,
    handleSearchStore,
  };
};
