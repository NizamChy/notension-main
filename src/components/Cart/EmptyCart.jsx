"use client";
import Image from "next/image";
import React from "react";
import { useSelector } from "react-redux";

const EmptyCart = () => {
  const groceryItems = useSelector((state) => state.cart.groceryItems);

  return (
    <>
      {groceryItems?.length == 0 && (
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
      )}
    </>
  );
};

export default EmptyCart;
