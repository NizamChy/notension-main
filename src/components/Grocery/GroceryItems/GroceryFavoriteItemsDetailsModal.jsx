"use client";

import React, { useEffect, useState } from "react";
import { HiOutlineCube } from "react-icons/hi2";
import { EmptyState } from "@/components/shared/UI/UI";
import useGroceryItems from "@/hooks/fetch-data/useGroceryItems";
import { useFavouriteItem } from "@/hooks/fetch-data/favorite-item";
import { GROCERY_ITEMS_IMAGES } from "@/api-endpoints/api-endpoint";
import ProductQuickView from "@/components/StoreModule/ProductQuickView";
import ProductDetailsView, {
  discountLabelOf,
} from "@/components/StoreModule/ProductDetailsView";
import GroceryItemDetailsSkeleton from "./GroceryItemDetailsSkeleton";

const GroceryFavoriteItemsDetailsModal = ({ isOpen, onClose, item }) => {
  const [currentQuantity, setCurrentQuantity] = useState(0);
  const [isFavoriteAdded, setIsFavoriteAdded] = useState(null);

  const { addToCart, getCurrentQty, incrementQty, decrementQty } =
    useGroceryItems();

  const {
    message,
    visible,
    itemDetails,
    addToFavouriteItems,
    isAddedToFavouriteItems,
    removeFromfavoriteItems,
    getGroceryProductDetails,
  } = useFavouriteItem();

  let merchantType = 0;
  let isExists = null;

  const handleAddToCart = (event) => {
    event.preventDefault();
    event.stopPropagation();

    addToCart(itemDetails);
  };

  const handleAddToFavorite = (event) => {
    event.preventDefault();
    event.stopPropagation();

    addToFavouriteItems(itemDetails, merchantType);
  };

  const handleRemoveFromFavorite = (event) => {
    event.preventDefault();
    event.stopPropagation();

    removeFromfavoriteItems(item, merchantType);
  };

  const handleIncrement = (e, itemId) => {
    e.preventDefault();
    e.stopPropagation();

    incrementQty(itemId);
  };

  const handleDecrement = (e, itemId) => {
    e.preventDefault();
    e.stopPropagation();

    decrementQty(itemId);
  };

  useEffect(() => {
    getGroceryProductDetails(item?.productId);
  }, [item]);

  useEffect(() => {
    const itemQty = getCurrentQty(itemDetails);
    setCurrentQuantity(itemQty);
  }, [itemDetails, incrementQty, decrementQty]);

  useEffect(() => {
    isExists = isAddedToFavouriteItems(
      // productInfoTable is an id string (populated object on some
      // responses); `?._id` alone was always undefined for the string form.
      itemDetails?.productInfoTable?._id ?? itemDetails?.productInfoTable,
      merchantType
    );

    setIsFavoriteAdded(isExists);
  }, [itemDetails, handleAddToFavorite, handleRemoveFromFavorite]);

  return (
    <ProductQuickView isOpen={isOpen} onClose={onClose}>
      {visible ? (
        <GroceryItemDetailsSkeleton />
      ) : message ? (
        <EmptyState
          icon={<HiOutlineCube />}
          title="Not available"
          text={message}
          className="min-h-[30vh] !border-0"
        />
      ) : (
        <ProductDetailsView
          variant="modal"
          imageSrc={
            itemDetails?.app_image
              ? `${GROCERY_ITEMS_IMAGES}/${itemDetails?.app_image}`
              : "/png/dummyImage.png"
          }
          title={itemDetails?.product_title_eng}
          altTitle={itemDetails?.product_title_beng}
          chips={[itemDetails?.pack_size]}
          discountLabel={discountLabelOf(itemDetails)}
          salePrice={itemDetails?.sale_price}
          mrp={itemDetails?.max_retail_price}
          savings={
            itemDetails?.less > 0
              ? itemDetails?.max_retail_price - itemDetails?.sale_price
              : 0
          }
          quantity={currentQuantity}
          onAddToCart={handleAddToCart}
          onIncrement={(e) => handleIncrement(e, itemDetails?._id)}
          onDecrement={(e) => handleDecrement(e, itemDetails?._id)}
          isFavorite={!!isFavoriteAdded}
          onFavoriteToggle={
            isFavoriteAdded ? handleRemoveFromFavorite : handleAddToFavorite
          }
        />
      )}
    </ProductQuickView>
  );
};

export default GroceryFavoriteItemsDetailsModal;
