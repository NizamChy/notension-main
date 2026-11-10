"use client";

import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { TbCurrencyTaka } from "react-icons/tb";
import { CART_MODULES } from "./cartModules";

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
    <>
      <p className="flex justify-between">
        <span className="font-semibold">Delivery Charge</span>
        <span className="font-semibold flex items-center">
          <span>
            <TbCurrencyTaka />
          </span>
          {shippingCharge || 0}
        </span>
      </p>

      {discount > 0 && (
        <p className="flex justify-between">
          <span className="font-semibold">Discount</span>
          <span className="font-semibold flex items-center">
            <span>
              <TbCurrencyTaka />
            </span>
            {discount || 0}
          </span>
        </p>
      )}

      <p className="flex justify-between">
        <span className="font-semibold">Total Amount</span>
        <span className="font-semibold flex items-center">
          <span>
            <TbCurrencyTaka />
          </span>

          {grandTotal || 0}
        </span>
      </p>
    </>
  );
};

export default CartSummary;
