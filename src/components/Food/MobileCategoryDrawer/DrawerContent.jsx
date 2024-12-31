"use client";

import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { handleUserReducer } from "@/redux/userReducer";
import { toast } from "react-toastify";
import { CgProfile } from "react-icons/cg";
import { TbLogout } from "react-icons/tb";
import Link from "next/link";
import { TiShoppingCart } from "react-icons/ti";
import MobileCategory from "../CategorySidebar/MobileCategory";

const DrawerContent = ({ toggleDrawer, openModal }) => {
  const dispatch = useDispatch();

  const userInfo = useSelector((state) => state.user.userInfo);

  const handleLogout = () => {
    dispatch(handleUserReducer({ type: "LOGOUT_USER", data: {} }));
    toast.success("User logged out successfully");
  };

  const handleLogin = () => {
    toggleDrawer();
    openModal();
  };

  return (
    <>
      <div className="max-w-screen-md">
        {userInfo?._id ? (
          <>
            <div className="p-3 px-5">
              <div className="flex items-center gap-2">
                <CgProfile className="text-2xl text-secondary" />

                <div className="-space-y-0.5">
                  <p className="font-medium text-secondary">
                    {userInfo?.customer_name}
                  </p>
                  <p className="text-base text-deepGray">
                    {userInfo?.contact_no}
                  </p>
                </div>
              </div>

              <Link
                onClick={toggleDrawer}
                href="/food/store/orders"
                className="mt-2 flex gap-2"
              >
                <TiShoppingCart className="text-2xl text-secondary" />
                <p className="text-secondary font-medium">My Orders</p>
              </Link>

              <div className="flex items-center gap-2 mt-2 ps-1">
                <TbLogout className="text-2xl text-secondary" />

                <button
                  onClick={handleLogout}
                  className="text-secondary font-medium"
                >
                  Logout
                </button>
              </div>
            </div>
            <hr className="mb-1" />
          </>
        ) : (
          <>
            <div className="flex justify-center">
              <button
                onClick={handleLogin}
                className="mt-4 mb-2 px-4 py-2 bg-secondary text-white rounded-md"
              >
                LOGIN
              </button>
            </div>
          </>
        )}

        <div className="h-full border-e px-1 max-w-screen-md pb-5 bg-white">
          <div className="overflow-y-auto overflow-x-hidden h-full no-scrollbar">
            <MobileCategory
              gridClass="grid-cols-2"
              toggleDrawer={toggleDrawer}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default DrawerContent;
