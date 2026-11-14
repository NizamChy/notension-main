"use client";

import Image from "next/image";
import { useDispatch } from "react-redux";
import { useParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import DishCartControl from "./DishCartControl";
import FoodItemDetailsModal from "./FoodItemDetailsModal";
import useFoodItems from "@/hooks/fetch-data/useFoodItems";
import { formatTaka } from "@/components/shared/CartUI/CartUI";
import { FOOD_ITEMS_IMAGES } from "@/api-endpoints/api-endpoint";
import { handleUserChoiceReducer } from "@/redux/userChoiceReducer";
import { CARD, CARD_HOVER } from "@/components/shared/UI/UI";
import { discountLabelOf } from "./dishUtils";

// One dish on a restaurant menu: name, Bangla name, portion and price on the
// left, a square photo with the add button on the right.
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

  const name = item?.product_title_eng || "Dish";
  const discount = discountLabelOf(item);
  const hasMrp = item?.sale_price < item?.max_retail_price;

  return (
    <>
      <article
        role="button"
        tabIndex={0}
        aria-label={`View ${name}`}
        onClick={handleProductClick}
        onKeyDown={(e) => {
          if (e.target === e.currentTarget && (e.key === "Enter" || e.key === " ")) {
            handleProductClick(e);
          }
        }}
        className={`${CARD} ${CARD_HOVER} group flex h-full cursor-pointer gap-3 p-3 outline-none focus-visible:ring-2 focus-visible:ring-[#0C3F8E]/40 sm:gap-4 sm:p-4`}
      >
        <div className="flex min-w-0 flex-1 flex-col">
          <h3 className="line-clamp-2 text-[15px] font-semibold leading-snug text-gray-900">
            {name}
          </h3>
          {item?.product_title_beng && (
            <p className="mt-0.5 line-clamp-1 text-sm text-gray-500">
              {item.product_title_beng}
            </p>
          )}
          {item?.pack_size && (
            <p className="mt-1 text-xs text-gray-500">{item.pack_size}</p>
          )}

          <div className="mt-auto flex flex-wrap items-center gap-x-2 gap-y-1 pt-3">
            <span className="text-base font-bold tabular-nums text-gray-900">
              {formatTaka(item?.sale_price)}
            </span>
            {hasMrp && (
              <span className="text-xs tabular-nums text-gray-400 line-through">
                {formatTaka(item?.max_retail_price)}
              </span>
            )}
            {discount && (
              <span className="rounded-full bg-[#EB5C2F]/10 px-2 py-0.5 text-[11px] font-semibold text-[#C4320A] dark:text-[#FF8A5B]">
                {discount}
              </span>
            )}
          </div>
        </div>

        <div className="relative w-28 shrink-0 self-start sm:w-32">
          <div className="relative aspect-square overflow-hidden rounded-xl bg-gray-100">
            <Image
              fill
              sizes="128px"
              src={
                item?.app_image
                  ? `${FOOD_ITEMS_IMAGES}/${item?.app_image}`
                  : "/png/dummyImage.png"
              }
              alt={name}
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
          </div>
          <div className="absolute -bottom-2 right-1.5">
            <DishCartControl
              name={name}
              quantity={currentQuantity}
              onAdd={handleAddToCart}
              onIncrement={(e) => handleIncrement(e, item?._id)}
              onDecrement={(e) => handleDecrement(e, item?._id)}
            />
          </div>
        </div>
      </article>

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
