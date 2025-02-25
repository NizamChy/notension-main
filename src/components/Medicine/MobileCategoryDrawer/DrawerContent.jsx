"use client";

import Link from "next/link";
import Image from "next/image";
import { toast } from "react-toastify";
import React, { useState } from "react";
import { TbLogout } from "react-icons/tb";
import { CgProfile } from "react-icons/cg";
import { TiShoppingCart } from "react-icons/ti";
import { RiArrowRightSLine } from "react-icons/ri";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useRouter } from "next/navigation";
import { handleUserReducer } from "@/redux/userReducer";
import { MdFavoriteBorder, MdPlayArrow } from "react-icons/md";

const DrawerContent = ({ toggleDrawer, openModal }) => {
  const [isOpen, setIsOpen] = useState(null);
  const [activeSubtype, setActiveSubtype] = useState("");

  const params = useParams();
  const router = useRouter();
  const dispatch = useDispatch();

  const userInfo = useSelector((state) => state.user.userInfo);
  const typeInfo = useSelector((state) => state.dashboard.typeInfo);

  const handleToggle = (index, data) => {
    setIsOpen((prev) => (prev === index ? null : index));
    router.push(`/medicine/${params?.store}/type/${data?.id}`);
  };

  const handleSubtype = (subTypeId) => {
    toggleDrawer();
    router.push(`/medicine/${params?.store}/sub-type/${subTypeId}`);
    setActiveSubtype(subTypeId);
  };

  const handleCustomtype = (customTypeId) => {
    toggleDrawer();
    router.push(`/medicine/${params?.store}/custom-type/${customTypeId}`);
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
                <CgProfile className="text-lg text-secondaryMedicine" />

                <div className="-space-y-0.5">
                  <p className="font-medium text-sm text-secondaryMedicine">
                    {userInfo?.customer_name}
                  </p>
                  <p className="text-sm text-deepGray">
                    {userInfo?.contact_no}
                  </p>
                </div>
              </div>

              <Link
                onClick={toggleDrawer}
                href={`/medicine/${params?.store}/orders`}
                className="mt-2 flex gap-2"
              >
                <TiShoppingCart className="text-lg text-secondaryMedicine" />
                <p className="text-secondaryMedicine text-sm font-medium">
                  My Orders
                </p>
              </Link>

              <Link
                onClick={toggleDrawer}
                href={`/medicine/${params?.store}/favorite-items`}
                className="mt-2 flex gap-2"
              >
                <MdFavoriteBorder className="text-lg text-secondaryMedicine" />
                <p className="text-secondaryMedicine text-sm font-medium">
                  Wishlists
                </p>
              </Link>

              <div className="flex items-center gap-2 mt-2 ps-1">
                <TbLogout className="text-lg text-secondaryMedicine" />

                <button
                  onClick={handleLogout}
                  className="text-secondaryMedicine text-sm font-medium"
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
                className="mt-4 mb-2 px-4 py-2 text-sm bg-secondaryMedicine text-white rounded-md"
              >
                LOGIN
              </button>
            </div>
          </>
        )}

        <div className="h-full border-e px-1 max-w-screen-md pb-5 bg-white">
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
                        ? "bg-green-100 text-secondaryMedicine"
                        : "text-deepGray"
                    } ${
                      idx === typeInfo?.length - 1
                        ? "border-none"
                        : "border-b border-gray-100/10"
                    } py-2 flex items-center gap-4`}
                  >
                    <div>
                      <Image
                        width={500}
                        height={500}
                        src={
                          data?.image
                            ? `/images/medicine/type/type${idx + 1}.webp`
                            : "/png/dummyImage.png"
                        }
                        alt="medicine category"
                        className="w-8 h-8"
                      />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs font-medium hover:text-primaryMedicine">
                        {data?.name}
                      </p>
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
                  <div className="overflow-hidden ps-1">
                    {data?.subtype?.map((sub, idx) => (
                      <div
                        onClick={() => handleSubtype(sub?.subtypeInfo?._id)}
                        key={sub?._id}
                      >
                        <div
                          className={`cursor-pointer ${
                            idx === data?.subtype?.length - 1
                              ? "border-none"
                              : "border-b border-gray-400/10"
                          } py-4 flex items-center justify-between gap-4 ml-6`}
                        >
                          <div>
                            <MdPlayArrow
                              className={`text-xs ${
                                sub?.subtypeInfo?._id === activeSubtype
                                  ? "text-primaryMedicine"
                                  : "text-deepGray"
                              } hover:text-primaryMedicine`}
                            />
                          </div>
                          <div className="flex-1">
                            <p
                              className={`text-xs font-medium ${
                                sub?.subtypeInfo?._id === activeSubtype
                                  ? "text-primaryMedicine"
                                  : "text-deepGray"
                              } hover:text-primaryMedicine`}
                            >
                              {sub?.sub_type_name}
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
