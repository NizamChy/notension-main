"use client";

import Image from "next/image";
import CartContent from "./CartContent";
import { useSelector } from "react-redux";
import { TbCurrencyTaka } from "react-icons/tb";
import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import CommonModal from "../shared/CommonModal/CommonModal";
import LoginModalDetails from "../LoginSection/LoginModalDetails";

const Cart = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const params = useParams();
  const router = useRouter();

  const userInfo = useSelector((state) => state.user.userInfo);

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

  const cartCount =
    {
      food: foodItems?.length,
      grocery: groceryItems?.length,
      medicine: medicineItems?.length,
    }[moduleName] || 0;
  const cartTotal = (
    Number(
      {
        food: totalAmountFood,
        grocery: totalAmountGrocery,
        medicine: totalAmountMedicine,
      }[moduleName],
    ) || 0
  ).toFixed(2);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const toggleDrawer = () => setIsOpen(!isOpen);

  const handleCheckout = () => {
    if (userInfo?._id) {
      toggleDrawer();

      if (moduleName === "food") {
        router.push(
          `/${moduleName}/store/${params?.store}/${params?.storeId}/${params?.customStoreId}/checkout`
        );
      } else if (moduleName === "grocery") {
        router.push(
          `/grocery/${params?.store}/${params?.storeId}/${params?.customStoreId}/checkout`
        );
      } else {
        router.push(
          `/medicine/${params?.store}/${params?.storeId}/${params?.customStoreId}/checkout`
        );
      }
    } else {
      toggleDrawer();
      openModal();
    }
  };

  const getPrimaryClass = () => {
    if (moduleName === "medicine") return "bg-primaryMedicine";
    if (moduleName === "grocery") return "bg-primaryGrocery";
    if (moduleName === "food") return "bg-primaryFood";
    return "bg-primary";
  };

  const getSecondaryClass = () => {
    if (moduleName === "medicine") return "bg-secondaryMedicine";
    if (moduleName === "grocery") return "bg-secondaryGrocery";
    if (moduleName === "food") return "bg-secondaryFood";
    return "bg-secondary";
  };

  useEffect(() => {
    if (isOpen) {
      document.body.classList.add("no-scroll");
    } else {
      document.body.classList.remove("no-scroll");
    }

    return () => {
      document.body.classList.remove("no-scroll");
    };
  }, [isOpen]);

  return (
    <>
      {/* Floating cart: a slim tab on the right edge on lg+ (store pages keep a
          right gutter for it, so it never covers content), and a compact pill in
          the bottom-right corner on smaller screens. */}
      <button
        onClick={toggleDrawer}
        aria-label="Open cart"
        className={`fixed z-40 bottom-4 right-4 lg:bottom-auto lg:right-0 lg:top-1/2 lg:-translate-y-1/2 w-auto lg:w-[72px] flex lg:flex-col items-center overflow-hidden ${getPrimaryClass()} text-white rounded-full lg:rounded-none lg:rounded-s-xl shadow-lg`}
      >
        <span className="flex items-center gap-1.5 lg:flex-col lg:gap-0.5 ps-3 pe-2 py-2 lg:px-1 lg:pt-2.5 lg:pb-1.5 text-xs lg:text-[13px] font-medium whitespace-nowrap">
          <Image
            src="/svg/minicart-icon.svg"
            alt=""
            width={22}
            height={13}
          />
          <span>{cartCount} items</span>
        </span>

        <span
          className={`flex items-center justify-center self-stretch ${getSecondaryClass()} text-xs lg:text-[13px] font-semibold px-3 lg:px-1 py-2 lg:py-1 whitespace-nowrap`}
        >
          <TbCurrencyTaka className="shrink-0" />
          {cartTotal}
        </span>
      </button>

      <div
        className={`fixed z-50 top-0 right-0 w-[90%] md:w-96 h-full bg-white shadow-xl transform transition-transform duration-300 ease-in-out flex flex-col ${
          isOpen ? "translate-x-0 no-scrollbar" : "translate-x-full"
        }`}
      >
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-base md:text-xl font-bold">
            Cart
            {moduleName === "food" && <span> ({foodItems?.length}) </span>}
            {moduleName === "grocery" && <span> ({groceryItems?.length}) </span>}
            {moduleName === "medicine" && <span> ({medicineItems?.length}) </span>}
          </h2>
          <button
            onClick={toggleDrawer}
            className="text-2xl text-gray-600 hover:text-gray-800"
          >
            &times;
          </button>
        </div>

        <CartContent
          handleCheckout={handleCheckout}
          getPrimaryClass={getPrimaryClass}
          getSecondaryClass={getSecondaryClass}
        />
      </div>

      {isOpen && (
        <div
          onClick={toggleDrawer}
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
        ></div>
      )}

      <CommonModal isOpen={isModalOpen} onClose={closeModal}>
        <LoginModalDetails onClose={closeModal} type="cart" />
      </CommonModal>
    </>
  );
};

export default Cart;
