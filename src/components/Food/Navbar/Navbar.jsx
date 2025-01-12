"use client";

import React from "react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { CgProfile } from "react-icons/cg";
import Image from "next/image";
import { handleUserReducer } from "@/redux/userReducer";
import { toast } from "react-toastify";
import MobileCategoryDrawer from "../MobileCategoryDrawer/MobileCategoryDrawer";
import { BiLogOut } from "react-icons/bi";
import { BsCartCheck } from "react-icons/bs";
import { useParams, useRouter } from "next/navigation";
import LocationModal from "@/components/shared/LocationModal/LocationModal";
import LoginButton from "@/components/shared/NavbarLogin/LoginButton";

const Navbar = () => {
  const [dropDownState, setDropDownState] = useState(false);
  const dropDownMenuRef = useRef();
  const dispatch = useDispatch();

  const router = useRouter();
  const params = useParams();

  const userInfo = useSelector((state) => state.user.userInfo);
  const currentModule = useSelector((state) => state.dashboard.currentModule);
  const module = currentModule.toLowerCase();

  const handleLogout = () => {
    dispatch(handleUserReducer({ type: "LOGOUT_USER", data: {} }));
    toast.success("User logged out successfully");
  };

  const handleLogoClick = () => {
    const basePath = `/${module}/store/${params?.store}`;
    const currentPath = window.location.pathname;
    if (currentPath.startsWith(basePath) && currentPath !== basePath) {
      router.push(basePath);
    } else {
      router.push("/");
    }
  };

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
    <nav className="flex items-center justify-between px-2 lg:px-10 py-4 fixed w-full bg-white z-20 border">
      <MobileCategoryDrawer />

      <button onClick={handleLogoClick} className="focus:outline-none">
        <Image
          width={500}
          height={500}
          src="/png/notension-logo.png"
          alt="notension"
          className="object-cover w-32 lg:w-56 lg:h-10"
        />
      </button>

      <LocationModal />

      {!userInfo?._id && (
        <>
          <LoginButton />
        </>
      )}

      {userInfo._id && (
        <ul className="hidden md:flex items-center justify-between gap-4 text-slate-900 lg:gap-6">
          <li className="relative" ref={dropDownMenuRef}>
            <button
              onClick={() => setDropDownState(!dropDownState)}
              className="relative flex items-center gap-1 py-2 hover:underline text-secondary"
            >
              <p className="font-semibold flex items-center gap-2">
                <CgProfile className="text-2xl" />
                <span className="hidden md:block">
                  {userInfo.customer_name}
                </span>
              </p>
              <svg
                className={`${
                  dropDownState ? "" : "rotate-180"
                } hidden md:block`}
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="m18 15-6-6-6 6" />
              </svg>
            </button>
            {dropDownState && (
              <ul className="absolute right-0 top-10 z-10 space-y-2 rounded-lg bg-gray-50 p-2 w-48 text-deepGray">
                <li className="px-3 hover:underline">
                  <Link
                    href="/food/store/orders"
                    className="flex items-center gap-1"
                  >
                    <span>
                      <BsCartCheck className="text-primaryFood" />
                    </span>
                    My Orders
                  </Link>
                </li>
                <li className="px-3 hover:underline">
                  <Link href="#" className="flex items-center gap-1">
                    <span>
                      <CgProfile className="text-primaryFood" />
                    </span>
                    <span>Profile</span>
                  </Link>
                </li>

                <li className="px-3 hover:underline">
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-1"
                  >
                    <span>
                      <BiLogOut className="text-primaryFood" />
                    </span>
                    Logout
                  </button>
                </li>
              </ul>
            )}
          </li>
        </ul>
      )}
    </nav>
  );
};

export default Navbar;
