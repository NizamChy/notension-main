"use client";

import EmptyCart from "./EmptyCart";
import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import FoodCartItems from "./FoodCartItems";
import { TbCurrencyTaka } from "react-icons/tb";
import GroceryCartItems from "./GroceryCartItems";
import MedicineCartItems from "./MedicineCartItems";
import { useOrderGrocery } from "@/hooks/place-order/useOrderGrocery";

const CartContent = ({
  handleCheckout,
  getPrimaryClass,
  getSecondaryClass,
}) => {
  const {
    foodItems,
    groceryItems,
    medicineItems,
    totalAmountFood,
    totalAmountGrocery,
    totalAmountMedicine,
  } = useSelector((state) => state.cart);

  const currentModule = useSelector((state) => state.dashboard.currentModule);
  const module = currentModule?.toLowerCase();

  const { shippingCharge, discount, grandTotal, getGrandTotalGrocery } =
    useOrderGrocery();

  useEffect(() => {
    getGrandTotalGrocery();
  }, [totalAmountGrocery]);

  return (
    <>
      <div className="p-4 flex-grow overflow-y-scroll no-scrollbar">
        <EmptyCart />

        {module === "food" && <FoodCartItems />}
        {module === "grocery" && <GroceryCartItems />}
        {module === "medicine" && <MedicineCartItems />}
      </div>

      <div className="p-4 border-t">
        <div className="flex justify-between">
          <span className="font-semibold">Subtotal</span>
          <span className="font-semibold flex items-center">
            <TbCurrencyTaka />
            {module === "food" && (
              <span>{totalAmountFood?.toFixed(2) || 0}</span>
            )}
            {module === "grocery" && (
              <span>{totalAmountGrocery?.toFixed(2) || 0}</span>
            )}
            {module === "medicine" && (
              <span>{totalAmountMedicine?.toFixed(2) || 0}</span>
            )}
          </span>
        </div>

        <div className="mb-4">
          {module === "grocery" && groceryItems?.length > 0 && (
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
              <p className="flex justify-between">
                <span className="font-semibold">Less</span>
                <span className="font-semibold flex items-center">
                  <span>
                    <TbCurrencyTaka />
                  </span>
                  {discount?.toFixed(2) || 0}
                </span>
              </p>
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
          )}
        </div>

        <button
          onClick={handleCheckout}
          disabled={
            (module === "food" && foodItems?.length == 0) ||
            (module === "grocery" && groceryItems?.length == 0) ||
            (module === "medicine" && medicineItems?.length == 0)
          }
          className={`w-full disabled:bg-gray-300 hover:${getSecondaryClass()} focus:outline-none transition-colors duration-200 text-white py-2 rounded-lg ${getPrimaryClass()}`}
        >
          Checkout
        </button>
      </div>
    </>
  );
};

export default CartContent;
