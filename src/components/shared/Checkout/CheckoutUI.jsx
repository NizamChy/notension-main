"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { HiCheck } from "react-icons/hi";
import { HiOutlineShieldCheck } from "react-icons/hi2";
import { CartEmpty } from "../CartUI/CartUI";

// Building blocks for every checkout page.

// Two columns on lg+: the steps on the left, a sticky summary on the right.
// On small screens the summary comes after the steps.
// `stickyTopClass` clears whatever fixed bars sit above the page.
export const CheckoutLayout = ({
  title = "Checkout",
  subtitle,
  main,
  aside,
  stickyTopClass = "lg:top-[96px]",
}) => (
  <div className="mx-auto w-full max-w-6xl">
    <div className="mb-6 flex flex-wrap items-end justify-between gap-3 md:mb-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900 md:text-3xl">
          {title}
        </h1>
        {subtitle && <p className="mt-1 text-sm text-gray-500">{subtitle}</p>}
      </div>
      <p className="flex items-center gap-1.5 text-xs font-medium text-gray-500">
        <HiOutlineShieldCheck className="text-base text-[#12B76A]" />
        Secure checkout
      </p>
    </div>

    <div className="grid items-start gap-5 lg:grid-cols-[minmax(0,1fr)_380px] lg:gap-8">
      <div className="space-y-5">{main}</div>
      <div className={`lg:sticky ${stickyTopClass}`}>{aside}</div>
    </div>
  </div>
);

// Numbered card for one checkout step.
export const CheckoutStep = ({ step, title, action, children }) => (
  <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm shadow-gray-900/[0.03] md:p-6">
    <div className="mb-4 flex items-center justify-between gap-3">
      <h2 className="flex items-center gap-3 text-base font-semibold text-gray-900">
        {step && (
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#0C3F8E] text-xs font-bold text-white">
            {step}
          </span>
        )}
        {title}
      </h2>
      {action}
    </div>
    {children}
  </section>
);

export const StepLink = ({ href, children }) => (
  <Link
    href={href}
    className="text-sm font-medium text-[#0C3F8E] hover:underline dark:text-[#7FB2FF]"
  >
    {children}
  </Link>
);

// Selectable payment cards. `value` / `onChange` use the option label.
export const PaymentOptions = ({ options, value, onChange, name = "payment" }) => (
  <div role="radiogroup" className="grid gap-3 sm:grid-cols-2">
    {options?.map((option) => {
      const checked = value === option.label;
      return (
        <label
          key={option.id}
          className={`relative flex cursor-pointer items-center gap-3 rounded-xl border p-3.5 transition-colors ${
            checked
              ? "border-[#0C3F8E] bg-[#0C3F8E]/[0.04] ring-1 ring-[#0C3F8E] dark:border-[#7FB2FF] dark:ring-[#7FB2FF]"
              : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
          }`}
        >
          <input
            type="radio"
            name={name}
            value={option.label}
            checked={checked}
            onChange={() => onChange(option.label)}
            className="sr-only"
          />
          <span className="flex h-10 w-12 shrink-0 items-center justify-center rounded-lg border border-gray-100 bg-[#FFFFFF] p-1">
            <Image
              src={option.icon}
              alt=""
              width={40}
              height={28}
              className="h-7 w-auto object-contain"
            />
          </span>
          <span className="flex-1 text-sm font-medium text-gray-900">
            {option.label}
          </span>
          <span
            className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border ${
              checked
                ? "border-[#0C3F8E] bg-[#0C3F8E] text-white dark:border-[#7FB2FF] dark:bg-[#7FB2FF]"
                : "border-gray-300"
            }`}
          >
            {checked && <HiCheck className="text-xs" />}
          </span>
        </label>
      );
    })}
  </div>
);

const fieldClass =
  "block w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 placeholder:text-gray-400 transition focus:border-[#0C3F8E]/50 focus:outline-none focus:ring-4 focus:ring-[#0C3F8E]/10";

export const TextField = ({ label, required, multiline, className = "", ...props }) => (
  <label className={`block ${className}`}>
    <span className="mb-1.5 block text-sm font-medium text-gray-700">
      {label}
      {required && <span className="ml-0.5 text-[#D92D20]">*</span>}
    </span>
    {multiline ? (
      <textarea rows={3} required={required} className={`${fieldClass} resize-none`} {...props} />
    ) : (
      <input required={required} className={fieldClass} {...props} />
    )}
  </label>
);

// Right-hand summary card: items, price rows and the place-order button.
export const SummaryCard = ({ title = "Order summary", meta, children, footer }) => (
  <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm shadow-gray-900/[0.03]">
    <div className="flex items-baseline justify-between gap-3 border-b border-gray-100 px-5 py-4">
      <h2 className="text-base font-semibold text-gray-900">{title}</h2>
      {meta && <span className="text-sm text-gray-500">{meta}</span>}
    </div>
    <div className="px-5 py-4">{children}</div>
    {footer && <div className="border-t border-gray-100 bg-gray-50/60 px-5 py-4">{footer}</div>}
  </section>
);

// Compact read-only item row for summaries.
export const SummaryItem = ({ image, title, meta, quantity, total, onRemove }) => (
  <li className="flex items-center gap-3 py-3 first:pt-0 last:pb-0">
    <span className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg border border-gray-100 bg-gray-50">
      <Image
        src={image || "/png/dummyImage.png"}
        alt={title || "Product"}
        fill
        sizes="56px"
        className="object-cover"
      />
      <span className="absolute -right-0 -top-0 flex h-5 min-w-5 items-center justify-center rounded-bl-lg bg-[#101828]/80 px-1 text-[10px] font-semibold text-white">
        {quantity}
      </span>
    </span>
    <span className="min-w-0 flex-1">
      <span className="line-clamp-2 text-sm font-medium leading-snug text-gray-900">
        {title}
      </span>
      {meta && <span className="mt-0.5 block text-xs text-gray-500">{meta}</span>}
    </span>
    <span className="flex shrink-0 flex-col items-end gap-1">
      <span className="text-sm font-semibold tabular-nums text-gray-900">
        {total}
      </span>
      {onRemove && (
        <button
          type="button"
          onClick={onRemove}
          className="text-xs font-medium text-gray-400 transition-colors hover:text-[#D92D20]"
        >
          Remove
        </button>
      )}
    </span>
  </li>
);

export const CheckoutEmpty = ({ href, label = "Continue shopping" }) => (
  <div className="mx-auto flex min-h-[50vh] max-w-md items-center justify-center rounded-2xl border border-dashed border-gray-200 bg-white">
    <CartEmpty
      text="There is nothing to check out yet."
      action={
        <Link
          href={href}
          className="inline-flex rounded-full bg-[#0C3F8E] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#0A3478]"
        >
          {label}
        </Link>
      }
    />
  </div>
);
