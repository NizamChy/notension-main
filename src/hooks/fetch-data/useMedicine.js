import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";

import { MEDICINE_URL } from "@/api-endpoints/secret";
import {
  EXPLORE_MEDICINE_STORE,
  MEDICINE_ITEMS_BY_CUSTOMTYPE,
  MEDICINE_ITEMS_BY_SUBTYPE,
  NEAREST_MEDICINE_STORE,
  SEARCH_MEDICINE_ITEMS,
  SEARCH_MEDICINE_STORE,
} from "@/api-endpoints/api-endpoint";
import { handleItemsByStoreReducer } from "@/redux/items-by-shop";
import { handleDashboardReducer } from "@/redux/dashboardReducer";

axios.defaults.withCredentials = true;

export const useMedicine = () => {
  const dispatch = useDispatch();
  const [error, setError] = useState(false);
  const [productInfo, setProductInfo] = useState([]);
  const [allLoaded, setAllLoaded] = useState(false);
  const [itemNotfound, setItemNotfound] = useState(false);
  const [loadingMore, setLoadingMore] = useState(true);
  const [showActivityIndicator, setShowActivityIndicator] = useState(false);
  const [progressing, setProgressing] = useState(false);
  const [showErrorMessage, setShowErrorMessage] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [message, setMessage] = useState("");
  const { userLatitude, userLongitude, districtId, userInfo } = useSelector(
    (state) => state.user
  );
  // const { merchantId, customstore_id } = useSelector(
  //   (state) => state.itemsByStoreReducer
  // );
  // const { specialOfferItem, dealOfTheDay } = useSelector(
  //   (state) => state.itemsByStoreReducer
  // );

  const Axios = axios.create({
    baseURL: MEDICINE_URL,
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  });

  const AxiosWithFormData = axios.create({
    baseURL: MEDICINE_URL,
    headers: {
      Accept: "*/*",
      "Content-Type": "multipart/form-data",
    },
  });

  // const AxiosTest = axios.create({
  //   baseURL: MEDICINE_ADMIN_URL_LOCAL,
  //   headers: {
  //     Accept: "application/json",
  //     "Content-Type": "application/json",
  //   },
  // });

  const setCurrentModule = () => {
    dispatch(
      handleDashboardReducer({
        type: "SET_CURRENT_MODULE",
        data: "dashboard",
      })
    );
  };

  const saveItemsToReducer = (items) => {
    if (items.length < 1) {
      setProductInfo([]);
    } else {
      //setProductInfo(items);
      setProductInfo((prevInfo) => [...prevInfo, ...items]);
    }
    // dispatch(
    //     handleItemsByStoreReducer({
    //         type: 'SAVE_PRODUCT_INFO',
    //         data: items,
    //     })
    // );
  };

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
        data: "Medicine",
      })
    );
  };

  const getNearestMedicineStoreInfo = (setNearestInfo, distance) => {
    resetReducer();
    setProgressing(true);
    const props = {
      shop_longitude: userLongitude,
      shop_latitude: userLatitude,
      max_distance: distance,
      districtId: districtId,
    };

    Axios.post(NEAREST_MEDICINE_STORE, props)
      .then((response) => {
        //console.log(response.data);
        setNearestInfo(response.data.result);
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

  const handleSearchStore = (searchText, setNearestInfo) => {
    if (searchText.length > 1) {
      setProgressing(true);
      Axios.get(SEARCH_MEDICINE_STORE, {
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

  // storeId: "652fcf859e51f7d1601b02ed",
  // custom_store_id: "MS111112",

  const exploreStore = (data) => {
    resetReducer();
    setProgressing(true);
    Axios.get(EXPLORE_MEDICINE_STORE, {
      params: {
        storeId: data?._id,
        custom_store_id: data?.custom_store_id,
      },
    })
      .then((res) => {
        // console.log(res);

        //console.log('res?.data?.result?.ShopDetails[0]?.is_closed', res?.data?.result?.ShopDetails[0]?.is_closed);
        if (
          res?.data?.result?.ShopDetails[0]?.is_closed ||
          !res?.data?.result?.ShopDetails[0]?.is_active ||
          res?.data?.result?.ShopDetails[0]?.is_banned
        ) {
          //   navigation.goBack();
          //   Alert.alert("Sorry we're closed !!", "See you tomorrow !!", [
          //     {
          //       text: "Ok",
          //       onPress: () => null,
          //       style: "default",
          //     },
          //   ]);
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
          //     type: "EXPLORE_MED_STORE",
          //     data: res?.data?.result,
          //   })
          // );
        }
        setProgressing(false);
      })
      .catch((error) => {
        setProgressing(false);
        console.log(error);
      });
  };

  const handleSearch = (searchText, pageNo, setPageNo) => {
    if (searchText.length > 1) {
      if (pageNo === 1) {
        resetLoadingStatus();
      }

      Axios.get(SEARCH_MEDICINE_ITEMS, {
        params: {
          search: searchText,
          merchantId: "652fcf859e51f7d1601b02ed",
          custom_store_id: "MS111112",
          page: pageNo,
        },
      })
        .then((res) => {
          setPageNo(pageNo + 1);
          if (res?.data?.result.length > 0) {
            saveItemsToReducer(res?.data?.result);
          }
          if (res?.data?.result.length < 24) {
            setAllLoaded(true);
            setLoadingMore(false);
            //setShowActivityIndicator(false);
          }
          if (pageNo === 1 && res?.data?.result.length < 1) {
            setItemNotfound(true);
            setLoadingMore(false);
          }
        })
        .catch((error) => {
          setAllLoaded(true);
          setLoadingMore(false);
        });
    }
  };

  const getItemsOnPress = (option, id, pageNo, setPageNo) => {
    setProgressing(true);
    // let goForSearch = false;

    setLoadingMore(true);
    let dataURL = MEDICINE_ITEMS_BY_SUBTYPE;

    let parameter = {
      merchantId: "652fcf859e51f7d1601b02ed",
      custom_store_id: "MS111112",
      page: pageNo,
    };

    if (option === "sub-type") {
      parameter.productSubtype = id;
      //goForSearch = true;
    }

    if (option === "custom-type") {
      parameter.customType = id;
      dataURL = GROCERY_ITEMS_BY_CUSTOMTYPE;
    }

    if (pageNo === 1) {
      resetLoadingStatus();
    }

    Axios.get(dataURL, {
      params: parameter,
    })
      .then((res) => {
        //console.log(res?.data?.result);

        if (res?.data?.result?.length > 0) {
          setProgressing(false);
          setPageNo(pageNo + 1);
          saveItemsToReducer(res?.data?.result);
        }

        if (pageNo === 1 && res?.data?.result?.length < 1) {
          setItemNotfound(true);
          setLoadingMore(false);
        }

        if (res?.data?.result?.length < 24) {
          setAllLoaded(true);
          setLoadingMore(false);
        }
      })
      .catch((error) => {
        setAllLoaded(true);
        setLoadingMore(false);
      });
  };

  const reloadCustomTypeData = (options, setPageNo) => {
    setTimeout(() => {
      if (options.customType === "65128cbd20db0921f13b40b3") {
        // this is "64f5a306baa57a4707524d6e" Offer Items ID
        if (specialOfferItem.length < 24) {
          setAllLoaded(true);
        }
        saveItemsToReducer(specialOfferItem);
      }
      setLoadingMore(false);
      setPageNo(2);
    }, 500);
  };

  const resetLoadingStatus = (status = false) => {
    saveItemsToReducer([]);
    setShowActivityIndicator(true);
    setItemNotfound(false);
    setAllLoaded(status);
    setLoadingMore(true);
  };

  useEffect(() => {
    if (error) {
      //userLogOut();
    }
  }, [error]);

  return {
    showActivityIndicator,
    loadingMore,
    itemNotfound,
    allLoaded,
    progressing,
    showErrorMessage,
    showSuccessMessage,
    message,
    productInfo,
    setMessage,
    setProgressing,
    setShowErrorMessage,
    setShowSuccessMessage,
    setLoadingMore,
    saveItemsToReducer,
    handleSearch,
    getItemsOnPress,
    getNearestMedicineStoreInfo,
    exploreStore,
    reloadCustomTypeData,
    resetLoadingStatus,
    handleSearchStore,
    resetReducer,
    setCurrentModule,
  };
};
