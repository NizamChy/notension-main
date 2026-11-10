"use client";

import React from "react";
import EmptyCart from "./EmptyCart";
import CartItems from "./CartItems";
import CartSummary from "./CartSummary";
import { useSelector } from "react-redux";
import { CART_MODULES } from "./cartModules";
import { TbCurrencyTaka } from "react-icons/tb";
import { toNumber } from "@/utils/price";

// Stable empty list so the selector does not return a new array each call.
const NO_ITEMS = [];

const CartContent = ({
  handleCheckout,
  getPrimaryClass,
  getSecondaryClass,
}) => {
  const currentModule = useSelector((state) => state.dashboard.currentModule);
  const moduleName = currentModule?.toLowerCase();
  const config = CART_MODULES[moduleName];

  const items = useSelector((state) =>
    config ? state.cart[config.itemsKey] : NO_ITEMS
  );
  const total = useSelector((state) =>
    config ? state.cart[config.totalKey] : 0
  );

  const hasItems = items?.length > 0;

  return (
    <>
      <div className="p-4 flex-grow overflow-y-scroll no-scrollbar">
        <EmptyCart />

        {config && <CartItems key={moduleName} moduleName={moduleName} />}
      </div>

      <div className="p-4 border-t">
        <div className="flex justify-between">
          <span className="font-semibold">Subtotal</span>
          <span className="font-semibold flex items-center">
            <TbCurrencyTaka />
            {config && <span>{toNumber(total).toFixed(2)}</span>}
          </span>
        </div>

        <div className="mb-4">
          {config && hasItems && (
            <CartSummary key={moduleName} moduleName={moduleName} />
          )}
        </div>

        <button
          onClick={handleCheckout}
          disabled={!!config && !hasItems}
          className={`w-full disabled:bg-gray-300 hover:${getSecondaryClass()} focus:outline-none transition-colors duration-200 text-white py-2 rounded-lg ${getPrimaryClass()}`}
        >
          Checkout
        </button>
      </div>
    </>
  );
};

export default CartContent;
