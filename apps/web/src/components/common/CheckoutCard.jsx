"use client";

import React from "react";
import { useSelector } from "react-redux";
import { AiOutlinePhone } from "react-icons/ai";
import { IoLocationOutline, IoPersonOutline } from "react-icons/io5";
import { lineTotal } from "@/utils/price";
import { CART_MODULES } from "../Cart/cartModules";
import {
  formatTaka,
  PriceRow,
  PrimaryButton,
} from "../shared/CartUI/CartUI";
import {
  CheckoutLayout,
  CheckoutStep,
  PaymentOptions,
  StepLink,
  SummaryCard,
  SummaryItem,
  TextField,
} from "../shared/Checkout/CheckoutUI";

// Shared checkout page for the grocery, medicine and food stores.
const CheckoutCard = ({
  moduleName,
  storeName,
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
}) => {
  const { itemsKey, imageBaseUrl, titleField } = CART_MODULES[moduleName];
  const items = useSelector((state) => state.cart[itemsKey]) || [];
  const itemCount = items.reduce((sum, item) => sum + (item?.quantity || 0), 0);

  const main = (
    <>
      <CheckoutStep
        step={1}
        title="Delivery details"
        action={<StepLink href="/user/update-address">Change</StepLink>}
      >
        <div className="space-y-2.5 rounded-xl bg-gray-50 p-4 text-sm text-gray-700">
          <p className="flex items-center gap-2.5 font-semibold text-gray-900">
            <IoPersonOutline className="shrink-0 text-base text-gray-500" />
            {userInfo?.customer_name || "—"}
          </p>
          <p className="flex items-start gap-2.5">
            <IoLocationOutline className="mt-0.5 shrink-0 text-base text-gray-500" />
            <span>{userInfo?.customer_address || "No address added yet"}</span>
          </p>
          <p className="flex items-center gap-2.5">
            <AiOutlinePhone className="shrink-0 text-base text-gray-500" />
            <span className="tabular-nums">{userInfo?.contact_no || "—"}</span>
          </p>
        </div>
      </CheckoutStep>

      <CheckoutStep step={2} title="Payment method">
        <PaymentOptions
          options={paymentData}
          value={paymentOption}
          onChange={setPaymentOption}
        />
      </CheckoutStep>

      <CheckoutStep step={3} title="Note for the store">
        <TextField
          label="Anything the store should know? (optional)"
          multiline
          id="remark"
          placeholder="E.g. call before delivery, gate code…"
          value={remarks}
          onChange={(e) => setRemarks(e.target.value)}
        />
      </CheckoutStep>
    </>
  );

  const aside = (
    <SummaryCard
      meta={`${itemCount} item${itemCount === 1 ? "" : "s"}`}
      footer={
        <>
          <PrimaryButton
            onClick={onPlaceOrder}
            disabled={progressing || disabled}
          >
            {progressing ? "Placing order…" : `Place order · ${formatTaka(grandTotal)}`}
          </PrimaryButton>
          <p className="mt-3 text-center text-xs text-gray-500">
            By placing this order you agree to our terms of service.
          </p>
        </>
      }
    >
      {storeName && (
        <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-gray-500">
          From {storeName}
        </p>
      )}
      <ul className="max-h-[320px] divide-y divide-gray-100 overflow-y-auto pr-1">
        {items.map((item) => (
          <SummaryItem
            key={item?._id}
            image={item?.app_image ? `${imageBaseUrl}/${item.app_image}` : null}
            title={item?.[titleField]}
            meta={`${formatTaka(item?.sale_price)} each`}
            quantity={item?.quantity}
            total={formatTaka(lineTotal(item))}
          />
        ))}
      </ul>

      <div className="mt-4 space-y-2 border-t border-gray-100 pt-4">
        <PriceRow label="Subtotal" value={formatTaka(totalPrice)} />
        <PriceRow label="Delivery charge" value={formatTaka(shippingCharge)} />
        {Number(discount) > 0 && (
          <PriceRow label="Discount" value={`−${formatTaka(discount)}`} />
        )}
        <PriceRow label="Total" value={formatTaka(grandTotal)} strong />
      </div>
    </SummaryCard>
  );

  return (
    <CheckoutLayout
      subtitle="Review your order and choose how you'd like to pay."
      main={main}
      aside={aside}
    />
  );
};

export default CheckoutCard;
