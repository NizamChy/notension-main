"use client";

import { useSelector } from "react-redux";
import { TbCurrencyTaka } from "react-icons/tb";
import Loader from "@/components/common/Loader";
import { FaLocationDot } from "react-icons/fa6";
import React, { useEffect, useState } from "react";
import OrderDetailsModal from "./OrderDetailsModal";
import { IoStorefrontSharp } from "react-icons/io5";
import { useParams, useRouter } from "next/navigation";
import { useOrderGrocery } from "@/hooks/place-order/useOrderGrocery";

const OrdersSection = () => {
  const [selectedOrder, setSelectedOrder] = useState(null);

  const router = useRouter();
  const params = useParams();

  const { userInfo } = useSelector((state) => state.user);
  const { progressing, getOrderInfo } = useOrderGrocery();

  const medicineOrderInfo = useSelector(
    (state) => state.user.medicineOrderInfo
  );

  useEffect(() => {
    getOrderInfo();
  }, []);

  return (
    <>
      {userInfo?._id && (
        <div className="px-3 lg:px-36 py-16 lg:py-20 mt-10 bg-[#F3F4F6] min-h-content">
          <p className="text-[22px] text-textDeep font-bold text-secondary">
            Order History
          </p>

          {progressing ? (
            <Loader />
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
              {medicineOrderInfo && medicineOrderInfo.length > 0 ? (
                medicineOrderInfo.map((order) => (
                  <div
                    key={order._id}
                    className="border rounded-lg p-4 bg-white shadow-md"
                  >
                    <div className="flex justify-between items-center">
                      <p className="text-lg font-bold text-secondary">
                        Order# {order.order_id.split("-").pop()}
                      </p>

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

                      <p
                        className={`px-3 py-1 rounded-full ${
                          order.order_status === "Pending"
                            ? "bg-yellow-100 text-yellow-600"
                            : "bg-green-100 text-green-600"
                        }`}
                      >
                        {order.order_status}
                      </p>
                    </div>

                    <div className="mt-2">
                      <p>
                        <span className="font-medium">Order Date:</span>{" "}
                        {new Date(order.createdAt).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </p>

                      <p className="flex items-center gap-1">
                        <span className="font-medium">Subtotal:</span>{" "}
                        <span className="flex items-center">
                          <TbCurrencyTaka />
                          {order.subTotal}
                        </span>
                      </p>
                      <p className="flex items-center gap-1">
                        <span className="font-medium">Total Amount:</span>{" "}
                        <span className="flex items-center">
                          <TbCurrencyTaka />
                          {order.totalAmount}
                        </span>
                      </p>
                    </div>

                    <div className="md:flex justify-end hidden">
                      <button
                        onClick={() => setSelectedOrder(order)}
                        className="mt-4 px-4 py-2 bg-secondary text-white rounded-lg"
                      >
                        View Details
                      </button>
                    </div>

                    <div className="flex justify-end md:hidden">
                      <button
                        onClick={() =>
                          router.push(
                            `/medicine/${params?.store}/${params?.storeId}/${params?.customStoreId}/${order._id}`
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
                <p>No orders found.</p>
              )}
            </div>
          )}

          {selectedOrder && (
            <OrderDetailsModal
              isOpen={!!selectedOrder}
              onClose={() => setSelectedOrder(null)}
              order={selectedOrder}
            />
          )}
        </div>
      )}
    </>
  );
};

export default OrdersSection;
