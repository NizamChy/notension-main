"use client";

import React from "react";
import Image from "next/image";
import { HiMinus, HiPlus } from "react-icons/hi";
import { HiOutlineShoppingBag } from "react-icons/hi2";
import { RiDeleteBin6Line } from "react-icons/ri";

// Building blocks shared by every cart and order summary.

export const formatTaka = (value) =>
  `৳${(Number(value) || 0).toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

export const QtyStepper = ({ quantity, onDecrement, onIncrement, min = 1 }) => (
  <div className="inline-flex h-8 items-center rounded-full border border-gray-200 bg-white">
    <button
      type="button"
      aria-label="Decrease quantity"
      disabled={quantity <= min}
      onClick={onDecrement}
      className="flex h-8 w-8 items-center justify-center rounded-full text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-900 disabled:cursor-not-allowed disabled:text-gray-300 disabled:hover:bg-transparent"
    >
      <HiMinus className="text-sm" />
    </button>
    <span className="min-w-7 text-center text-sm font-semibold tabular-nums text-gray-900">
      {quantity}
    </span>
    <button
      type="button"
      aria-label="Increase quantity"
      onClick={onIncrement}
      className="flex h-8 w-8 items-center justify-center rounded-full text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-900"
    >
      <HiPlus className="text-sm" />
    </button>
  </div>
);

// One product row: image, name, details, unit price, quantity and total.
export const CartLine = ({
  image,
  title,
  meta,
  unitPrice,
  quantity,
  lineTotal,
  onDecrement,
  onIncrement,
  onRemove,
  minQuantity = 1,
}) => (
  <li className="flex gap-3 py-4 first:pt-0 last:pb-0">
    <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl border border-gray-100 bg-gray-50">
      <Image
        src={image || "/png/dummyImage.png"}
        alt={title || "Product"}
        fill
        sizes="80px"
        className="object-cover"
      />
    </div>

    <div className="flex min-w-0 flex-1 flex-col">
      <div className="flex items-start gap-2">
        <p className="line-clamp-2 flex-1 text-sm font-medium leading-snug text-gray-900">
          {title}
        </p>
        {onRemove && (
          <button
            type="button"
            aria-label={`Remove ${title || "item"}`}
            onClick={onRemove}
            className="-mr-1 -mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-gray-400 transition-colors hover:bg-[#D92D20]/10 hover:text-[#D92D20]"
          >
            <RiDeleteBin6Line className="text-[15px]" />
          </button>
        )}
      </div>

      {meta && <p className="mt-0.5 text-xs text-gray-500">{meta}</p>}
      <p className="mt-0.5 text-xs tabular-nums text-gray-500">
        {formatTaka(unitPrice)} each
      </p>

      <div className="mt-auto flex items-center justify-between gap-2 pt-2">
        {onIncrement ? (
          <QtyStepper
            quantity={quantity}
            min={minQuantity}
            onDecrement={onDecrement}
            onIncrement={onIncrement}
          />
        ) : (
          <span className="text-xs text-gray-500">Qty {quantity}</span>
        )}
        <span className="text-sm font-semibold tabular-nums text-gray-900">
          {formatTaka(lineTotal)}
        </span>
      </div>
    </div>
  </li>
);

export const CartEmpty = ({
  title = "Your cart is empty",
  text = "Add items to see them here.",
  action,
}) => (
  <div className="flex h-full flex-col items-center justify-center px-6 py-12 text-center">
    <span className="flex h-16 w-16 items-center justify-center rounded-full bg-[#EB5C2F]/10 text-3xl text-[#EB5C2F]">
      <HiOutlineShoppingBag />
    </span>
    <p className="mt-4 text-base font-semibold text-gray-900">{title}</p>
    <p className="mt-1 max-w-[16rem] text-sm text-gray-500">{text}</p>
    {action && <div className="mt-5">{action}</div>}
  </div>
);

// Label / amount row for totals. `strong` is the grand total style.
export const PriceRow = ({ label, value, strong = false, hint }) => (
  <div
    className={`flex items-baseline justify-between gap-4 ${
      strong
        ? "border-t border-dashed border-gray-200 pt-3 text-base font-semibold text-gray-900"
        : "text-sm text-gray-600"
    }`}
  >
    <span>
      {label}
      {hint && <span className="ml-1 text-xs text-gray-400">{hint}</span>}
    </span>
    <span className="tabular-nums">{value}</span>
  </div>
);

// Main call-to-action button (checkout, place order).
export const PrimaryButton = ({ children, className = "", ...props }) => (
  <button
    type="button"
    {...props}
    className={`flex h-12 w-full items-center justify-center gap-2 rounded-full bg-[#0C3F8E] px-6 text-sm font-semibold text-white shadow-sm shadow-[#0C3F8E]/20 transition-colors hover:bg-[#0A3478] disabled:cursor-not-allowed disabled:bg-gray-300 disabled:text-gray-500 disabled:shadow-none ${className}`}
  >
    {children}
  </button>
);
