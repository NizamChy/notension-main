"use client";

import React from "react";
import EmptyCart from "./EmptyCart";
import { useSelector } from "react-redux";
import FoodCartItems from "./FoodCartItems";
import FoodCartSummary from "./FoodCartSummary";
import { TbCurrencyTaka } from "react-icons/tb";
import GroceryCartItems from "./GroceryCartItems";
import MedicineCartItems from "./MedicineCartItems";
import GroceryCartSummary from "./GroceryCartSummary";
import MedicineCartSummary from "./MedicineCartSummary";

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
  const moduleName = currentModule?.toLowerCase();

  return (
    <>
      <div className="p-4 flex-grow overflow-y-scroll no-scrollbar">
        <EmptyCart />

        {moduleName === "food" && <FoodCartItems />}
        {moduleName === "grocery" && <GroceryCartItems />}
        {moduleName === "medicine" && <MedicineCartItems />}
      </div>

      <div className="p-4 border-t">
        <div className="flex justify-between">
          <span className="font-semibold">Subtotal</span>
          <span className="font-semibold flex items-center">
            <TbCurrencyTaka />
            {moduleName === "food" && (
              <span>{totalAmountFood?.toFixed(2) || 0}</span>
            )}
            {moduleName === "grocery" && (
              <span>{totalAmountGrocery?.toFixed(2) || 0}</span>
            )}
            {moduleName === "medicine" && (
              <span>{totalAmountMedicine?.toFixed(2) || 0}</span>
            )}
          </span>
        </div>

        <div className="mb-4">
          {moduleName === "grocery" && groceryItems?.length > 0 && (
            <GroceryCartSummary />
          )}

          {moduleName === "medicine" && medicineItems?.length > 0 && (
            <MedicineCartSummary />
          )}

          {moduleName === "food" && foodItems?.length > 0 && <FoodCartSummary />}
        </div>

        <button
          onClick={handleCheckout}
          disabled={
            (moduleName === "food" && foodItems?.length == 0) ||
            (moduleName === "grocery" && groceryItems?.length == 0) ||
            (moduleName === "medicine" && medicineItems?.length == 0)
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
