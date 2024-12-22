"use client";

import Image from "next/image";
import React, { useEffect, useState } from "react";
import { RiArrowRightSLine } from "react-icons/ri";
import { useDispatch, useSelector } from "react-redux";
import { MdPlayArrow } from "react-icons/md";
import { useParams, useRouter } from "next/navigation";
import { handleUserReducer } from "@/redux/userReducer";
import { toast } from "react-toastify";
import { CgProfile } from "react-icons/cg";
import { TbLogout } from "react-icons/tb";
import Link from "next/link";
import { TiShoppingCart } from "react-icons/ti";

const DrawerContent = ({ toggleDrawer, openModal }) => {
  const [isOpen, setIsOpen] = useState(null);
  const [activeSubtype, setActiveSubtype] = useState("");

  const dispatch = useDispatch();

  const params = useParams();

  const userInfo = useSelector((state) => state.user.userInfo);

  console.log(userInfo);

  const router = useRouter();

  const typeInfo = useSelector((state) => state.dashboard.typeInfo);

  const handleToggle = (index, data) => {
    setIsOpen((prev) => (prev === index ? null : index));
    router.push(`/grocery/${params?.store}/type/${data.id}`);
  };

  const handleSubtype = (subTypeId) => {
    toggleDrawer();
    router.push(`/grocery/${params?.store}/sub-type/${subTypeId}`);
    setActiveSubtype(subTypeId);
  };

  const handleCustomtype = (customTypeId) => {
    toggleDrawer();
    router.push(`/grocery/${params?.store}/custom-type/${customTypeId}`);
  };

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
                href="/orders"
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

        <div className="h-full border-e px-4 max-w-screen-md pb-5 bg-white">
          <div className="overflow-y-auto h-full no-scrollbar">
            {typeInfo?.map((data, idx) => (
              <div className="border-b border-gray-400/10" key={data.id}>
                {data.parent === null && (
                  <div
                    onClick={() => {
                      if (data?.subtype?.length > 0) {
                        handleToggle(idx, data);
                      } else {
                        handleToggle(idx, data);
                        handleCustomtype(data.id);
                      }
                    }}
                    className={`transition-all duration-300 cursor-pointer px-2 ${
                      isOpen === idx
                        ? "bg-blue-300 text-blue-700"
                        : "text-deepGray"
                    } ${
                      idx === typeInfo.length - 1
                        ? "border-none"
                        : "border-b border-gray-100/10"
                    } py-2 flex items-center gap-4`}
                  >
                    <div>
                      <Image
                        width={500}
                        height={500}
                        src="/png/dummyImage.png"
                        alt="medicine"
                        className="w-8 h-8 object-contain rounded"
                      />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm hover:text-blue-500">{data.name}</p>
                    </div>
                    {data?.subtype?.length > 0 && (
                      <div
                        className={`duration-300 ease-in-out ${
                          isOpen === idx ? "rotate-90 " : ""
                        }`}
                      >
                        <RiArrowRightSLine size={20} />
                      </div>
                    )}
                  </div>
                )}
                <div
                  className={`grid overflow-hidden transition-all duration-300 ease-in-out text-slate-600 ${
                    isOpen === idx
                      ? "grid-rows-[1fr] opacity-100"
                      : "grid-rows-[0fr] opacity-0"
                  }`}
                >
                  <div className="overflow-hidden ps-4">
                    {data?.subtype?.map((sub, idx) => (
                      <div
                        onClick={() => handleSubtype(sub?.subtypeInfo?._id)}
                        key={sub._id}
                      >
                        <div
                          className={`cursor-pointer ${
                            idx === data.subtype.length - 1
                              ? "border-none"
                              : "border-b border-gray-400/10"
                          } py-4 flex items-center justify-between gap-4 ml-6`}
                        >
                          <div>
                            <MdPlayArrow
                              className={`text-sm ${
                                sub?.subtypeInfo?._id === activeSubtype
                                  ? "text-blue-500"
                                  : "text-deepGray"
                              } hover:text-blue-500`}
                            />

                            {/* <Image
                          width={500}
                          height={500}
                          src="/png/medicine.png"
                          alt="medicine"
                          className="w-8 h-8 object-contain"
                        /> */}
                          </div>
                          <div className="flex-1">
                            <p
                              className={`text-sm ${
                                sub?.subtypeInfo?._id === activeSubtype
                                  ? "text-blue-500"
                                  : "text-deepGray"
                              } hover:text-blue-500`}
                            >
                              {sub.sub_type_name}
                            </p>
                          </div>
                          {sub?.subtype?.length > 0 && (
                            <>
                              <RiArrowRightSLine size={20} />
                            </>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default DrawerContent;
