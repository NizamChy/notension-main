"use client";

import { useSessionStore } from "@/stores/sessionStore";
import notify from "@/utils/notify";
import { useSelector } from "react-redux";
import { useParams } from "next/navigation";
import { getApiClient } from "@/lib/apiClient";
import React, { useEffect, useState } from "react";
import { GROCERY_URL } from "@/api-endpoints/env";
import ProductDetailsPage from "@/components/StoreModule/ProductDetailsPage";
import ProductDetailsView, {
  discountLabelOf,
} from "@/components/StoreModule/ProductDetailsView";
import { useGroceryCart } from "@/hooks/grocery/useGroceryCart";
import { useStoreData } from "@/components/StoreModule/useStoreData";
import { useFavouriteItem } from "@/hooks/fetch-data/favorite-item";
import {
  GROCERY_ITEM_DETAILS,
  GROCERY_ITEMS_IMAGES,
} from "@/api-endpoints/api-endpoint";
import { flyToCart } from "@/utils/flyToCart";

const GroceryItemDetails = () => {
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

    getApiClient(GROCERY_URL)
      .get(GROCERY_ITEM_DETAILS, {
        params: {
          productInfoTable: productId,
          groceryStoreId: params?.storeId,
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
    useGroceryCart();
  // The visited store, from the store query (not Redux).
  const { storeRef } = useStoreData("grocery");
  const {
    addToFavouriteItems,
    isAddedToFavouriteItems,
    removeFromfavoriteItems,
  } = useFavouriteItem(storeRef);

  const loggedinUserInfo = useSessionStore((s) => s.userInfo);

  let merchantType = 0;
  let isExists = null;

  const handleAddToCart = async (event) => {
    event.preventDefault();
    event.stopPropagation();
    const from = event.currentTarget;
    setIsLoading(true);
    try {
      if (await addToCart(item)) flyToCart(from);
      // toast.success("Added to cart successfully!");
    } catch (error) {
      notify.error("Couldn't add to cart. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddToFavorite = async (event) => {
    event.preventDefault();
    event.stopPropagation();

    if (!loggedinUserInfo?._id) {
      return notify.info("Please log in to save favourites.");
    }

    setIsLoading(true);
    try {
      await addToFavouriteItems(item, merchantType);
      setIsFavoriteAdded(true);
      // toast.success("Added to favorites!");
    } catch (error) {
      notify.error("Couldn't add to favourites. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveFromFavorite = async (event) => {
    event.preventDefault();
    event.stopPropagation();

    const favouriteInfo = {
      productId: item?.productInfoTable,
      product_title_eng: item?.product_title_eng,
      product_title_beng: item?.product_title_beng,
      pack_size: item?.pack_size,
      app_image: item?.app_image,
    };

    setIsLoading(true);
    try {
      await removeFromfavoriteItems(favouriteInfo, merchantType);
      setIsFavoriteAdded(false);
      // toast.success("Removed from favorites!");
    } catch (error) {
      notify.error("Couldn't remove from favourites. Please try again.");
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
    isExists = isAddedToFavouriteItems(item?.productInfoTable, merchantType);
    setIsFavoriteAdded(isExists);
  }, [item, handleAddToFavorite, handleRemoveFromFavorite]);

  return (
    <ProductDetailsPage
      basePath="/grocery"
      isLoading={!item && (isFetching || !notFound)}
      notFound={!item && notFound}
    >
      {item && (
        <ProductDetailsView
          imageSrc={
            item?.app_image
              ? `${GROCERY_ITEMS_IMAGES}/${item?.app_image}`
              : "/png/dummyImage.png"
          }
          title={item?.product_title_eng}
          altTitle={item?.product_title_beng}
          chips={[item?.pack_size]}
          discountLabel={discountLabelOf(item)}
          salePrice={item?.sale_price}
          mrp={item?.max_retail_price}
          savings={
            item?.less > 0 ? item?.max_retail_price - item?.sale_price : 0
          }
          isAvailable={item?.is_available == null ? null : !!item?.is_available}
          details={[
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

export default GroceryItemDetails;
