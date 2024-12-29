"use client";

import React, { useEffect, useState } from "react";
import { TbCurrencyTaka } from "react-icons/tb";
import Image from "next/image";
import { useSelector } from "react-redux";
import LoginModalDetails from "./LoginModalDetails";
import CartContent from "./CartContent";
import { useParams, useRouter } from "next/navigation";
import CommonModal from "../shared/CommonModal/CommonModal";

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

  const module = currentModule.toLowerCase();

  console.log("currentModule : ", currentModule);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const toggleDrawer = () => setIsOpen(!isOpen);

  const handleCheckout = () => {
    if (userInfo._id) {
      toggleDrawer();

      if (module == "food") {
        router.push(`/${module}/store/checkout`);
      } else {
        router.push(`/${module}/${params?.store}/checkout`);
      }
    } else {
      toggleDrawer();
      openModal();
    }
  };

  const getPrimaryClass = () => {
    if (module === "medicine") return "bg-primaryMedicine";
    if (module === "grocery") return "bg-primaryGrocery";
    if (module === "food") return "bg-primaryFood";
    return "bg-primary";
  };

  const getSecondaryClass = () => {
    if (module === "medicine") return "bg-secondaryMedicine";
    if (module === "grocery") return "bg-secondaryGrocery";
    if (module === "food") return "bg-secondaryFood";
    return "bg-secondary";
  };

  const foodStoreInfo = useSelector((state) => state.cart.foodStoreInfo);

  const { visitedFoodStore, visitedGroceryStore, visitedMedicineStore } =
    useSelector((state) => state.dashboard);

  console.log("visitedFoodStore", visitedFoodStore);
  console.log("foodStoreInfo", foodStoreInfo);
  console.log("foodItems", foodItems);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <>
      <button
        onClick={toggleDrawer}
        className={`fixed z-10 lg:z-50 top-1/2 right-0 ${getPrimaryClass()} text-white rounded-s-xl shadow-lg`}
      >
        <div className="px-3 pt-3 pb-0.5">
          <span className="flex justify-center">
            <Image
              src="/svg/minicart-icon.svg"
              alt="minicart-icon"
              width={22}
              height={13}
            />
          </span>
          <p className="flex items-center gap-1 pb-0.5">
            {module === "food" && <span> {foodItems?.length || 0} items </span>}
            {module === "grocery" && (
              <span> {groceryItems?.length || 0} items </span>
            )}
            {module === "medicine" && (
              <span> {medicineItems?.length || 0} items </span>
            )}
          </p>
        </div>

        <p
          className={`font-medium flex items-center ${getSecondaryClass()} text-white rounded-bl-xl px-2 py-0.5`}
        >
          <TbCurrencyTaka />

          {module === "food" && <span>{totalAmountFood?.toFixed(2) || 0}</span>}
          {module === "grocery" && (
            <span>{totalAmountGrocery?.toFixed(2) || 0}</span>
          )}
          {module === "medicine" && (
            <span>{totalAmountMedicine?.toFixed(2) || 0}</span>
          )}
        </p>
      </button>

      <div
        className={`fixed z-50 top-0 right-0 w-[90%] md:w-96 h-full bg-white shadow-xl transform transition-transform duration-300 ease-in-out flex flex-col ${
          isOpen ? "translate-x-0 no-scrollbar" : "translate-x-full"
        }`}
      >
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-bold">
            Cart
            {module === "food" && <span> ({foodItems?.length}) </span>}
            {module === "grocery" && <span> ({groceryItems?.length}) </span>}
            {module === "medicine" && <span> ({medicineItems?.length}) </span>}
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
