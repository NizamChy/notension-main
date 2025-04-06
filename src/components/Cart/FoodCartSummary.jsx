"use client";

import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { TbCurrencyTaka } from "react-icons/tb";
import { useOrderFood } from "@/hooks/place-order/useOrderFood";

const FoodCartSummary = () => {
  const { shippingCharge, discount, grandTotal, getGrandTotalFood } =
    useOrderFood();

  const { totalAmountFood } = useSelector((state) => state.cart);

  useEffect(() => {
    getGrandTotalFood();
  }, [totalAmountFood]);

  return (
    <>
      <p className="flex justify-between">
        <span className="font-semibold">Delivery Charge</span>
        <span className="font-semibold flex items-center">
          <span>
            <TbCurrencyTaka />
          </span>
          {shippingCharge?.toFixed(2) || 0}
        </span>
      </p>

      {discount > 0 && (
        <p className="flex justify-between">
          <span className="font-semibold">Less</span>
          <span className="font-semibold flex items-center">
            <span>
              <TbCurrencyTaka />
            </span>
            {discount?.toFixed(2) || 0}
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

export default FoodCartSummary;
