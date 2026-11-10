"use client";

import { useSelector } from "react-redux";
import { IoIosCall } from "react-icons/io";
import { useRouter } from "next/navigation";
import Loader from "@/components/common/Loader";
import { TbCurrencyTaka } from "react-icons/tb";
import { FaLocationDot } from "react-icons/fa6";
import React, { useEffect, useState } from "react";
import OrderDetailsModal from "./OrderDetailsModal";
import { IoStorefrontSharp } from "react-icons/io5";
import NoItemFound from "@/components/common/NoItemFound";
import { useProductOrder } from "../hooks/fetchData/useProductOrder";
import CommonModal from "@/components/shared/CommonModal/CommonModal";
import LoginModalDetails from "@/components/LoginSection/LoginModalDetails";

const OrdersSection = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const router = useRouter();

  const { userInfo } = useSelector((state) => state.user);
  const { useAllOrderByCustomer } = useProductOrder();
  const {
    data: orderInfo,
    isLoading,
    isError,
  } = useAllOrderByCustomer(userInfo?._id, userInfo?.custom_id);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  useEffect(() => {
    if (!userInfo?._id) {
      openModal();
    }
  }, []);

  return (
    <>
      {userInfo?._id && (
        <div className="bg-[#F3F4F6] min-h-content">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 md:py-8">
          <h1 className="text-xl md:text-2xl font-bold text-secondary">
            Order History
          </h1>

          {isLoading ? (
            <Loader />
          ) : (
            <>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 mt-4 md:mt-6">
                {orderInfo && orderInfo?.length > 0 ? (
                  orderInfo?.map((order) => (
                    <div
                      key={order?._id}
                      className="flex flex-col h-full border border-gray-100 rounded-lg p-4 md:p-5 bg-white shadow-sm"
                    >
                      <div className="flex justify-between items-center gap-3">
                        <p className="text-sm font-medium md:text-lg md:font-bold text-secondary">
                          Order# {order?.order_id?.split("-").pop()}
                        </p>

                        <p
                          className={`shrink-0 px-3 py-1 rounded-full text-xs md:text-sm font-medium ${
                            order?.order_status === "Pending"
                              ? "bg-yellow-100 text-yellow-600"
                              : "bg-green-100 text-green-600"
                          }`}
                        >
                          {order?.order_status}
                        </p>
                      </div>

                      <div className="mt-2 space-y-1">
                        <p className="flex items-start gap-1 text-sm md:text-base text-primary font-semibold">
                          <span>
                            <IoStorefrontSharp className="mt-1 text-primary" />
                          </span>
                          <span>{order?.merchantInfo?.shop_name}</span>
                        </p>

                        <p className="flex items-start gap-1 text-sm md:text-base">
                          <span>
                            <FaLocationDot className="mt-1 text-primary" />
                          </span>
                          <span>{order?.merchantInfo?.shop_address}</span>
                        </p>

                        <p className="flex items-start gap-1 text-sm md:text-base font-medium">
                          <span>
                            <IoIosCall className="mt-1 text-primary" />
                          </span>
                          <span>
                            {" "}
                            {order?.merchantInfo?.contact_no},{" "}
                            {order?.merchantInfo?.alternative_contact_no}
                          </span>
                        </p>

                        <p className="text-sm md:text-base">
                          <span className="font-medium">Order Date:</span>{" "}
                          {new Date(order?.createdAt).toLocaleDateString(
                            "en-US",
                            {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            }
                          )}
                        </p>

                        <p className="flex items-center gap-1 text-sm md:text-base">
                          <span className="font-medium">Subtotal:</span>{" "}
                          <span className="flex items-center">
                            <TbCurrencyTaka />
                            {order?.subTotal}
                          </span>
                        </p>
                        <p className="flex items-center gap-1 text-sm md:text-base">
                          <span className="font-medium">Total Amount:</span>{" "}
                          <span className="flex items-center">
                            <TbCurrencyTaka />
                            {order?.totalAmount}
                          </span>
                        </p>
                      </div>

                      <div className="md:flex justify-end hidden mt-auto">
                        <button
                          onClick={() => setSelectedOrder(order)}
                          className="mt-4 px-4 py-2 bg-secondary text-white rounded-lg"
                        >
                          View Details
                        </button>
                      </div>

                      <div className="flex justify-end md:hidden text-sm mt-auto">
                        <button
                          onClick={() =>
                            router.push(
                              `/fashion-lifestyle/orders/${order?._id}`
                            )
                          }
                          className="mt-4 px-4 py-2 bg-secondary text-white rounded-lg"
                        >
                          View Details
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="col-span-full">
                    <NoItemFound />
                  </div>
                )}
              </div>
            </>
          )}

          {selectedOrder && (
            <OrderDetailsModal
              isOpen={!!selectedOrder}
              onClose={() => setSelectedOrder(null)}
              order={selectedOrder}
            />
          )}
        </div>
        </div>
      )}

      {isModalOpen && (
        <>
          <CommonModal isOpen={isModalOpen} onClose={closeModal}>
            <LoginModalDetails onClose={closeModal} type="private-route" />
          </CommonModal>
        </>
      )}
    </>
  );
};

export default OrdersSection;
