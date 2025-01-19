"use client";

import Image from "next/image";
import DrawerContent from "./DrawerContent";
import { RxHamburgerMenu } from "react-icons/rx";
import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import LoginModalDetails from "@/components/Cart/LoginModalDetails";
import CommonModal from "@/components/shared/CommonModal/CommonModal";

const MobileCategoryDrawer = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const params = useParams();
  const router = useRouter();

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);
  const toggleDrawer = () => setIsOpen(!isOpen);

  const handleLogoClick = () => {
    const basePath = `/medicine/${params?.store}`;
    const currentPath = window.location.pathname;

    toggleDrawer();

    if (currentPath.startsWith(basePath) && currentPath !== basePath) {
      router.push(basePath);
    } else {
      router.push("/");
    }
  };

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
      <div className="lg:hidden">
        <button onClick={toggleDrawer}>
          <div className="text-2xl text-secondary">
            <RxHamburgerMenu />
          </div>
        </button>

        <div
          className={`fixed z-50 top-0 left-0 w-[80%] md:w-96 h-full bg-white shadow-xl transform transition-transform duration-300 ease-in-out flex flex-col ${
            isOpen
              ? "translate-x-0 no-scrollbar overflow-y-auto"
              : "-translate-x-full"
          }`}
        >
          <div className="flex justify-between items-center p-4 border-b">
            <Image
              onClick={handleLogoClick}
              width={128}
              height={23}
              src="/png/notension-logo.png"
              alt="notension"
              className="object-cover w-32 lg:w-56 lg:h-10"
            />

            <button
              onClick={toggleDrawer}
              className="text-2xl text-gray-600 hover:text-gray-800"
            >
              &times;
            </button>
          </div>

          <DrawerContent toggleDrawer={toggleDrawer} openModal={openModal} />
        </div>

        {isOpen && (
          <div
            onClick={toggleDrawer}
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
          ></div>
        )}
      </div>
      <CommonModal isOpen={isModalOpen} onClose={closeModal}>
        <LoginModalDetails onClose={closeModal} type="login" />
      </CommonModal>
    </>
  );
};

export default MobileCategoryDrawer;
