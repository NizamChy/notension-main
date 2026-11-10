"use client";

import React from "react";
import Image from "next/image";
import { TbCurrencyTaka } from "react-icons/tb";
import { AiOutlinePhone } from "react-icons/ai";
import { IoLocationOutline } from "react-icons/io5";
import FloatingInput from "../LoginSection/FloatingInput";

const Amount = ({ value }) => (
  <span className="flex items-center tabular-nums">
    <TbCurrencyTaka className="shrink-0" />
    {Number(value || 0).toFixed(2)}
  </span>
);

// Shared checkout card for the grocery, medicine and food stores. `accent`
// carries each module's literal Tailwind classes:
// { text, button, selected, radio }.
const CheckoutCard = ({
  userInfo,
  totalPrice,
  shippingCharge,
  discount,
  grandTotal,
  remarks,
  setRemarks,
  paymentData,
  paymentOption,
  setPaymentOption,
  onPlaceOrder,
  progressing,
  disabled,
  accent,
}) => {
  return (
    <div className="flex justify-center py-2 md:py-6">
      <div className="w-full max-w-md space-y-4">
        <h1 className="text-xl md:text-2xl font-semibold text-deepGray">
          Checkout
        </h1>

        <section className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-500">
            Deliver to
          </h2>
          <p className="mt-2 font-semibold text-gray-900">
            {userInfo?.customer_name}
          </p>
          <p className="mt-1.5 flex gap-2 items-start text-sm text-gray-700">
            <IoLocationOutline className={`shrink-0 mt-0.5 text-base ${accent.text}`} />
            <span>{userInfo?.customer_address}</span>
          </p>
          <p className="mt-1 flex gap-2 items-center text-sm text-gray-700">
            <AiOutlinePhone className={`shrink-0 text-base ${accent.text}`} />
            <span>{userInfo?.contact_no}</span>
          </p>
        </section>

        <section className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-500">
            Order summary
          </h2>
          <div className="mt-3 space-y-1.5 text-sm text-gray-700">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <Amount value={totalPrice} />
            </div>
            <div className="flex justify-between">
              <span>Delivery charge</span>
              <Amount value={shippingCharge} />
            </div>
            <div className="flex justify-between">
              <span>Discount</span>
              <Amount value={discount} />
            </div>
          </div>
          <div className="mt-3 pt-3 border-t border-dashed flex justify-between text-base font-semibold text-gray-900">
            <span>Total</span>
            <Amount value={grandTotal} />
          </div>
        </section>

        <section className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-500">
            Payment method
          </h2>
          <div className="mt-3 space-y-2">
            {paymentData?.map((option) => {
              const checked = paymentOption === option.label;
              return (
                <label
                  key={option.id}
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg border cursor-pointer transition-colors ${
                    checked
                      ? accent.selected
                      : "border-gray-200 hover:bg-gray-50"
                  }`}
                >
                  <input
                    type="radio"
                    name="paymentOption"
                    value={option.label}
                    checked={checked}
                    onChange={() => setPaymentOption(option.label)}
                    className={`h-4 w-4 ${accent.radio}`}
                  />
                  <Image
                    src={option.icon}
                    alt=""
                    width={40}
                    height={40}
                    className="w-8 h-8 object-contain"
                  />
                  <span className="text-sm font-medium text-gray-800">
                    {option.label}
                  </span>
                </label>
              );
            })}
          </div>

          <div className="mt-4">
            <FloatingInput
              label="Note for the store (optional)"
              id="remark"
              size="text-base"
              multiline={true}
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
            />
          </div>
        </section>

        <button
          type="button"
          onClick={onPlaceOrder}
          disabled={progressing || disabled}
          className={`w-full py-3 rounded-xl font-semibold text-white shadow-sm transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed ${accent.button}`}
        >
          {progressing ? "Placing order..." : "Place order"}
        </button>
      </div>
    </div>
  );
};

export default CheckoutCard;
