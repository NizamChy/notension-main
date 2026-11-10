"use client";

import axios from "axios";
import { lineTotal } from "@/utils/price";
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
import { FASHION_BASE_URL } from "@/api-endpoints/env";
import { CREATE_ORDER } from "@/api-endpoints/api-endpoint";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
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
    onSuccess: () => {
      setTotalStores((prev) => prev + 1);
    },
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Guard against double submit while orders are being placed.
    if (isSubmitting) return;

    if (!formData?.name || !formData?.phone || !formData?.address) {
      return toast.error("Please fill all required fields");
    }

    setIsSubmitting(true);
    const failedStores = [];

    for (const [, items] of Object.entries(groupedItems)) {
      const merchantInfo = items[0]?.store_info;

      const subtotal = items.reduce(
        (sum, item) => sum + lineTotal(item),
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
          // product_color: item?.selectedColor,
          purchase_price: item?.sale_price,
          max_retail_price: item?.max_retail_price,
          sale_price: item?.sale_price,
          unit_symbol: "pcs",
          max_allowed: item?.max_allowed,
          quantity: item?.quantity,
          delivered_qty: 0,
          inc_qty: 1,
          ordered_img: item?.selectedImage,
        })),
        subTotal: subtotal,
        less_amount: 0,
        vatAmount: 0,
        deliveryCharge: deliveryCharge,
        totalAmount: total,
        shortNote: "",
        paymet_method: formData?.paymentOption,
      };

      try {
        await postOrderMutation.mutateAsync(orderData);
        // Remove this store's items right away so a retry after a partial
        // failure does not place the same order twice.
        items.forEach((item) =>
          removeFromCart(item?._id, item?.selectedSize, item?.selectedImage)
        );
      } catch {
        failedStores.push(merchantInfo?.shop_name || "a store");
      }
    }

    setIsSubmitting(false);

    if (failedStores.length) {
      toast.error(
        `Failed to place order for ${failedStores.join(", ")}. Please try again.`
      );
      return;
    }

    openModal();
    clearCart();
  };

  const handleGoHomeClick = () => {
    router.push("/fashion-lifestyle");
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
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary/90"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
        <CommonModal isOpen={isModalOpen} onClose={closeModal}>
          <div className="flex flex-col justify-center items-center min-h-80 text-gray bg-gray-50 rounded-md">
            {/* <div className="w-40">
              <Image
                className="w-full object-contain"
                src="/images/fashion-lifestyle/success-icon.png"
                alt="success-icon png"
                height={160}
                width={160}
              />
            </div> */}

            <DotLottieReact
              src="https://lottie.host/7ea3cf4e-a72b-407b-8ea9-9103738dab49/nZY9k8iTb7.lottie"
              loop
              autoplay
            />

            {totalStores > 1 ? (
              <p className="pb-3 font-semibold text-2xl text-green-600">
                Order placed for {totalStores} stores!
              </p>
            ) : (
              <p className="pb-3 font-semibold text-2xl text-green-600">
                Order placed successfully!
              </p>
            )}

            <ExploreButton title="Go Home" onClick={handleGoHomeClick} />
          </div>
        </CommonModal>
      </>
    );

  const overallSubtotal = cartItems.reduce(
    (sum, item) => sum + lineTotal(item),
    0
  );
  const deliveryCharge = 0 * groupedItemsLength;
  const overallTotal = overallSubtotal + deliveryCharge;

  return (
    <>
      <div className="bg-gray-50 min-h-screen py-5 md:py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-5 md:mb-8">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-700">
              Checkout
            </h1>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 items-start">
            <div className="bg-white p-5 md:p-6 rounded-lg border border-gray-100 shadow-sm">
              <h2 className="text-lg font-medium text-gray-900 mb-6">
                Shipping information
              </h2>

              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 gap-y-4 sm:grid-cols-2 sm:gap-x-4">
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Name <span className="text-red-600">*</span>
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="mt-1 block w-full border border-gray-300 rounded-md py-2 px-3 appearance-none outline-none focus:border-primary focus:ring-1 focus:ring-primary/30"
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
                      className="mt-1 block w-full border border-gray-300 rounded-md py-2 px-3 appearance-none outline-none focus:border-primary focus:ring-1 focus:ring-primary/30"
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
                      className="mt-1 block w-full border border-gray-300 rounded-md py-2 px-3 appearance-none outline-none focus:border-primary focus:ring-1 focus:ring-primary/30"
                      required
                    />
                  </div>
                </div>

                <div className="mt-8 pt-6 border-t border-gray-100">
                  <h2 className="text-lg font-medium text-gray-900 mb-4">
                    Payment method
                  </h2>

                  <div className="space-y-2">
                    {PAYMENT_DATA.map((option) => (
                      <label
                        key={option.id}
                        className={`flex items-center gap-3 px-3 py-2 rounded-md border cursor-pointer transition-colors ${
                          formData.paymentOption === option.label
                            ? "border-primary bg-primary/5"
                            : "border-gray-200 hover:bg-gray-50"
                        }`}
                      >
                        <input
                          type="radio"
                          name="paymentOption"
                          value={option.label}
                          checked={formData.paymentOption === option.label}
                          onChange={handleChange}
                          className="h-4 w-4 accent-primary"
                        />
                        <Image
                          src={option.icon}
                          alt=""
                          width={40}
                          height={40}
                          className="w-8 h-8 object-contain"
                        />
                        <span className="text-gray-800 font-medium text-sm">
                          {option.label}
                        </span>
                      </label>
                    ))}
                  </div>

                  <div className="mt-6 flex justify-end">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full sm:w-auto bg-primary py-3 px-8 border border-transparent rounded-lg shadow-sm text-sm font-semibold text-white hover:bg-primary/90 disabled:bg-gray-300 disabled:cursor-not-allowed"
                    >
                      {isSubmitting
                        ? "Placing Order..."
                        : "Place Order"}
                    </button>
                  </div>
                </div>
              </form>
            </div>

            {/* On small screens the summary comes first, so shoppers see what
                they are paying for before the "Place order" button. */}
            <div className="lg:col-span-1 order-first lg:order-none">
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
