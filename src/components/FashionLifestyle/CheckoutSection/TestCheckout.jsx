"use client";

import Link from "next/link";
import Image from "next/image";
// import toast from "react-hot-toast";
import React, { useState } from "react";
import OrderSummary from "./OrderSummary";
// import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { TiShoppingCart } from "react-icons/ti";
import PlaceOrderButton from "./PlaceOrderButton";
import { DISTRICTS, PAYMENT_DATA } from "@/utils/constants";
import toast from "react-hot-toast";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";

const TestCheckout = () => {
  const [formData, setFormData] = useState({
    name: "",
    city: "",
    phone: "",
    address: "",
    district: "",
    paymentOption: PAYMENT_DATA[0].label || "",
  });

  const { cartItems, removeFromCart, clearCart } = useCart();

  // const router = useRouter();

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.sale_price * item.quantity,
    0
  );
  const deliveryCharge = 100;
  const total = subtotal + deliveryCharge;

  // const shippingCost = 100;
  // const tax = subtotal * 0.02;
  // const total = subtotal + shippingCost + tax;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const postOrderMutation = useMutation({
    mutationFn: async (orderData) => {
      const response = await axios.post(
        "https://fashion-and-lifestyle-server.vercel.app/api/v1/customer-order/create",
        orderData
      );

      console.log("response.data : ", response.data);

      return response.data;
    },
    onSuccess: (data) => {
      console.log("Order placed successfully:", data);
      toast.success(`${data?.message}`);
    },
    onError: (error) => {
      console.error("Error posting order:", error);
      toast.error(error);
    },
  });

  const placeOrderData = {
    customer_id: "6735cceab2e3cc27d74d9d38",
    custom_customer_id: "503e5ed0-661b-4ead-bb3f-4e54cd26e65d",
    customerInfo: {
      customer_name: formData?.name,
      customer_address: formData?.address,
      contact_no: formData?.phone,
      alternative_contact_no: formData?.phone,
      latitude: 22.3569,
      longitude: 91.7832,
    },
    merchant_id: "68aedb32931a8df46e5f58fe",
    custom_merchant_id: "794cd061-ed56-48cf-99ef-4f656572b608",
    merchantInfo: {
      shop_name: "Fabrilife",
      shop_address:
        "Opposite of Hotel Peninsula, Beside Yunusco City Centre, 805/A, CDA Avenue, GEC, Chattogram Outlet Hotline: 01620-220606 4000 Chittagong, Bangladesh",
      contact_no: "880 1407-599424",
      alternative_contact_no: "880 1407-599424",
    },
    orderItems: cartItems?.map((item) => ({
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
    shortNote: "Please deliver before evening." || "",
    paymet_method: formData?.paymentOption,
    order_status: "Pending",
  };

  console.log("cartItems : ", cartItems);

  const handleSubmit = (e) => {
    e.preventDefault();

    // const orderData = {
    //   orderInfo: {
    //     orderItems: cartItems,
    //     userInfo: formData,
    //   },
    // };

    // console.log("orderData : ", orderData);

    console.log("placeOrderData : ", placeOrderData);

    postOrderMutation.mutate(placeOrderData);

    // toast.success("Your order has been placed!");
    // clearCart();
    // router.push("/");
  };

  if (cartItems.length < 1)
    return (
      <>
        <div className="min-h-[60vh] flex flex-col justify-center items-center">
          <p className="text-2xl font-semibold text-primary h-full flex flex-col gap-1 items-center justify-center">
            <TiShoppingCart className="text-5xl text-primary" />
            Your cart is empty!
          </p>

          <div className="mt-6">
            <Link
              href="/"
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </>
    );

  return (
    <>
      <div className="bg-gray-50 min-h-screen py-5 md:py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-700">Checkout</h1>
          </div>

          <div className="md:mt-12 lg:grid lg:grid-cols-2 lg:gap-x-12 xl:gap-x-16">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h2 className="text-lg font-medium text-gray-900 mb-6">
                Shipping information
              </h2>

              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-4">
                  <div className="sm:col-span-2">
                    <label
                      htmlFor="name"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Name <span className="text-red-600">*</span>
                    </label>
                    <input
                      type="text"
                      id="name"
                      value={formData?.name}
                      onChange={handleChange}
                      name="name"
                      autoComplete="name"
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                      required
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label
                      htmlFor="address"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Address <span className="text-red-600">*</span>
                    </label>
                    <input
                      type="text"
                      id="address"
                      value={formData?.address}
                      onChange={handleChange}
                      name="address"
                      autoComplete="street-address"
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                      required
                    />
                  </div>

                  {/* <div>
                    <label
                      htmlFor="city"
                      className="block text-sm font-medium text-gray-700"
                    >
                      City <span className="text-red-600">*</span>
                    </label>
                    <input
                      type="text"
                      id="city"
                      value={formData?.city}
                      onChange={handleChange}
                      name="city"
                      autoComplete="address-level2"
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                      required
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="district"
                      className="block text-sm font-medium text-gray-700"
                    >
                      District <span className="text-red-600">*</span>
                    </label>
                    <select
                      id="district"
                      value={formData?.district}
                      onChange={handleChange}
                      name="district"
                      autoComplete="district-name"
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                      required

                      // defaultValue={DISTRICTS[0]}
                    >
                      <option value="">Select district</option>
                      {DISTRICTS?.map((district, index) => (
                        <option
                          key={index}
                          value={district}
                          // disabled={district === DISTRICTS[0]}
                        >
                          {district}
                        </option>
                      ))}
                    </select>
                  </div> */}

                  <div className="sm:col-span-2">
                    <label
                      htmlFor="phone"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Phone <span className="text-red-600">*</span>
                    </label>
                    <input
                      type="text"
                      id="phone"
                      onChange={handleChange}
                      value={formData?.phone}
                      name="phone"
                      autoComplete="tel"
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                      required
                    />
                  </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-sm">
                  <h2 className="text-lg font-medium text-gray-900 mb-6">
                    Payment method
                  </h2>

                  <div className="space-y-4">
                    {PAYMENT_DATA.map((option) => (
                      <label
                        key={option.id}
                        className="flex items-center gap-2 p-1 cursor-pointer transition-colors hover:bg-gray-100"
                      >
                        <input
                          type="radio"
                          name="paymentOption"
                          value={option.label}
                          checked={formData?.paymentOption === option.label}
                          onChange={handleChange}
                          className="form-radio h-5 w-5 text-blue-600"
                          required
                        />

                        <Image
                          src={option.icon}
                          alt={option.label}
                          width={200}
                          height={200}
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
                      disabled={postOrderMutation?.isPending}
                      className="ml-auto bg-indigo-600 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      {postOrderMutation?.isPending
                        ? "Placing Order..."
                        : "Place Order"}
                      {/* Place Order */}
                    </button>
                  </div>

                  {/* <div className="flex justify-end">
                    <PlaceOrderButton
                      type="submit"
                      formData={formData}
                      clearCart={clearCart}
                      cartItems={cartItems}
                    />
                  </div> */}
                </div>
              </form>
            </div>

            <div className="mt-10 lg:mt-0 lg:col-span-1">
              <OrderSummary
                items={cartItems}
                subtotal={subtotal}
                deliveryCharge={deliveryCharge}
                // tax={tax}
                total={total}
                removeFromCart={removeFromCart}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default TestCheckout;
