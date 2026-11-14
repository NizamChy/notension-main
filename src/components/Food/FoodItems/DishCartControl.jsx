"use client";

import React from "react";
import { HiMinus, HiPlus } from "react-icons/hi";

// Add / quantity control for a dish. With quantity 0 it is an add button,
// otherwise a "− qty +" stepper. Handlers receive the click event (callers
// stop propagation so the card underneath does not open).
// - variant="overlay": round button that sits on the dish photo.
// - variant="inline": full-size pill for the details modal / page.
const DishCartControl = ({
  quantity = 0,
  onAdd,
  onIncrement,
  onDecrement,
  disabled = false,
  name = "item",
  variant = "overlay",
}) => {
  const overlay = variant === "overlay";

  if (quantity < 1) {
    return overlay ? (
      <button
        type="button"
        onClick={onAdd}
        disabled={disabled}
        aria-label={`Add ${name} to cart`}
        className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 bg-[#FFFFFF] text-[#0C3F8E] shadow-md shadow-gray-900/10 transition hover:scale-105 hover:bg-[#0C3F8E] hover:text-white disabled:opacity-60"
      >
        <HiPlus className="text-lg" />
      </button>
    ) : null;
  }

  return (
    <div
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
      }}
      className={`inline-flex items-center rounded-full bg-[#0C3F8E] text-white shadow-md shadow-[#0C3F8E]/25 ${
        overlay ? "h-10" : "h-12"
      }`}
    >
      <button
        type="button"
        onClick={onDecrement}
        disabled={disabled}
        aria-label={`Remove one ${name}`}
        className={`flex items-center justify-center rounded-full transition-colors hover:bg-white/15 disabled:opacity-60 ${
          overlay ? "h-10 w-10" : "h-12 w-12"
        }`}
      >
        <HiMinus />
      </button>
      <span
        aria-live="polite"
        className={`text-center font-semibold tabular-nums ${
          overlay ? "min-w-5 text-sm" : "min-w-8 text-base"
        }`}
      >
        {quantity}
      </span>
      <button
        type="button"
        onClick={onIncrement}
        disabled={disabled}
        aria-label={`Add one more ${name}`}
        className={`flex items-center justify-center rounded-full transition-colors hover:bg-white/15 disabled:opacity-60 ${
          overlay ? "h-10 w-10" : "h-12 w-12"
        }`}
      >
        <HiPlus />
      </button>
    </div>
  );
};

export default DishCartControl;
