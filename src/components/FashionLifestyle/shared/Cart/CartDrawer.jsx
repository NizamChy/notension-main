"use client";

import React from "react";
import Link from "next/link";
import { useEffect } from "react";
import CartItem from "./CartItem";
import { IoClose } from "react-icons/io5";
import { TiShoppingCart } from "react-icons/ti";
import { useCart } from "../../context/CartContext";

const CartDrawer = ({ isOpen, onClose }) => {
  const { cartItems, getCartCount, getCartTotal } = useCart();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isOpen && !event.target.closest(".cartdrawer-container")) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

  return (
    <>
      <div
        className={`fixed inset-0 bg-black/50 z-40 transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      />

      <div
        className={`cartdrawer-container fixed top-0 right-0 h-full w-[90%] lg:w-96 bg-white shadow-lg z-50 transform transition-all duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-4 border-b">
            <h2 className="text-lg font-semibold">
              Your Cart({getCartCount() || 0})
            </h2>
            <button onClick={onClose}>
              <IoClose className="text-2xl" />
            </button>
          </div>

          <div className="flex-grow p-4 overflow-y-auto">
            <div className="h-full flex flex-col">
              {cartItems?.length < 1 && (
                <p className="relative text-gray-500 h-full flex flex-col gap-1 items-center justify-center">
                  <TiShoppingCart className="text-5xl text-primary" />
                  Your cart is empty!
                </p>
              )}

              <CartItem />
            </div>
          </div>

          {cartItems.length > 0 && (
            <div className="p-4 border-t">
              <p className="text-center font-medium text-primary">
                Cart Total: ৳ {getCartTotal() || 0}
              </p>
              <div className="mt-4 text-center w-full">
                <Link href="/fashion_lifestyle/checkout">
                  <button
                    onClick={onClose}
                    disabled={cartItems?.length < 1}
                    className="w-full inline-flex justify-center items-center px-6 py-3 border border-gray-300 text-base font-medium rounded-md text-white bg-primary disabled:bg-gray-300 disabled:cursor-not-allowed hover:bg-primary/95 hover:border-gray-400 transition-colors"
                  >
                    Proceed to Checkout
                    <svg
                      className="ml-2 w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </button>
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default CartDrawer;
