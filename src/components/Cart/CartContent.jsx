"use client";
import React from "react";
import { TbCurrencyTaka } from "react-icons/tb";
import { useSelector } from "react-redux";
import EmptyCart from "./EmptyCart";
import CartItems from "./CartItems";

const CartContent = ({ handleCheckout }) => {
  const cartItems = useSelector((state) => state.cart.cartItems);
  const totalPrice = useSelector((state) => state.cart.totalPrice);

  return (
    <>
      <div className="p-4 flex-grow overflow-y-scroll no-scrollbar">
        <EmptyCart />
        <CartItems />
      </div>

      <div className="p-4 border-t">
        <div className="flex justify-between mb-4">
          <span className="font-semibold">Total:</span>
          <span className="font-semibold flex items-center">
            <TbCurrencyTaka /> {totalPrice?.toFixed(2) || 0}
          </span>
        </div>

        <button
          onClick={handleCheckout}
          disabled={cartItems.length == 0}
          className="w-full disabled:bg-gray-300 bg-primary hover:bg-blue-600 focus:outline-none focus:ring-4 focus:ring-blue-300 transition-colors duration-200 text-white py-2 rounded-lg"
        >
          Checkout
        </button>
      </div>
    </>
  );
};

export default CartContent;
