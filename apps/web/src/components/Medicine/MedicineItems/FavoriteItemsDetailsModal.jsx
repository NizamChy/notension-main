"use client";

import React, { useEffect, useState } from "react";
import { HiOutlineCube } from "react-icons/hi2";
import ItemDetailsSkeleton from "./ItemDetailsSkeleton";
import { EmptyState } from "@/components/shared/UI/UI";
import useMedicineItems from "@/hooks/fetch-data/useMedicineItems";
import { useFavouriteItem } from "@/hooks/fetch-data/favorite-item";
import { MEDICINE_ITEMS_IMAGES } from "@/api-endpoints/api-endpoint";
import ProductQuickView from "@/components/StoreModule/ProductQuickView";
import ProductDetailsView, {
  discountLabelOf,
} from "@/components/StoreModule/ProductDetailsView";

const FavoriteItemsDetailsModal = ({ isOpen, onClose, item }) => {
  const [currentQuantity, setCurrentQuantity] = useState(0);
  const [isFavoriteAdded, setIsFavoriteAdded] = useState(null);

  const { addToCart, getCurrentQty, incrementQty, decrementQty } =
    useMedicineItems();

  const {
    getMedicineProductDetails,
    itemDetails,
    message,
    visible,
    addToFavouriteItems,
    isAddedToFavouriteItems,
    removeFromfavoriteItems,
  } = useFavouriteItem();

  let merchantType = 1;
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

    const favouriteInfo = {
      productId: itemDetails?.medStoreProductInfo,
      item_title_eng: itemDetails?.item_title_eng,
      item_title_beng: itemDetails?.item_title_beng,
      pack_size: itemDetails?.pack_size,
      app_image: itemDetails?.app_image,
    };

    removeFromfavoriteItems(favouriteInfo, merchantType);
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
    getMedicineProductDetails(item?.productId);
  }, [item]);

  useEffect(() => {
    const itemQty = getCurrentQty(itemDetails);
    setCurrentQuantity(itemQty);
  }, [itemDetails, incrementQty, decrementQty]);

  useEffect(() => {
    isExists = isAddedToFavouriteItems(
      itemDetails?.medStoreProductInfo,
      merchantType
    );

    setIsFavoriteAdded(isExists);
  }, [itemDetails, handleAddToFavorite, handleRemoveFromFavorite]);

  return (
    <ProductQuickView isOpen={isOpen} onClose={onClose}>
      {visible ? (
        <ItemDetailsSkeleton />
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
              ? `${MEDICINE_ITEMS_IMAGES}/${itemDetails.app_image}`
              : "/png/dummyImage.png"
          }
          title={itemDetails?.item_title_eng}
          altTitle={itemDetails?.item_title_beng}
          highlight={itemDetails?.generic_name}
          byline={itemDetails?.company_name}
          chips={[itemDetails?.strength, itemDetails?.pack_size]}
          badges={
            itemDetails?.prescription_required
              ? [{ label: "Prescription required", tone: "amber" }]
              : []
          }
          discountLabel={discountLabelOf(itemDetails)}
          salePrice={itemDetails?.sale_price}
          mrp={itemDetails?.max_retail_price}
          savings={
            itemDetails?.less > 0
              ? Number(
                  (itemDetails?.max_retail_price - itemDetails?.sale_price).toFixed(2),
                )
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

export default FavoriteItemsDetailsModal;
