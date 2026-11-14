"use client";

import React from "react";
import toast from "react-hot-toast";
import { lineTotal } from "@/utils/price";
import { useCart } from "../../context/CartContext";
import { FASHION_IMAGE_URL } from "@/api-endpoints/env";
import { CartLine } from "@/components/shared/CartUI/CartUI";

// Product rows in the fashion cart drawer.
const CartItem = () => {
  const { cartItems, removeFromCart, updateQuantity } = useCart();

  const handleRemove = (item) => {
    removeFromCart(item?._id, item?.selectedSize, item?.selectedImage);
    toast.dismiss();
    toast.success("Item removed from cart");
  };

  const changeQuantity = (item, quantity) =>
    updateQuantity(item?._id, quantity, item?.selectedSize, item?.selectedImage);

  return (
    <ul className="divide-y divide-gray-100">
      {cartItems?.map((item) => (
        <CartLine
          key={`${item?._id}-${item?.selectedSize}-${item?.selectedImage}`}
          image={item?.web_image ? `${FASHION_IMAGE_URL}/${item.web_image}` : null}
          title={item?.product_title_eng}
          meta={item?.selectedSize ? `Size: ${item.selectedSize}` : null}
          unitPrice={item?.sale_price}
          quantity={item?.quantity}
          lineTotal={lineTotal(item)}
          onDecrement={() => changeQuantity(item, item?.quantity - 1)}
          onIncrement={() => changeQuantity(item, item?.quantity + 1)}
          onRemove={() => handleRemove(item)}
        />
      ))}
    </ul>
  );
};

export default CartItem;
