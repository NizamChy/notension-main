import React from "react";
import Link from "next/link";
import { BiLogOut } from "react-icons/bi";
import { CgProfile } from "react-icons/cg";
import { IoLocationOutline } from "react-icons/io5";
import { BsCartCheck, BsPerson } from "react-icons/bs";

const LoginDropdown = ({
  userInfo,
  getFirstWord,
  handleLogout,
  dropDownState,
  dropDownMenuRef,
  setDropDownState,
}) => {
  return (
    <>
      {userInfo?._id && (
        <div className="flex items-center justify-between gap-4 text-slate-900 lg:gap-6">
          <div className="relative" ref={dropDownMenuRef}>
            <button
              onClick={() => setDropDownState(!dropDownState)}
              className="relative flex items-center gap-1 py-2 hover:underline text-primary"
            >
              <p className="font-semibold flex flex-col items-center">
                <BsPerson className="text-xl mb-1" />
                <span className="hidden md:block text-xs">
                  {getFirstWord(userInfo?.customer_name)}
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
              <ul className="absolute text-deepGray right-0 top-10 md:top-12 z-30 space-y-2 rounded-lg bg-gray-50 p-2 min-w-48">
                <li className="md:hidden block px-3 hover:underline">
                  <p className="flex items-center text-sm text-primary ps-1">
                    {userInfo?.customer_name}
                  </p>
                </li>
                <li className="px-3 hover:underline hover:text-blue-600">
                  <Link
                    href="/fashion_lifestyle/user/profile"
                    className="flex items-center gap-1"
                  >
                    <span>
                      <CgProfile className="text-blue-500" />
                    </span>
                    Profile
                  </Link>
                </li>

                <li className="px-3 hover:underline hover:text-blue-600">
                  <Link
                    href="/fashion_lifestyle/user/update-address"
                    className="flex items-center gap-1"
                  >
                    <span>
                      <IoLocationOutline className="text-blue-800" />
                    </span>
                    Update Address
                  </Link>
                </li>

                <li className="px-3 hover:underline hover:text-blue-600">
                  <Link
                    href="/fashion_lifestyle/orders"
                    className="flex items-center gap-1"
                  >
                    <span>
                      <BsCartCheck className="text-primary" />
                    </span>
                    My Orders
                  </Link>
                </li>

                <li className="px-3 hover:underline hover:text-blue-600">
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-1"
                  >
                    <span>
                      <BiLogOut className="text-red-500" />
                    </span>
                    Logout
                  </button>
                </li>
              </ul>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default LoginDropdown;
