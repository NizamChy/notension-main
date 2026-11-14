"use client";

import axios from "axios";
import { lineTotal } from "@/utils/price";
import toast from "react-hot-toast";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import OrderSummary from "./OrderSummary";
import { useRouter } from "next/navigation";
import { useCart } from "../context/CartContext";
import { PAYMENT_DATA } from "../utils/constants";
import { useMutation } from "@tanstack/react-query";
import { FASHION_BASE_URL } from "@/api-endpoints/env";
import { CREATE_ORDER } from "@/api-endpoints/api-endpoint";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import CommonModal from "@/components/shared/CommonModal/CommonModal";
import { PrimaryButton } from "@/components/shared/CartUI/CartUI";
import {
  CheckoutEmpty,
  CheckoutLayout,
  CheckoutStep,
  PaymentOptions,
  TextField,
} from "@/components/shared/Checkout/CheckoutUI";

const FORM_ID = "fashion-checkout";

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

  const handleOrdersClick = () => {
    router.push("/fashion-lifestyle/orders");
    setTotalStores(0);
    closeModal();
  };

  if (cartItems?.length < 1)
    return (
      <>
        <div className="bg-gray-50 px-4 py-10 md:py-16">
          <CheckoutEmpty href="/fashion-lifestyle" />
        </div>
        <CommonModal isOpen={isModalOpen} onClose={closeModal}>
          <div className="flex min-h-80 flex-col items-center justify-center rounded-2xl bg-white px-6 pb-6 text-center">
            <DotLottieReact
              src="https://lottie.host/7ea3cf4e-a72b-407b-8ea9-9103738dab49/nZY9k8iTb7.lottie"
              loop
              autoplay
            />
            <p className="text-xl font-semibold text-gray-900">
              {totalStores > 1
                ? `Orders placed with ${totalStores} shops`
                : "Order placed successfully"}
            </p>
            <p className="mt-1 text-sm text-gray-500">
              We&apos;ll let you know when it&apos;s on the way.
            </p>
            <div className="mt-5 flex w-full max-w-xs flex-col gap-2">
              <PrimaryButton onClick={handleOrdersClick}>View my orders</PrimaryButton>
              <button
                type="button"
                onClick={handleGoHomeClick}
                className="h-11 rounded-full text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-100"
              >
                Continue shopping
              </button>
            </div>
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
    <div className="bg-gray-50 px-4 py-6 sm:px-6 md:py-10 lg:px-8">
      <CheckoutLayout
        subtitle="Tell us where to deliver and how you'd like to pay."
        stickyTopClass="lg:top-[136px]"
        main={
          <form id={FORM_ID} onSubmit={handleSubmit} className="space-y-5">
            <CheckoutStep step={1} title="Delivery details">
              <div className="grid gap-4 sm:grid-cols-2">
                <TextField
                  label="Full name"
                  required
                  name="name"
                  autoComplete="name"
                  value={formData.name}
                  onChange={handleChange}
                />
                <TextField
                  label="Phone number"
                  required
                  type="tel"
                  name="phone"
                  autoComplete="tel"
                  value={formData.phone}
                  onChange={handleChange}
                />
                <TextField
                  label="Delivery address"
                  required
                  multiline
                  name="address"
                  autoComplete="street-address"
                  placeholder="House, road, area, city"
                  value={formData.address}
                  onChange={handleChange}
                  className="sm:col-span-2"
                />
              </div>
            </CheckoutStep>

            <CheckoutStep step={2} title="Payment method">
              <PaymentOptions
                name="paymentOption"
                options={PAYMENT_DATA}
                value={formData.paymentOption}
                onChange={(label) =>
                  setFormData({ ...formData, paymentOption: label })
                }
              />
            </CheckoutStep>
          </form>
        }
        aside={
          <OrderSummary
            items={cartItems}
            subtotal={overallSubtotal}
            deliveryCharge={deliveryCharge}
            total={overallTotal}
            removeFromCart={removeFromCart}
            formId={FORM_ID}
            isSubmitting={isSubmitting}
          />
        }
      />
    </div>
  );
};

export default Checkout;
