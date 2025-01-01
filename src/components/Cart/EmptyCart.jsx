"use client";
import Image from "next/image";
import React from "react";
import { useSelector } from "react-redux";

const EmptyCart = () => {
  const { foodItems, groceryItems, medicineItems } = useSelector(
    (state) => state.cart
  );

  const currentModule = useSelector((state) => state.dashboard.currentModule);
  const module = currentModule.toLowerCase();

  const isCartEmpty =
    (module === "food" && foodItems?.length === 0) ||
    (module === "grocery" && groceryItems?.length === 0) ||
    (module === "medicine" && medicineItems?.length === 0);

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
