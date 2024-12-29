"use client";

import React from "react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { CgProfile } from "react-icons/cg";
import Image from "next/image";

import MobileCategoryDrawer from "../MobileCategoryDrawer/MobileCategoryDrawer";
import { handleUserReducer } from "@/redux/userReducer";
import { toast } from "react-toastify";
import SearchBar from "../SearchBarSection/SerchBar";
import { useParams } from "next/navigation";

const Navbar = () => {
  const [dropDownState, setDropDownState] = useState(false);

  const params = useParams();

  const currentModule = useSelector((state) => state.dashboard.currentModule);

  const module = currentModule.toLowerCase();

  const dropDownMenuRef = useRef();
  const dispatch = useDispatch();

  const userInfo = useSelector((state) => state.user.userInfo);

  const handleLogout = () => {
    dispatch(handleUserReducer({ type: "LOGOUT_USER", data: {} }));
    toast.success("User logged out successfully");
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
    <nav className="flex items-center justify-between px-2 lg:px-10 py-4 fixed w-full bg-white z-10 border">
      <MobileCategoryDrawer />

      <Link href={`/${module}/${params?.store}`} className="hidden lg:block">
        <Image
          width={500}
          height={500}
          src="/png/notension-logo.png"
          alt="notension"
          className="object-cover w-32 lg:w-56 lg:h-10"
        />
      </Link>

      <div className="mx-auto px-2 w-full md:w-2/3 lg:w-1/3">
        <SearchBar />
      </div>

      {userInfo._id && (
        <ul className="hidden lg:flex items-center justify-between gap-4 text-slate-900 lg:gap-6">
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
              <ul className="absolute right-0 top-10 z-10 space-y-2 rounded-lg bg-gray-50 p-2 w-48">
                <li className="px-3 hover:underline">
                  <Link href={`/medicine/${params?.store}/orders`}>
                    My Orders
                  </Link>
                </li>
                <li className="px-3 hover:underline">
                  <Link href="#">Profile</Link>
                </li>

                <li className="px-3 hover:underline">
                  <button onClick={handleLogout}>Logout</button>
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
