"use client";

import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { CART_MODULES } from "./cartModules";
import { PriceRow, formatTaka } from "../shared/CartUI/CartUI";

// Subtotal, delivery, discount and total for the cart drawer.
// Render with key={moduleName} (see CartItems).
const CartSummary = ({ moduleName }) => {
  const { totalKey, useOrder } = CART_MODULES[moduleName];
  const { shippingCharge, discount, grandTotal, getGrandTotal } = useOrder();

  const total = useSelector((state) => state.cart[totalKey]);

  useEffect(() => {
    getGrandTotal();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [total]);

  return (
    <div className="space-y-2">
      <PriceRow label="Subtotal" value={formatTaka(total)} />
      <PriceRow label="Delivery charge" value={formatTaka(shippingCharge)} />
      {discount > 0 && (
        <PriceRow label="Discount" value={`− ${formatTaka(discount)}`} />
      )}
      <PriceRow label="Total" value={formatTaka(grandTotal)} strong />
    </div>
  );
};

export default CartSummary;
