"use client";
import { useOrder } from "@/hooks/place-order/useOrder";
import React, { useEffect, useState } from "react";
import { TbCurrencyTaka } from "react-icons/tb";
import { useSelector } from "react-redux";
import OrderDetailsModal from "./OrderDetailsModal";
import { useParams, useRouter } from "next/navigation";
import Loader from "@/components/common/Loader";

const OrdersSection = () => {
  const [selectedOrder, setSelectedOrder] = useState(null);
  const params = useParams();
  const router = useRouter();

  const { progressing, getOrderInfo } = useOrder();
  const groceryOrderInfo = useSelector((state) => state.user.groceryOrderInfo);

  useEffect(() => {
    getOrderInfo();
  }, []);

  return (
    <div className="px-3 lg:px-36 py-10 md:py-16 lg:py-20 mt-10 bg-[#F3F4F6]">
      <p className="text-base md:text-2xl text-textDeep font-bold text-secondary">
        Order History
      </p>

      {progressing ? (
        <Loader />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-3 md:mt-6">
          {groceryOrderInfo && groceryOrderInfo.length > 0 ? (
            groceryOrderInfo.map((order) => (
              <div
                key={order._id}
                className="border rounded-lg p-4 bg-white shadow-md"
              >
                <div className="flex justify-between items-center">
                  <p className="text-sm font-medium md:text-lg md:font-bold text-secondary">
                    Order# {order.order_id.split("-").pop()}
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
                  <p className="text-sm md:text-base">
                    <span className="font-medium">Order Date:</span>{" "}
                    {new Date(order.createdAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>

                  <p className="flex items-center gap-1 text-sm md:text-base">
                    <span className="font-medium">Subtotal:</span>{" "}
                    <span className="flex items-center">
                      <TbCurrencyTaka />
                      {order.subTotal}
                    </span>
                  </p>
                  <p className="flex items-center gap-1 text-sm md:text-base">
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

                <div className="flex justify-end md:hidden text-sm">
                  <button
                    onClick={() =>
                      router.push(
                        `/grocery/${params?.store}/orders/${order._id}`
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
  );
};

export default OrdersSection;
