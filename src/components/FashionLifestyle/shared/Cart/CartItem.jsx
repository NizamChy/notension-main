"use client";

import React from "react";
import Image from "next/image";
import toast from "react-hot-toast";
import { RxCross2 } from "react-icons/rx";
import { useCart } from "../../context/CartContext";
import { FASHION_IMAGE_URL } from "@/api-endpoints/secret";

const CartItem = () => {
  const { cartItems, removeFromCart, updateQuantity } = useCart();

  const handleRemoveItem = (productId, selectedSize, selectedColor) => {
    removeFromCart(productId, selectedSize, selectedColor);

    toast.dismiss();
    toast.success("Item removed from cart");
  };

  const handleQuantityChange = (
    productId,
    newQuantity,
    selectedSize,
    selectedColor
  ) => {
    updateQuantity(productId, newQuantity, selectedSize, selectedColor);
  };

  return (
    <div className="space-y-2 pb-4">
      {cartItems?.map((item) => (
        <div
          key={`${item?._id?.toString()}-${item?.selectedSize}-${
            item?.selectedColor
          }`}
          className="border p-2 rounded"
        >
          <div className="flex gap-2 relative">
            <Image
              className="aspect-square rounded object-cover"
              src={
                item.web_image
                  ? `${FASHION_IMAGE_URL}/${item?.web_image}`
                  : "/images/png/dummyImage.png"
              }
              alt={item?.product_title_eng}
              width={100}
              height={100}
            />
            <div className="space-y-1">
              <p className="pe-3 line-clamp-2 text-primary font-semibold">
                {item?.product_title_eng}
              </p>

              <div className="flex gap-2 items-center">
                <p className="text-sm text-gray-700">Quantity: </p>

                <div className="flex items-center text-sm">
                  <button
                    onClick={() =>
                      handleQuantityChange(
                        item?._id,
                        item?.quantity - 1,
                        item?.selectedSize,
                        item?.selectedColor
                      )
                    }
                    className="px-2 border border-gray-300 rounded-l-md hover:bg-gray-100"
                  >
                    -
                  </button>
                  <span className="px-2 border-t border-b border-gray-300">
                    {item?.quantity}
                  </span>
                  <button
                    onClick={() =>
                      handleQuantityChange(
                        item?._id,
                        item?.quantity + 1,
                        item?.selectedSize,
                        item?.selectedColor
                      )
                    }
                    className="px-2 border border-gray-300 rounded-r-md hover:bg-gray-100"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="flex gap-2">
                {item?.selectedSize && (
                  <p className="text-xs text-gray-700">
                    Size: {item?.selectedSize}
                  </p>
                )}

                {item?.selectedColor && (
                  <p className="text-xs text-gray-700 capitalize">
                    Color: {item?.selectedColor}
                  </p>
                )}
              </div>

              <div className="flex justify-between gap-5">
                <p className="text-xs md:text-sm text-gray-700">
                  Price: ৳{item?.sale_price} X {item?.quantity}
                </p>

                <p className="text-xs md:text-sm text-gray-700">
                  ৳{item?.sale_price * item?.quantity}
                </p>
              </div>
            </div>

            <button
              className="absolute right-0 border text-gray-500 hover:text-red-500 hover:border-red-500"
              onClick={() =>
                handleRemoveItem(
                  item?._id,
                  item?.selectedSize,
                  item?.selectedColor
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
