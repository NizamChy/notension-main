"use client";

import Image from "next/image";
import { useSelector } from "react-redux";
import { IoIosCall } from "react-icons/io";
import { TbCurrencyTaka } from "react-icons/tb";
import { FaLocationDot } from "react-icons/fa6";
import React, { useEffect, useState } from "react";
import { IoStorefrontSharp } from "react-icons/io5";
import LoginModalDetails from "@/components/Cart/LoginModalDetails";
import { MEDICINE_ITEMS_IMAGES } from "@/api-endpoints/api-endpoint";
import CommonModal from "@/components/shared/CommonModal/CommonModal";

const OrderDetailsMobile = ({ orderId }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { userInfo } = useSelector((state) => state.user);
  const medicineOrderInfo = useSelector(
    (state) => state.user.medicineOrderInfo
  );

  const order = medicineOrderInfo.find((order) => order._id === orderId);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  useEffect(() => {
    if (!userInfo?._id) {
      openModal();
    }
  }, [orderId]);

  return (
    <>
      {userInfo?._id && (
        <div className="p-2 mt-16">
          <div className="space-y-1.5 text-sm">
            <h2 className="text-lg md:text-xl font-bold mb-1 text-secondaryMedicine">
              Order Details
            </h2>

            <p>
              <span className="font-medium">Order ID:</span>{" "}
              {order.order_id.split("-").pop()}
            </p>

            <p className="flex items-start gap-1 text-sm md:text-base text-primaryMedicine font-semibold">
              <span>
                <IoStorefrontSharp className="mt-1 text-primaryMedicine" />
              </span>
              <span>{order?.merchantInfo?.shop_name}</span>
            </p>

            <p className="flex items-start gap-1 text-sm md:text-base">
              <span>
                <FaLocationDot className="mt-1 text-primaryMedicine" />
              </span>
              <span>{order?.merchantInfo?.shop_address}</span>
            </p>

            <p className="flex items-start gap-1 text-sm md:text-base font-medium">
              <span>
                <IoIosCall className="mt-1 text-primaryMedicine" />
              </span>
              <span>
                {" "}
                {order?.merchantInfo?.contact_no},{" "}
                {order?.merchantInfo?.alternative_contact_no}
              </span>
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
              <span className="text-secondaryMedicine">
                {order.paymet_method}
              </span>
            </p>

            <div className="mt-4 max-h-[40vh] overflow-y-auto">
              <h3 className="font-bold text-secondaryMedicine mb-4">
                Ordered Items
              </h3>
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
                    <tr key={item?._id} className="hover:bg-[#F9FAFB] text-xs">
                      <td className="px-1 py-2 flex items-center gap-3">
                        <Image
                          src={
                            item?.app_image
                              ? `${MEDICINE_ITEMS_IMAGES}/${item.app_image}`
                              : "/png/dummyImage.png"
                          }
                          alt="food image"
                          width={40}
                          height={40}
                          className="rounded-lg object-cover"
                        />
                        <div>
                          <p className="line-clamp-2">{item?.item_title_eng}</p>
                          <p className="flex items-center text-primaryMedicine">
                            <TbCurrencyTaka />
                            {item?.sale_price}
                          </p>
                        </div>
                      </td>
                      <td className="px-4 py-2 text-center">
                        {item?.quantity}
                      </td>
                      <td className="px-4 py-2 text-right">
                        <span className="flex justify-end items-center gap-1">
                          <TbCurrencyTaka />
                          {(item?.sale_price * item?.quantity).toFixed(2)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-4 space-y-1">
              <h3 className="font-bold text-secondaryMedicine">
                Price Details
              </h3>

              <p className="flex justify-between items-center gap-1">
                <span className="font-medium">Subtotal:</span>{" "}
                <span className="flex items-center">
                  <TbCurrencyTaka />
                  {order?.subTotal}
                </span>
              </p>

              <p className="flex justify-between items-center gap-1">
                <span className="font-medium">Delivery Charge:</span>{" "}
                <span className="flex items-center">
                  <TbCurrencyTaka />
                  {order?.deliveryCharge}
                </span>
              </p>

              <p className="flex justify-between items-center gap-1">
                <span className="font-medium">Discount:</span>{" "}
                <span className="flex items-center">
                  <TbCurrencyTaka />
                  {order?.less_amount}
                </span>
              </p>

              <p className="flex items-center justify-between gap-1">
                <span className="font-medium">Total Amount:</span>{" "}
                <span className="flex items-center font-bold">
                  <TbCurrencyTaka />
                  {order?.totalAmount}
                </span>
              </p>
            </div>
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

export default OrderDetailsMobile;
