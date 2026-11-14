"use client";

import Image from "next/image";
import React, { useEffect, useState } from "react";
import { HiOutlineShoppingBag } from "react-icons/hi2";
import DishCartControl from "./DishCartControl";
import { discountLabelOf } from "./dishUtils";
import useFoodItems from "@/hooks/fetch-data/useFoodItems";
import { FOOD_ITEMS_IMAGES } from "@/api-endpoints/api-endpoint";
import CommonModal from "@/components/shared/CommonModal/CommonModal";
import { formatTaka, PrimaryButton } from "@/components/shared/CartUI/CartUI";

const FoodItemDetailsModal = ({ isOpen, onClose, item }) => {
  const [currentQuantity, setCurrentQuantity] = useState(0);

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

  useEffect(() => {
    const itemQty = getCurrentQty(item);
    setCurrentQuantity(itemQty);
  }, [item, incrementQty, decrementQty]);

  const name = item?.product_title_eng || "Dish";
  const discount = discountLabelOf(item);
  const hasMrp = item?.sale_price < item?.max_retail_price;

  return (
    <CommonModal
      isOpen={isOpen}
      onClose={onClose}
      className="max-w-lg !rounded-2xl !p-0"
    >
      {/* -z-10: CommonModal's panel is a stacking context (it is scaled),
          so this stays above the panel background but under its close
          button, which overlaps the photo's corner. */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label={name}
        className="relative -z-10 flex max-h-[85vh] flex-col overflow-hidden rounded-2xl"
      >
        <div className="overflow-y-auto">
          <div className="relative aspect-[4/3] w-full bg-gray-100">
            <Image
              fill
              sizes="(min-width: 640px) 512px, 90vw"
              src={
                item?.app_image
                  ? `${FOOD_ITEMS_IMAGES}/${item?.app_image}`
                  : "/png/dummyImage.png"
              }
              alt={name}
              className="object-cover"
            />
            {discount && (
              <span className="absolute left-3 top-3 rounded-full bg-[#EB5C2F] px-2.5 py-1 text-xs font-semibold text-white shadow-sm">
                {discount}
              </span>
            )}
          </div>

          <div className="space-y-1 p-5 sm:p-6">
            <h2 className="text-xl font-bold leading-snug tracking-tight text-gray-900">
              {name}
            </h2>
            {item?.product_title_beng && (
              <p className="text-sm text-gray-500">{item.product_title_beng}</p>
            )}
            {item?.pack_size && (
              <p className="text-sm text-gray-500">{item.pack_size}</p>
            )}

            <div className="flex flex-wrap items-baseline gap-2 pt-3">
              <span className="text-2xl font-bold tabular-nums text-gray-900">
                {formatTaka(item?.sale_price)}
              </span>
              {hasMrp && (
                <span className="text-sm tabular-nums text-gray-400 line-through">
                  {formatTaka(item?.max_retail_price)}
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 border-t border-gray-200 bg-white px-5 py-4 sm:px-6">
          {currentQuantity === 0 ? (
            <PrimaryButton onClick={handleAddToCart}>
              <HiOutlineShoppingBag className="text-lg" />
              Add to cart
              <span className="tabular-nums opacity-80">
                · {formatTaka(item?.sale_price)}
              </span>
            </PrimaryButton>
          ) : (
            <>
              <DishCartControl
                variant="inline"
                name={name}
                quantity={currentQuantity}
                onIncrement={(e) => handleIncrement(e, item._id)}
                onDecrement={(e) => handleDecrement(e, item._id)}
              />
              <div className="ml-auto text-right">
                <p className="text-xs text-gray-500">In your cart</p>
                <p className="text-base font-semibold tabular-nums text-gray-900">
                  {formatTaka((item?.sale_price || 0) * currentQuantity)}
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    </CommonModal>
  );
};

export default FoodItemDetailsModal;
