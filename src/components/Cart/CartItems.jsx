"use client";

import React from "react";
import { useSelector } from "react-redux";
import { lineTotal } from "@/utils/price";
import { CART_MODULES } from "./cartModules";
import { CartLine } from "../shared/CartUI/CartUI";

// Render with key={moduleName} so the per-module hooks never change between
// renders of the same instance.
const CartItems = ({ moduleName }) => {
  const { itemsKey, imageBaseUrl, titleField, useItems } =
    CART_MODULES[moduleName];
  const { incrementQty, decrementQty, removeFromCart } = useItems();

  const items = useSelector((state) => state.cart[itemsKey]);

  return (
    <ul className="divide-y divide-gray-100">
      {items?.map((item) => (
        <CartLine
          key={item?._id}
          image={item?.app_image ? `${imageBaseUrl}/${item.app_image}` : null}
          title={item?.[titleField]}
          unitPrice={item?.sale_price}
          quantity={item?.quantity}
          lineTotal={lineTotal(item)}
          onDecrement={() => decrementQty(item?._id)}
          onIncrement={() => incrementQty(item?._id)}
          onRemove={() => removeFromCart(item?._id)}
        />
      ))}
    </ul>
  );
};

export default CartItems;
