"use client";

import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { TbCurrencyTaka } from "react-icons/tb";
import { useOrderMedicine } from "@/hooks/place-order/useOrderMedicine";

const MedicineCartSummary = () => {
  const { shippingCharge, discount, grandTotal, getGrandTotalMedicine } =
    useOrderMedicine();

  const { totalAmountMedicine } = useSelector((state) => state.cart);

  useEffect(() => {
    getGrandTotalMedicine();
  }, [totalAmountMedicine]);

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

export default MedicineCartSummary;
