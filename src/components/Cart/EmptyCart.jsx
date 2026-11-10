"use client";

import React from "react";
import Image from "next/image";
import { useSelector } from "react-redux";

const EmptyCart = () => {
  const { foodItems, groceryItems, medicineItems } = useSelector(
    (state) => state.cart
  );

  const currentModule = useSelector((state) => state.dashboard.currentModule);
  const moduleName = currentModule.toLowerCase();

  const isCartEmpty =
    (moduleName === "food" && foodItems?.length === 0) ||
    (moduleName === "grocery" && groceryItems?.length === 0) ||
    (moduleName === "medicine" && medicineItems?.length === 0);

  if (!isCartEmpty) {
    return null;
  }

  return (
    <div className="flex flex-col justify-center items-center h-full">
      <Image
        src="/png/empty-cart.png"
        alt="empty-cart"
        width={300}
        height={300}
      />

      <p className="text-center font-medium text-sm text-gray-700">
        Looks like Your cart is empty. <br /> Start shopping.
      </p>
    </div>
  );
};

export default EmptyCart;
