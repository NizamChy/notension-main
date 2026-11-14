"use client";

import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import React, { useEffect, useState } from "react";
import useGroceryItems from "@/hooks/fetch-data/useGroceryItems";
import { useFavouriteItem } from "@/hooks/fetch-data/favorite-item";
import { GROCERY_ITEMS_IMAGES } from "@/api-endpoints/api-endpoint";
import ProductQuickView from "@/components/StoreModule/ProductQuickView";
import ProductDetailsView, {
  discountLabelOf,
} from "@/components/StoreModule/ProductDetailsView";

const GroceryItemDetailsModal = ({ isOpen, onClose, item }) => {
  const [currentQuantity, setCurrentQuantity] = useState(0);
  const [isFavoriteAdded, setIsFavoriteAdded] = useState(null);

  const { addToCart, getCurrentQty, incrementQty, decrementQty } =
    useGroceryItems();
  const {
    addToFavouriteItems,
    isAddedToFavouriteItems,
    removeFromfavoriteItems,
  } = useFavouriteItem();

  const loggedinUserInfo = useSelector((state) => state.user.userInfo);

  let merchantType = 0;
  let isExists = null;

  const handleAddToCart = (event) => {
    event.preventDefault();
    event.stopPropagation();

    addToCart(item);
  };

  const handleAddToFavorite = (event) => {
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

    addToFavouriteItems(item, merchantType);
  };

  const handleRemoveFromFavorite = (event) => {
    event.preventDefault();
    event.stopPropagation();

    const favouriteInfo = {
      productId: item?.productInfoTable,
      product_title_eng: item?.product_title_eng,
      product_title_beng: item?.product_title_beng,
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
    isExists = isAddedToFavouriteItems(item?.productInfoTable, merchantType);

    setIsFavoriteAdded(isExists);
  }, [item, handleAddToFavorite, handleRemoveFromFavorite]);

  return (
    <ProductQuickView isOpen={isOpen} onClose={onClose}>
      <ProductDetailsView
        variant="modal"
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
        savings={item?.less > 0 ? item?.max_retail_price - item?.sale_price : 0}
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

export default GroceryItemDetailsModal;
