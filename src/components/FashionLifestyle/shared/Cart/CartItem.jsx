"use client";

import React from "react";
import { lineTotal } from "@/utils/price";
import Image from "next/image";
import toast from "react-hot-toast";
import { RxCross2 } from "react-icons/rx";
import { useCart } from "../../context/CartContext";
import { FASHION_IMAGE_URL } from "@/api-endpoints/env";

const CartItem = () => {
  const { cartItems, removeFromCart, updateQuantity } = useCart();

  const handleRemoveItem = (productId, selectedSize, selectedImage) => {
    removeFromCart(productId, selectedSize, selectedImage);

    toast.dismiss();
    toast.success("Item removed from cart");
  };

  const handleQuantityChange = (
    productId,
    newQuantity,
    selectedSize,
    selectedImage
  ) => {
    updateQuantity(productId, newQuantity, selectedSize, selectedImage);
  };

  return (
    <div className="space-y-2 pb-4">
      {cartItems?.map((item) => (
        <div
          key={`${item?._id?.toString()}-${item?.selectedSize}-${
            item?.selectedImage
          }`}
          className="border border-gray-200 p-3 rounded-xl"
        >
          <div className="flex gap-3 relative">
            <Image
              className="w-20 h-20 shrink-0 rounded-lg object-cover bg-gray-50"
              src={
                item.web_image
                  ? `${FASHION_IMAGE_URL}/${item?.web_image}`
                  : "/png/dummyImage.png"
              }
              alt={item?.product_title_eng}
              width={100}
              height={100}
            />
            <div className="min-w-0 flex-1">
              <p className="pe-7 line-clamp-2 text-sm font-semibold text-gray-900">
                {item?.product_title_eng}
              </p>

              {item?.selectedSize && (
                <p className="mt-0.5 text-xs text-gray-500">
                  Size: {item?.selectedSize}
                </p>
              )}

              {/* Unit price x quantity, then the line total. */}
              <p className="mt-1 text-xs text-gray-500 tabular-nums">
                ৳{item?.sale_price} × {item?.quantity}
              </p>
              <p className="text-sm font-semibold text-primary tabular-nums">
                ৳{lineTotal(item).toFixed(2)}
              </p>

              <div className="mt-2 inline-flex items-center rounded-md border border-gray-200 overflow-hidden text-sm">
                <button
                  type="button"
                  aria-label="Decrease quantity"
                  onClick={() =>
                    handleQuantityChange(
                      item?._id,
                      item?.quantity - 1,
                      item?.selectedSize,
                      item?.selectedImage
                    )
                  }
                  className="h-7 w-7 flex items-center justify-center font-semibold text-gray-700 hover:bg-gray-100"
                >
                  −
                </button>
                <span className="h-7 min-w-8 px-1 flex items-center justify-center border-x border-gray-200 font-medium">
                  {item?.quantity}
                </span>
                <button
                  type="button"
                  aria-label="Increase quantity"
                  onClick={() =>
                    handleQuantityChange(
                      item?._id,
                      item?.quantity + 1,
                      item?.selectedSize,
                      item?.selectedImage
                    )
                  }
                  className="h-7 w-7 flex items-center justify-center font-semibold text-gray-700 hover:bg-gray-100"
                >
                  +
                </button>
              </div>
            </div>

            <button
              type="button"
              aria-label="Remove from cart"
              className="absolute top-0 right-0 p-1 rounded-md text-gray-400 hover:text-red-500 hover:bg-red-50"
              onClick={() =>
                handleRemoveItem(
                  item?._id,
                  item?.selectedSize,
                  item?.selectedImage
                )
              }
            >
              <RxCross2 />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CartItem;
