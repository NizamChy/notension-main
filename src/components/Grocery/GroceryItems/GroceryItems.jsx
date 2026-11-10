"use client";

import { useParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import StoreItemCard from "@/components/StoreModule/StoreItemCard";
import GroceryItemDetailsModal from "./GroceryItemDetailsModal";
import useGroceryItems from "@/hooks/fetch-data/useGroceryItems";
import { useFavouriteItem } from "@/hooks/fetch-data/favorite-item";
import { GROCERY_ITEMS_IMAGES } from "@/api-endpoints/api-endpoint";
import { handleUserChoiceReducer } from "@/redux/userChoiceReducer";
import CommonModal from "@/components/shared/CommonModal/CommonModal";
import LoginModalDetails from "@/components/LoginSection/LoginModalDetails";
import GroceryFavoriteItemsDetailsModal from "./GroceryFavoriteItemsDetailsModal";

const GroceryItems = ({ item, isFavorite = false }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [currentQuantity, setCurrentQuantity] = useState(0);
  const [isFavoriteAdded, setIsFavoriteAdded] = useState(null);

  const params = useParams();
  const prevUrlRef = useRef(null);

  const dispatch = useDispatch();

  const { addToCart, getCurrentQty, incrementQty, decrementQty } =
    useGroceryItems();

  const {
    addToFavouriteItems,
    isAddedToFavouriteItems,
    removeFromfavoriteItems,
  } = useFavouriteItem();

  const loggedinUserInfo = useSelector((state) => state.user.userInfo);

  let isExists = null;
  let merchantType = 0;

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const handleAddToCart = (event) => {
    event.preventDefault();
    event.stopPropagation();

    addToCart(item);
  };

  const handleAddToFavorite = (event) => {
    event.preventDefault();
    event.stopPropagation();

    if (!loggedinUserInfo?._id) {
      return openModal();
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

    if (isFavorite) {
      removeFromfavoriteItems(item, merchantType);
    } else {
      removeFromfavoriteItems(favouriteInfo, merchantType);
    }
  };

  const handleProductClick = (event) => {
    event.preventDefault();
    event.stopPropagation();

    setSelectedItem(item);

    dispatch(
      handleUserChoiceReducer({
        type: "SAVE_CURRENT_ITEM_DETAILS",
        data: item,
      })
    );
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

  useEffect(() => {
    const basePath = `/grocery/${params?.store}/${params?.storeId}/${params?.customStoreId}`;

    if (selectedItem && item?._id) {
      if (!prevUrlRef.current) {
        prevUrlRef.current = window.location.href;
      }

      const newUrl = `${basePath}/product/${item._id}`;
      if (!window.location.pathname.endsWith(`/${item._id}`)) {
        window.history.pushState({}, "", newUrl);
      }
    } else {
      if (prevUrlRef.current) {
        window.history.pushState({}, "", prevUrlRef.current);
        prevUrlRef.current = null;

        dispatch(
          handleUserChoiceReducer({
            type: "SAVE_CURRENT_ITEM_DETAILS",
            data: {},
          })
        );
      }
    }
  }, [selectedItem, item?._id, params]);

  return (
    <>
      <StoreItemCard
        moduleName="grocery"
        imageSrc={
          item?.app_image
            ? `${GROCERY_ITEMS_IMAGES}/${item?.app_image}`
            : "/png/dummyImage.png"
        }
        title={item?.product_title_eng}
        subtitle={item?.pack_size}
        salePrice={item?.sale_price}
        mrp={item?.max_retail_price}
        discountLabel={
          item?.less > 0
            ? `${item?.less}${item?.less_type === "Percent" ? "%" : "৳"} OFF`
            : null
        }
        isFavorite={isFavorite || !!isFavoriteAdded}
        onClick={handleProductClick}
        onFavoriteToggle={
          isFavorite || isFavoriteAdded
            ? handleRemoveFromFavorite
            : handleAddToFavorite
        }
        showCartControls={!isFavorite}
        quantity={currentQuantity}
        onAddToCart={handleAddToCart}
        onIncrement={(e) => handleIncrement(e, item._id)}
        onDecrement={(e) => handleDecrement(e, item._id)}
      />

      {selectedItem && !isFavorite && (
        <GroceryItemDetailsModal
          isOpen={!!selectedItem}
          onClose={() => setSelectedItem(null)}
          item={selectedItem}
        />
      )}

      {selectedItem && isFavorite && (
        <GroceryFavoriteItemsDetailsModal
          isOpen={!!selectedItem}
          onClose={() => setSelectedItem(null)}
          item={selectedItem}
        />
      )}

      <CommonModal isOpen={isModalOpen} onClose={closeModal}>
        <LoginModalDetails
          onClose={closeModal}
          type="favourite"
          handleAddToFavorite={handleAddToFavorite}
        />
      </CommonModal>
    </>
  );
};

export default GroceryItems;
