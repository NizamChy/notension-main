"use client";

import React from "react";
import notify from "@/utils/notify";
import { lineTotal } from "@/utils/price";
import { useCart } from "../../context/CartContext";
import { FASHION_IMAGE_URL } from "@/api-endpoints/env";
import { CartLine } from "@/components/shared/CartUI/CartUI";
import type { FashionLine } from "@/stores/cartStore";

// A bag line keeps the product fields it was added with.
type BagLine = FashionLine & {
  web_image?: string | null;
  product_title_eng?: string | null;
  sale_price?: unknown;
};

// Product rows in the fashion cart drawer.
const CartItem = () => {
  const { cartItems: lines, removeFromCart, updateQuantity } = useCart();
  // The store types extra product fields as unknown; these lines are
  // products added from the fashion pages, which carry them.
  const cartItems = lines as BagLine[];

  const handleRemove = (item: BagLine) => {
    removeFromCart(item?._id, item?.selectedSize, item?.selectedImage);
    notify.success("Removed from cart");
  };

  const changeQuantity = (item: BagLine, quantity: number) =>
    updateQuantity(item?._id, quantity, item?.selectedSize, item?.selectedImage);

  return (
    <ul className="divide-y divide-gray-100">
      {cartItems?.map((item) => (
        <CartLine
          key={`${item?._id}-${item?.selectedSize}-${item?.selectedImage}`}
          image={
            item?.selectedImage || item?.web_image
              ? `${FASHION_IMAGE_URL}/${item.selectedImage || item.web_image}`
              : null
          }
          title={item?.product_title_eng}
          meta={
            [item?.selectedColor, item?.selectedSize && `Size: ${item.selectedSize}`]
              .filter(Boolean)
              .join(" · ") || null
          }
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
