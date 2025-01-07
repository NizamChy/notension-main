"use client";
import React from "react";
import { useSelector } from "react-redux";
import Image from "next/image";
import { TbCurrencyTaka } from "react-icons/tb";

const OrderDetailsMobile = ({ orderId }) => {
  const foodOrderInfo = useSelector((state) => state.user.foodOrderInfo);

  const order = foodOrderInfo.find((order) => order._id === orderId);

  if (!order) {
    return <p className="text-red-500">Order not found!</p>;
  }

  return (
    <div className="p-4">
      <div className="space-y-3">
        <h2 className="text-xl font-bold mb-4 text-secondary">Order Details</h2>

        <p>
          <span className="font-medium">Order ID:</span>{" "}
          {order.order_id.split("-").pop()}
        </p>

        <p>
          <span className="font-medium">Order Date:</span>{" "}
          {new Date(order.createdAt).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </p>
        <p>
          <span className="font-medium">Order Status:</span>
          <span
            className={`px-3 mx-1 py-1 rounded-full ${
              order.order_status === "Pending"
                ? "bg-yellow-100 text-yellow-600"
                : "bg-green-100 text-green-600"
            }`}
          >
            {order.order_status}
          </span>
        </p>

        <p>
          <span className="font-medium">Paymet Method: </span>
          <span className="text-secondary">{order.paymet_method}</span>
        </p>

        <div className="mt-4 max-h-[40vh] overflow-y-auto pe-2">
          <h3 className="font-bold text-secondary mb-4">Order Items</h3>
          <table className="table-auto w-full border-collapse border border-gray-100">
            <thead>
              <tr className="bg-gray-100">
                <th className="px-4 py-2 text-left">Item</th>
                <th className="px-4 py-2 text-center">Quantity</th>
                <th className="px-4 py-2 text-right">Price</th>
              </tr>
            </thead>
            <tbody>
              {order.orderItems.map((item) => (
                <tr key={item._id} className="hover:bg-[#F9FAFB]">
                  <td className="px-4 py-2 flex items-center gap-3">
                    <Image
                      src={`https://we-care-base.sgp1.cdn.digitaloceanspaces.com/food-items-images/${item?.app_image}`}
                      alt="food image"
                      width={40}
                      height={40}
                      className="rounded-lg object-cover"
                    />
                    <div>
                      <p className="line-clamp-2">{item.product_title_eng}</p>
                      <p className="flex items-center text-primaryFood">
                        <TbCurrencyTaka />
                        {item.sale_price}
                      </p>
                    </div>
                  </td>
                  <td className="px-4 py-2 text-center">{item.quantity}</td>
                  <td className="px-4 py-2 text-right">
                    <span className="flex justify-end items-center gap-1">
                      <TbCurrencyTaka />
                      {(item.sale_price * item.quantity).toFixed(2)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-4 space-y-1">
          <h3 className="font-bold text-secondary">Price Details</h3>

          <p className="flex justify-between items-center gap-1">
            <span className="font-medium">Subtotal:</span>{" "}
            <span className="flex items-center">
              <TbCurrencyTaka />
              {order.subTotal}
            </span>
          </p>

          <p className="flex justify-between items-center gap-1">
            <span className="font-medium">Delivery Charge:</span>{" "}
            <span className="flex items-center">
              <TbCurrencyTaka />
              {order.deliveryCharge}
            </span>
          </p>

          <p className="flex justify-between items-center gap-1">
            <span className="font-medium">Discount:</span>{" "}
            <span className="flex items-center">
              <TbCurrencyTaka />
              {order.less_amount}
            </span>
          </p>

          <p className="flex items-center justify-between gap-1">
            <span className="font-medium">Total Amount:</span>{" "}
            <span className="flex items-center font-bold">
              <TbCurrencyTaka />
              {order.totalAmount}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailsMobile;
