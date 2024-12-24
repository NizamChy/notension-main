"use client";
import React from "react";
import { TbCurrencyTaka } from "react-icons/tb";
import { useSelector } from "react-redux";
import EmptyCart from "./EmptyCart";
import GroceryCartItems from "./GroceryCartItems";
import MedicineCartItems from "./MedicineCartItems";

const CartContent = ({
  handleCheckout,
  getPrimaryClass,
  getSecondaryClass,
}) => {
  const {
    groceryItems,
    medicineItems,
    totalAmountGrocery,
    totalAmountMedicine,
  } = useSelector((state) => state.cart);

  const currentModule = useSelector((state) => state.dashboard.currentModule);

  const module = currentModule.toLowerCase();

  return (
    <>
      <div className="p-4 flex-grow overflow-y-scroll no-scrollbar">
        <EmptyCart />

        {module === "grocery" && <GroceryCartItems />}
        {module === "medicine" && <MedicineCartItems />}
      </div>

      <div className="p-4 border-t">
        <div className="flex justify-between mb-4">
          <span className="font-semibold">Total:</span>
          <span className="font-semibold flex items-center">
            <TbCurrencyTaka />{" "}
            {module === "grocery" && (
              <span>{totalAmountGrocery?.toFixed(2) || 0}</span>
            )}
            {module === "medicine" && (
              <span>{totalAmountMedicine?.toFixed(2) || 0}</span>
            )}
          </span>
        </div>

        <button
          onClick={handleCheckout}
          disabled={
            (module === "grocery" && groceryItems?.length == 0) ||
            (module === "medicine" && medicineItems?.length == 0)
          }
          className={`w-full disabled:bg-gray-300 hover:${getSecondaryClass()} focus:outline-none focus:ring-4 focus:ring-blue-300 transition-colors duration-200 text-white py-2 rounded-lg ${getPrimaryClass()}`}
        >
          Checkout
        </button>
      </div>
    </>
  );
};

export default CartContent;
