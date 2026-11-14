"use client";

import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { useParams } from "next/navigation";
import { getApiClient } from "@/lib/apiClient";
import React, { useEffect, useState } from "react";
import { MEDICINE_URL } from "@/api-endpoints/env";
import ProductDetailsPage from "@/components/StoreModule/ProductDetailsPage";
import ProductDetailsView, {
  discountLabelOf,
} from "@/components/StoreModule/ProductDetailsView";
import useMedicineItems from "@/hooks/fetch-data/useMedicineItems";
import { useFavouriteItem } from "@/hooks/fetch-data/favorite-item";
import {
  MEDICINE_ITEM_DETAILS,
  MEDICINE_ITEMS_IMAGES,
} from "@/api-endpoints/api-endpoint";

const MedicineItemDetails = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [currentQuantity, setCurrentQuantity] = useState(0);
  const [isFavoriteAdded, setIsFavoriteAdded] = useState(null);
  const [fetchedItem, setFetchedItem] = useState(null);
  const [isFetching, setIsFetching] = useState(false);
  const [notFound, setNotFound] = useState(false);

  const params = useParams();
  const productId = params?.productId;

  const { currentItemDetails } = useSelector((state) => state.userChoice);

  // Redux has the item when it was opened from a list. A direct link (or a
  // reload with cleared state) fetches it by id instead.
  const hasReduxItem = !!productId && currentItemDetails?._id === productId;
  const item = hasReduxItem ? currentItemDetails : fetchedItem;

  useEffect(() => {
    if (!productId || hasReduxItem) return;

    let cancelled = false;
    setIsFetching(true);
    setNotFound(false);

    getApiClient(MEDICINE_URL)
      .get(MEDICINE_ITEM_DETAILS, {
        params: {
          medStoreProductInfo: productId,
          merchantId: params?.storeId,
          custom_store_id: params?.customStoreId,
        },
      })
      .then((res) => {
        if (cancelled) return;
        if (res?.data?.success && res?.data?.result) {
          setFetchedItem(res.data.result);
        } else {
          setNotFound(true);
        }
      })
      .catch(() => {
        if (!cancelled) setNotFound(true);
      })
      .finally(() => {
        if (!cancelled) setIsFetching(false);
      });

    return () => {
      cancelled = true;
    };
  }, [productId, hasReduxItem, params?.storeId, params?.customStoreId]);

  const { addToCart, getCurrentQty, incrementQty, decrementQty } =
    useMedicineItems();
  const {
    addToFavouriteItems,
    isAddedToFavouriteItems,
    removeFromfavoriteItems,
  } = useFavouriteItem();

  const loggedinUserInfo = useSelector((state) => state.user.userInfo);

  let merchantType = 1;
  let isExists = null;

  const handleAddToCart = async (event) => {
    event.preventDefault();
    event.stopPropagation();
    setIsLoading(true);
    try {
      await addToCart(item);
    } catch (error) {
      toast.error("Failed to add to cart");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddToFavorite = async (event) => {
    event.preventDefault();
    event.stopPropagation();

    if (!loggedinUserInfo?._id) {
      return toast("Please Login first!", {
        style: {
          border: "1px solid #FC8F1E",
        },
        icon: "ℹ️",
        iconTheme: {
          primary: "#FC8F1E",
          secondary: "#FFFAEE",
        },
      });
    }

    setIsLoading(true);
    try {
      await addToFavouriteItems(item, merchantType);
      setIsFavoriteAdded(true);
    } catch (error) {
      toast.error("Failed to add to favorites");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveFromFavorite = async (event) => {
    event.preventDefault();
    event.stopPropagation();

    const favouriteInfo = {
      productId: item?.medStoreProductInfo,
      item_title_eng: item?.item_title_eng,
      product_title_beng: item?.product_title_beng,
      pack_size: item?.pack_size,
      app_image: item?.app_image,
    };

    setIsLoading(true);
    try {
      await removeFromfavoriteItems(favouriteInfo, merchantType);
      setIsFavoriteAdded(false);
    } catch (error) {
      toast.error("Failed to remove from favorites");
    } finally {
      setIsLoading(false);
    }
  };

  const handleIncrement = async (e, itemId) => {
    e.preventDefault();
    e.stopPropagation();
    setIsLoading(true);
    try {
      await incrementQty(itemId);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDecrement = async (e, itemId) => {
    e.preventDefault();
    e.stopPropagation();
    setIsLoading(true);
    try {
      await decrementQty(itemId);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const itemQty = getCurrentQty(item);
    setCurrentQuantity(itemQty);
  }, [item, incrementQty, decrementQty]);

  useEffect(() => {
    isExists = isAddedToFavouriteItems(item?.medStoreProductInfo, merchantType);
    setIsFavoriteAdded(isExists);
  }, [item, handleAddToFavorite, handleRemoveFromFavorite]);

  return (
    <ProductDetailsPage
      basePath="/medicine"
      isLoading={!item && (isFetching || !notFound)}
      notFound={!item && notFound}
    >
      {item && (
        <ProductDetailsView
          imageSrc={
            item?.app_image
              ? `${MEDICINE_ITEMS_IMAGES}/${item?.app_image}`
              : "/png/dummyImage.png"
          }
          title={item?.item_title_eng}
          altTitle={item?.item_title_beng || item?.product_title_beng}
          highlight={item?.generic_name}
          byline={item?.company_name}
          chips={[item?.strength, item?.pack_size]}
          badges={
            item?.prescription_required
              ? [{ label: "Prescription required", tone: "amber" }]
              : []
          }
          discountLabel={discountLabelOf(item)}
          salePrice={item?.sale_price}
          mrp={item?.max_retail_price}
          savings={
            item?.less > 0
              ? Number(
                  (item?.max_retail_price - item?.sale_price).toFixed(2),
                )
              : 0
          }
          isAvailable={item?.is_available == null ? null : !!item?.is_available}
          details={[
            { label: "Generic name", value: item?.generic_name },
            { label: "Manufacturer", value: item?.company_name },
            { label: "Strength", value: item?.strength },
            { label: "Pack size", value: item?.pack_size },
            { label: "Unit", value: item?.unit_symbol },
          ]}
          quantity={currentQuantity}
          isBusy={isLoading}
          onAddToCart={handleAddToCart}
          onIncrement={(e) => handleIncrement(e, item._id)}
          onDecrement={(e) => handleDecrement(e, item._id)}
          isFavorite={!!isFavoriteAdded}
          onFavoriteToggle={
            isFavoriteAdded ? handleRemoveFromFavorite : handleAddToFavorite
          }
        />
      )}
    </ProductDetailsPage>
  );
};

export default MedicineItemDetails;
