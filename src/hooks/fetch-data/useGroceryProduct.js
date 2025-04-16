import {
  SEARCH_GROCERY_ITEMS,
  GROCERY_ITEMS_BY_SUBTYPE,
  GROCERY_ITEMS_BY_CUSTOMTYPE,
} from "@/api-endpoints/api-endpoint";
import axios from "axios";
import { useState } from "react";
import { useSelector } from "react-redux";
import { GROCERY_URL } from "@/api-endpoints/secret";

axios.defaults.withCredentials = true;

export const useGroceryProduct = () => {
  const [allLoaded, setAllLoaded] = useState(false);
  const [productInfo, setProductInfo] = useState([]);
  const [loadingMore, setLoadingMore] = useState(true);
  const [progressing, setProgressing] = useState(false);
  const [itemNotfound, setItemNotfound] = useState(false);
  const [showActivityIndicator, setShowActivityIndicator] = useState(false);

  const { merchantId, customstore_id } = useSelector(
    (state) => state.itemsByStore
  );

  // const { specialOfferItem, dealOfTheDay } = useSelector(
  //   (state) => state.itemsByStoreReducer
  // );

  const Axios = axios.create({
    baseURL: GROCERY_URL,
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  });

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

  const handleSearch = (searchText, pageNo, setPageNo) => {
    setLoadingMore(true);
    if (searchText?.length > 1) {
      if (pageNo === 1) {
        resetLoadingStatus();
      }

      Axios.get(SEARCH_GROCERY_ITEMS, {
        params: {
          search: searchText,
          groceryStoreId: merchantId,
          custom_store_id: customstore_id,
          // groceryStoreId: "6527d0a1b7199de299cd2284",
          // custom_store_id: "GS111112",
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
    //let goForSearch = false;

    setLoadingMore(true);
    let dataURL = GROCERY_ITEMS_BY_SUBTYPE;

    let parameter = {
      // groceryStoreId: "6527d0a1b7199de299cd2284",
      // custom_store_id: "GS111112",
      groceryStoreId: merchantId,
      custom_store_id: customstore_id,
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
        // console.log(res?.data?.result);

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
      if (options.customType === "64f5a306baa57a4707524d6e") {
        // this is "64f5a306baa57a4707524d6e" Offer Items ID

        if (specialOfferItem.length < 24) {
          setAllLoaded(true);
        }
        saveItemsToReducer(specialOfferItem);
      } else {
        if (dealOfTheDay.length < 24) {
          setAllLoaded(true);
        }
        saveItemsToReducer(dealOfTheDay);
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

  return {
    showActivityIndicator,
    itemNotfound,
    productInfo,
    progressing,
    loadingMore,
    allLoaded,
    handleSearch,
    setLoadingMore,
    getItemsOnPress,
    resetLoadingStatus,
    reloadCustomTypeData,
  };
};
