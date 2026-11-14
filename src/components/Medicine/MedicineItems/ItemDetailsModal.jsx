"use client";

import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import React, { useEffect, useState } from "react";
import useMedicineItems from "@/hooks/fetch-data/useMedicineItems";
import { useFavouriteItem } from "@/hooks/fetch-data/favorite-item";
import { MEDICINE_ITEMS_IMAGES } from "@/api-endpoints/api-endpoint";
import ProductQuickView from "@/components/StoreModule/ProductQuickView";
import ProductDetailsView, {
  discountLabelOf,
} from "@/components/StoreModule/ProductDetailsView";

const ItemDetailsModal = ({ isOpen, onClose, item }) => {
  const [currentQuantity, setCurrentQuantity] = useState(0);
  const [isFavoriteAdded, setIsFavoriteAdded] = useState(null);

  const { addToCart, getCurrentQty, incrementQty, decrementQty } =
    useMedicineItems();
  const {
    addToFavouriteItems,
    isAddedToFavouriteItems,
    removeFromfavoriteItems,
  } = useFavouriteItem();

  const { userInfo } = useSelector((state) => state.user);

  let merchantType = 1;
  let isExists = null;

  const handleAddToCart = (event) => {
    event.preventDefault();
    event.stopPropagation();

    addToCart(item);
  };

  const handleAddToFavorite = (event) => {
    event.preventDefault();
    event.stopPropagation();

    if (!userInfo?._id) {
      return toast("Login to add favourite!", {
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

    addToFavouriteItems(item, merchantType);
  };

  const handleRemoveFromFavorite = (event) => {
    event.preventDefault();
    event.stopPropagation();

    const favouriteInfo = {
      productId: item?.medStoreProductInfo,
      item_title_eng: item?.item_title_eng,
      item_title_beng: item?.item_title_beng,
      pack_size: item?.pack_size,
      app_image: item?.app_image,
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
    const itemQty = getCurrentQty(item);
    setCurrentQuantity(itemQty);
  }, [item, incrementQty, decrementQty]);

  useEffect(() => {
    isExists = isAddedToFavouriteItems(item?.medStoreProductInfo, merchantType);

    setIsFavoriteAdded(isExists);
  }, [item, handleAddToFavorite, handleRemoveFromFavorite]);

  return (
    <ProductQuickView isOpen={isOpen} onClose={onClose}>
      <ProductDetailsView
        variant="modal"
        imageSrc={
          item?.app_image
            ? `${MEDICINE_ITEMS_IMAGES}/${item?.app_image}`
            : "/png/dummyImage.png"
        }
        title={item?.item_title_eng}
        altTitle={item?.item_title_beng}
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
            ? Number((item?.max_retail_price - item?.sale_price).toFixed(2))
            : 0
        }
        quantity={currentQuantity}
        onAddToCart={handleAddToCart}
        onIncrement={(e) => handleIncrement(e, item._id)}
        onDecrement={(e) => handleDecrement(e, item._id)}
        isFavorite={!!isFavoriteAdded}
        onFavoriteToggle={
          isFavoriteAdded ? handleRemoveFromFavorite : handleAddToFavorite
        }
      />
    </ProductQuickView>
  );
};

export default ItemDetailsModal;
