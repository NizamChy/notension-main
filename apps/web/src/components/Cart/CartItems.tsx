"use client";

import React from "react";
import { useCartStore, type CartLine as CartLineData, type CartModule } from "@/stores/cartStore";
import { lineTotal } from "@/utils/price";
import { CART_MODULES } from "./cartModules";
import { CartLine } from "../shared/CartUI/CartUI";

// The fields of a cart line the drawer shows (set by the module's cart hook).
type CartItem = CartLineData & {
  app_image?: string | null;
  sale_price?: number;
  product_title_eng?: string;
  item_title_eng?: string;
};

type Props = { moduleName: CartModule };

// Render with key={moduleName} so the per-module hooks never change between
// renders of the same instance.
const CartItems = ({ moduleName }: Props) => {
  const { imageBaseUrl, titleField, useItems } =
    CART_MODULES[moduleName];
  const { incrementQty, decrementQty, removeFromCart } = useItems();

  const items = useCartStore((state) => state[moduleName].items) as CartItem[];

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
