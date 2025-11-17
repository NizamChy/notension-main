"use client";

import axios from "axios";
import Link from "next/link";
import Image from "next/image";
import toast from "react-hot-toast";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import OrderSummary from "./OrderSummary";
import { useRouter } from "next/navigation";
import { TiShoppingCart } from "react-icons/ti";
import { useCart } from "../context/CartContext";
import { PAYMENT_DATA } from "../utils/constants";
import { useMutation } from "@tanstack/react-query";
import { FASHION_BASE_URL } from "@/api-endpoints/secret";
import { CREATE_ORDER } from "@/api-endpoints/api-endpoint";
import ExploreButton from "../shared/ExploreButton/ExploreButton";
import CommonModal from "@/components/shared/CommonModal/CommonModal";

const Checkout = () => {
  const [totalStores, setTotalStores] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { userInfo } = useSelector((state) => state.user);

  const [formData, setFormData] = useState({
    name: userInfo?.customer_name || "",
    phone: userInfo?.contact_no || "",
    address: userInfo?.customer_address || "",
    paymentOption: PAYMENT_DATA[0].label || "",
  });

  const { cartItems, removeFromCart, clearCart } = useCart();

  const router = useRouter();

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const groupedItems = cartItems.reduce((groups, item) => {
    const storeId = item?.store_info?._id;
    if (!groups[storeId]) groups[storeId] = [];
    groups[storeId].push(item);
    return groups;
  }, {});

  const groupedItemsLength = Object.keys(groupedItems)?.length;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const postOrderMutation = useMutation({
    mutationFn: async (orderData) => {
      const response = await axios.post(
        `${FASHION_BASE_URL}${CREATE_ORDER}`,
        orderData
      );
      return response.data;
    },
    onSuccess: (data) => {
      // toast.dismiss();
      // toast.success(data?.message || "Order placed successfully!");
      setTotalStores((prev) => prev + 1);

      console.log(data?.message || "Order placed successfully!");
    },
    onError: (error) => {
      console.error("Error posting order:", error);
      toast.error("Failed to place order");
    },
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData?.name || !formData?.phone || !formData?.address) {
      return toast.error("Please fill all required fields");
    }

    for (const [storeId, items] of Object.entries(groupedItems)) {
      const merchantInfo = items[0]?.store_info;

      const subtotal = items.reduce(
        (sum, item) => sum + item?.sale_price * item?.quantity,
        0
      );
      const deliveryCharge = 0;
      const total = subtotal + deliveryCharge;

      const orderData = {
        customer_id: userInfo?._id,
        custom_customer_id: userInfo?.custom_id,
        customerInfo: {
          customer_name: formData?.name,
          customer_address: formData?.address,
          contact_no: formData?.phone,
          alternative_contact_no: formData?.phone,
          latitude: userInfo?.latitude,
          longitude: userInfo?.longitude,
        },
        merchant_id: merchantInfo?._id,
        custom_merchant_id: merchantInfo?.custom_merchant_id || "",
        merchantInfo: {
          shop_name: merchantInfo?.shop_name,
          shop_address: merchantInfo?.shop_address,
          contact_no: merchantInfo?.contact_no || "N/A",
          alternative_contact_no: merchantInfo?.alternative_contact_no || "N/A",
        },
        orderItems: items.map((item) => ({
          _id: item?._id,
          type_info: item?.type_info?._id,
          brand_info: item?.brand_info || "",
          product_title_eng: item?.product_title_eng,
          product_title_beng: item?.product_title_beng,
          product_size: item?.selectedSize,
          product_color: item?.selectedColor,
          purchase_price: item?.sale_price,
          max_retail_price: item?.max_retail_price,
          sale_price: item?.sale_price,
          unit_symbol: "pcs",
          max_allowed: item?.max_allowed,
          quantity: item?.quantity,
          delivered_qty: 0,
          inc_qty: 1,
          app_image: item?.app_image,
        })),
        subTotal: subtotal,
        less_amount: 0,
        vatAmount: 0,
        deliveryCharge: deliveryCharge,
        totalAmount: total,
        shortNote: "",
        paymet_method: formData?.paymentOption,
      };

      console.log(
        "Posting order for store:",
        merchantInfo?.shop_name,
        orderData
      );

      await postOrderMutation.mutateAsync(orderData);
    }

    // toast.success("Order placed successfully!");

    openModal();
    clearCart();
    // router.push("/fashion_lifestyle");
    // toast.success("All store orders placed successfully!");
  };

  const handleGoHomeClick = () => {
    router.push("/fashion_lifestyle");
    setTotalStores(0);

    closeModal();
  };

  if (cartItems?.length < 1)
    return (
      <>
        <div className="min-h-[60vh] flex flex-col justify-center items-center">
          <p className="text-2xl font-semibold text-primary flex flex-col gap-1 items-center justify-center">
            <TiShoppingCart className="text-5xl text-primary" />
            Your cart is empty!
          </p>
          <div className="mt-6">
            <Link
              href="/"
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
        <CommonModal isOpen={isModalOpen} onClose={closeModal}>
          <div className="flex flex-col justify-center items-center min-h-80 text-gray bg-gray-50 rounded-md">
            <div className="w-40">
              <Image
                className="w-full object-contain"
                src="/images/fashion-lifestyle/success-icon.png"
                alt="success-icon png"
                height={160}
                width={160}
              />
            </div>
            <p className="py-3 font-semibold text-2xl text-primary">
              Order placed for {totalStores} stores!
              {/* Order placed successfully! */}
            </p>

            <ExploreButton title="Go Home" onClick={handleGoHomeClick} />
          </div>
        </CommonModal>
      </>
    );

  const overallSubtotal = cartItems.reduce(
    (sum, item) => sum + item?.sale_price * item?.quantity,
    0
  );
  const deliveryCharge = 0 * groupedItemsLength;
  const overallTotal = overallSubtotal + deliveryCharge;

  return (
    <>
      <div className="bg-gray-50 min-h-screen py-5 md:py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-700">Checkout</h1>
          </div>

          <div className="lg:grid lg:grid-cols-2 lg:gap-x-12">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h2 className="text-lg font-medium text-gray-900 mb-6">
                Shipping information
              </h2>

              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-4">
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Name <span className="text-red-600">*</span>
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="mt-1 block w-full border border-gray-300 rounded-md py-2 px-3 appearance-none outline-none"
                      required
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Phone <span className="text-red-600">*</span>
                    </label>
                    <input
                      type="text"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="mt-1 block w-full border border-gray-300 rounded-md py-2 px-3 appearance-none outline-none"
                      required
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Address <span className="text-red-600">*</span>
                    </label>
                    <textarea
                      rows={3}
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      className="mt-1 block w-full border border-gray-300 rounded-md py-2 px-3 appearance-none outline-none"
                      required
                    />
                  </div>
                </div>

                <div className="bg-white p-6 mt-8 rounded-lg shadow-sm">
                  <h2 className="text-lg font-medium text-gray-900 mb-6">
                    Payment method
                  </h2>

                  <div className="space-y-4">
                    {PAYMENT_DATA.map((option) => (
                      <label
                        key={option.id}
                        className="flex items-center gap-2 p-1 cursor-pointer hover:bg-gray-100"
                      >
                        <input
                          type="radio"
                          name="paymentOption"
                          value={option.label}
                          checked={formData.paymentOption === option.label}
                          onChange={handleChange}
                          className="h-5 w-5 text-blue-600"
                        />
                        <Image
                          src={option.icon}
                          alt={option.label}
                          width={40}
                          height={40}
                          className="w-10"
                        />
                        <span className="text-gray-800 font-medium text-xs md:text-base">
                          {option.label}
                        </span>
                      </label>
                    ))}
                  </div>

                  <div className="mt-6 flex justify-between">
                    <button
                      type="submit"
                      disabled={postOrderMutation.isPending}
                      className="ml-auto bg-indigo-600 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white hover:bg-indigo-700"
                    >
                      {postOrderMutation.isPending
                        ? "Placing Order..."
                        : "Place Order"}
                    </button>
                  </div>
                </div>
              </form>
            </div>

            <div className="mt-10 lg:mt-0 lg:col-span-1">
              <OrderSummary
                items={cartItems}
                subtotal={overallSubtotal}
                deliveryCharge={deliveryCharge}
                total={overallTotal}
                removeFromCart={removeFromCart}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Checkout;
