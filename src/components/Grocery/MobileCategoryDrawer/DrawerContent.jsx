"use client";

import Link from "next/link";
import Image from "next/image";
import { toast } from "react-toastify";
import React, { useState } from "react";
import { TbLogout } from "react-icons/tb";
import { CgProfile } from "react-icons/cg";
import { TiShoppingCart } from "react-icons/ti";
import { RiArrowRightSLine } from "react-icons/ri";
import { IoLocationOutline } from "react-icons/io5";
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

    const formattedTypeName = data?.name
      ?.trim()
      .toLowerCase()
      .replace(/[^\p{Script=Bengali}a-z0-9 ]/gu, "")
      .replace(/\s+/g, "-");

    const typeSlugId = `${formattedTypeName}_${data.id}`;

    router.push(
      `/grocery/${params?.store}/${params?.storeId}/${params?.customStoreId}/type/${typeSlugId}`
    );
  };

  const handleSubtype = (subTypeId, sub) => {
    setActiveSubtype(subTypeId);
    toggleDrawer();

    const formattedSubTypeName = sub?.sub_type_name
      ?.trim() // Remove leading/trailing spaces
      .toLowerCase()
      .replace(/[^\p{Script=Bengali}a-z0-9 ]/gu, "") // Remove unwanted chars
      .replace(/\s+/g, "-"); // Replace spaces with -

    const subTypeSlugId = `${formattedSubTypeName}_${subTypeId}`;

    router.push(
      `/grocery/${params?.store}/${params?.storeId}/${params?.customStoreId}/sub-type/${subTypeSlugId}`
    );
  };

  const handleCustomtype = (customTypeId) => {
    toggleDrawer();
    router.push(`/grocery/${params?.store}/custom-type/${customTypeId}`);
  };

  const handleLogin = () => {
    toggleDrawer();
    openModal();
  };

  const handleLogout = () => {
    dispatch(handleUserReducer({ type: "LOGOUT_USER", data: {} }));
    toast.success("User logged out successfully");
  };

  return (
    <>
      <div className="max-w-screen-md">
        {userInfo?._id ? (
          <>
            <div className="p-3 px-5">
              <div className="flex items-center gap-2">
                <CgProfile className="text-lg text-secondary" />

                <div className="-space-y-0.5">
                  <p className="font-medium text-sm text-secondary">
                    {userInfo?.customer_name}
                  </p>
                  <p className="text-sm text-deepGray">
                    {userInfo?.contact_no}
                  </p>
                </div>
              </div>

              <Link
                onClick={toggleDrawer}
                href={`/grocery/${params?.store}/orders`}
                className="mt-2 flex gap-2"
              >
                <TiShoppingCart className="text-lg text-secondary" />
                <p className="text-secondary text-sm font-medium">My Orders</p>
              </Link>

              <Link
                onClick={toggleDrawer}
                href="/user/update-address"
                className="mt-2 flex gap-2"
              >
                <span>
                  <IoLocationOutline className="text-lg text-secondary" />
                </span>
                <p className="text-secondary text-sm font-medium">
                  Update Address
                </p>
              </Link>

              <Link
                onClick={toggleDrawer}
                href={`/grocery/${params?.store}/favorite-items`}
                className="mt-2 flex gap-2"
              >
                <MdFavoriteBorder className="text-lg text-secondary" />
                <p className="text-secondary text-sm font-medium">Wishlists</p>
              </Link>

              <div className="flex items-center gap-2 mt-2 ps-1">
                <TbLogout className="text-lg text-secondary" />

                <button
                  onClick={handleLogout}
                  className="text-secondary text-sm font-medium"
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
                className="mt-4 mb-2 px-4 py-2 text-sm bg-secondary text-white rounded-md"
              >
                LOGIN
              </button>
            </div>
          </>
        )}

        <div className="h-full border-e px-1 max-w-screen-md pb-5 bg-white">
          <div className="overflow-y-auto h-full no-scrollbar">
            {typeInfo?.map((data, idx) => (
              <div className="border-b border-gray-400/10" key={data?.id}>
                {data?.parent === null && (
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
                            ? `/images/grocery/type/type${idx + 1}.jpg`
                            : "/png/dummyImage.png"
                        }
                        alt="grocery category"
                        className="w-10 h-10"
                      />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs font-medium hover:text-blue-500">
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
                  <div className="overflow-hidden ps-2">
                    {data?.subtype?.map((sub, idx) => (
                      <div
                        onClick={() =>
                          handleSubtype(sub?.subtypeInfo?._id, sub)
                        }
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
                                  ? "text-blue-500"
                                  : "text-deepGray"
                              } hover:text-blue-500`}
                            />
                          </div>
                          <div className="flex-1">
                            <p
                              className={`text-xs font-medium ${
                                sub?.subtypeInfo?._id === activeSubtype
                                  ? "text-blue-500"
                                  : "text-deepGray"
                              } hover:text-blue-500`}
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
