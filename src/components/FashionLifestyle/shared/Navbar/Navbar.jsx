"use client";

import Link from "next/link";
import Image from "next/image";
import { BsPerson } from "react-icons/bs";
import { useSelector } from "react-redux";
import { IoSearch } from "react-icons/io5";
import LoginDropdown from "./LoginDropdown";
import CartDrawer from "../Cart/CartDrawer";
import Sidebar from "../../Sidebar/Sidebar";
import { useCart } from "../../context/CartContext";
import CommonModal from "../CommonModal/CommonModal";
import { LiaShoppingBagSolid } from "react-icons/lia";
import { useUser } from "../../hooks/fetchData/useUser";
import { IoMdClose, IoMdHeartEmpty } from "react-icons/io";
import LocationModal from "../LocationModal/LocationModal";
import React, { useEffect, useRef, useState } from "react";
import { useParams, usePathname, useRouter } from "next/navigation";
import LoginModalDetails from "@/components/LoginSection/LoginModalDetails";

const Navbar = () => {
  const [searchOpen, setSearchOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [dropDownState, setDropDownState] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const dropDownMenuRef = useRef();
  const { handleUserLogout } = useUser();

  const router = useRouter();
  const params = useParams();
  const pathname = usePathname();

  const { cartItems } = useCart();
  const userInfo = useSelector((state) => state.user.userInfo);

  let shopName = "";
  let shopFirstWord = "";
  let shopLogoWords = "";

  if (pathname.includes("shop")) {
    shopName = params?.shopSlugId?.split("_")[0];
    shopFirstWord = shopName?.split("-")[0];
    shopLogoWords = shopName?.slice(0, 2);
  }

  const handleLogoClick = () => {
    const basePath = `/fashion_lifestyle/shop/${params?.shopSlugId}`;
    const currentPath = window.location.pathname;

    if (currentPath.startsWith(basePath) && currentPath !== basePath) {
      return router.push(basePath);
    }

    if (currentPath === basePath) {
      return router.push("/fashion_lifestyle");
    }

    if (currentPath === "/fashion_lifestyle") {
      return router.push("/");
    }

    router.push("/fashion_lifestyle");
  };

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const handleLogin = () => {
    openModal();
  };

  const handleLogout = () => {
    handleUserLogout();
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  const toggleCart = () => {
    setIsCartOpen(!isCartOpen);
  };

  function getFirstWord(str) {
    if (typeof str !== "string" || str.trim() === "") {
      return "";
    }
    const words = str.trim().split(" ");
    return words[0];
  }

  useEffect(() => {
    const closeDropDown = (e) => {
      if (
        dropDownMenuRef.current &&
        !dropDownMenuRef.current.contains(e.target)
      ) {
        setDropDownState(false);
      }
    };
    document.addEventListener("mousedown", closeDropDown);
    return () => {
      document.removeEventListener("mousedown", closeDropDown);
    };
  }, []);

  return (
    <>
      <div className="min-h-16">
        <div className="fixed z-30 bg-white w-full">
          {/* Main Navbar */}
          <nav className="min-h-16 flex border-b justify-between items-center px-4 lg:px-8 relative">
            <button
              onClick={toggleSidebar}
              className="lg:hidden p-2 rounded-md hover:bg-gray-100"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>

            {pathname?.includes("shop") ? (
              <button onClick={handleLogoClick}>
                <p className="text-4xl capitalize font-bold italic text-primary">
                  {shopFirstWord}
                </p>
              </button>
            ) : (
              <button onClick={handleLogoClick}>
                <div className="w-32 lg:w-56 lg:h-10 mx-auto lg:mx-0">
                  <Image
                    width={224}
                    height={40}
                    src="/png/notension-logo.png"
                    alt="notension"
                    className="object-contain w-full"
                  />
                </div>
              </button>
            )}

            {/* Desktop Search */}
            <div className="hidden lg:block w-96 xl:w-[500px] relative">
              <input
                type="text"
                placeholder="Search..."
                className="border bg-transparent py-2 pl-4 pr-10 outline-none w-full rounded-md text-sm"
              />
              <button className="absolute top-0 right-0 h-full px-3 flex items-center justify-center text-gray-500 hover:text-black">
                <IoSearch className="text-lg" />
              </button>
            </div>

            {/* Right Side Icons */}
            <div className="flex items-center gap-4 lg:gap-5 relative">
              <LocationModal />

              <div className="flex items-center gap-4">
                <button
                  onClick={toggleCart}
                  className="flex flex-col items-center text-sm hover:text-primary relative"
                >
                  <LiaShoppingBagSolid className="text-xl mb-1" />
                  <span className="hidden lg:block text-xs">Bag</span>
                  <span className="absolute -top-2 -right-2.5 bg-[#F1C40F] text-primary text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {cartItems.length}
                  </span>
                </button>

                <Link href="/wishlist">
                  <button className="hidden lg:flex flex-col items-center text-sm hover:text-primary">
                    <IoMdHeartEmpty className="text-xl mb-1" />
                    <span className="hidden lg:block text-xs">Wishlist</span>
                  </button>
                </Link>

                {!userInfo?._id ? (
                  <button
                    onClick={handleLogin}
                    className="hidden lg:flex flex-col items-center text-sm hover:text-primary"
                  >
                    <BsPerson className="text-xl mb-1" />
                    <span className="text-xs">Login</span>
                  </button>
                ) : (
                  <>
                    <LoginDropdown
                      userInfo={userInfo}
                      getFirstWord={getFirstWord}
                      handleLogout={handleLogout}
                      dropDownState={dropDownState}
                      dropDownMenuRef={dropDownMenuRef}
                      setDropDownState={setDropDownState}
                    />
                  </>
                )}
              </div>

              {/* Mobile Search Button */}
              <button
                className="lg:hidden p-2"
                onClick={() => setSearchOpen(!searchOpen)}
              >
                {searchOpen ? (
                  <IoMdClose className="text-xl" />
                ) : (
                  <IoSearch className="text-xl" />
                )}
              </button>
            </div>

            {/* Mobile Search Bar */}
            {searchOpen && (
              <div className="absolute top-full left-0 right-0 bg-white p-4 shadow-md lg:hidden z-10">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search products..."
                    className="border bg-transparent py-3 pl-4 pr-10 outline-none w-full rounded-md"
                  />
                  <button className="absolute top-0 right-0 h-full px-3 flex items-center justify-center text-gray-500">
                    <IoSearch className="text-xl" />
                  </button>
                </div>
              </div>
            )}
          </nav>
        </div>

        <Sidebar isOpen={isSidebarOpen} onClose={closeSidebar} />
        <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
      </div>

      <CommonModal isOpen={isModalOpen} onClose={closeModal}>
        <LoginModalDetails onClose={closeModal} type="login" />
      </CommonModal>
    </>
  );
};

export default Navbar;
