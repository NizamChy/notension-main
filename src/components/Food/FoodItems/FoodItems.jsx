"use client";

import { useDispatch } from "react-redux";
import { useParams } from "next/navigation";
import StoreItemCard from "@/components/StoreModule/StoreItemCard";
import { useEffect, useRef, useState } from "react";
import FoodItemDetailsModal from "./FoodItemDetailsModal";
import useFoodItems from "@/hooks/fetch-data/useFoodItems";
import { FOOD_ITEMS_IMAGES } from "@/api-endpoints/api-endpoint";
import { handleUserChoiceReducer } from "@/redux/userChoiceReducer";

const FoodItems = ({ item }) => {
  const [selectedItem, setSelectedItem] = useState(null);
  const [currentQuantity, setCurrentQuantity] = useState(0);

  const params = useParams();
  const prevUrlRef = useRef(null);
  const dispatch = useDispatch();

  const { addToCart, getCurrentQty, incrementQty, decrementQty } =
    useFoodItems();

  const handleAddToCart = (event) => {
    event.preventDefault();
    event.stopPropagation();

    addToCart(item);
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

  useEffect(() => {
    const itemQty = getCurrentQty(item);
    setCurrentQuantity(itemQty);
  }, [item, incrementQty, decrementQty]);

  useEffect(() => {
    const basePath = `/food/store/${params?.store}/${params?.storeId}/${params?.customStoreId}`;

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
        moduleName="food"
        imageSrc={
          item?.app_image
            ? `${FOOD_ITEMS_IMAGES}/${item?.app_image}`
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
        onClick={handleProductClick}
        quantity={currentQuantity}
        onAddToCart={handleAddToCart}
        onIncrement={(e) => handleIncrement(e, item?._id)}
        onDecrement={(e) => handleDecrement(e, item?._id)}
      />

      {selectedItem && (
        <FoodItemDetailsModal
          isOpen={!!selectedItem}
          onClose={() => setSelectedItem(null)}
          item={selectedItem}
        />
      )}
    </>
  );
};

export default FoodItems;
