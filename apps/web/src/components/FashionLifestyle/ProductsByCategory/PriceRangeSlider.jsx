"use client";

import React from "react";

const THUMB =
  "[&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-[#0C3F8E] [&::-webkit-slider-thumb]:bg-[#FFFFFF] [&::-webkit-slider-thumb]:shadow [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:cursor-pointer [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-[#0C3F8E] [&::-moz-range-thumb]:bg-[#FFFFFF]";

const taka = (n) => `৳${(Number(n) || 0).toLocaleString("en-US")}`;

const PriceRangeSlider = ({ priceRange, handlePriceChange }) => {
  const minLimit = 0;
  const maxLimit = 25000;

  const handleMinChange = (e) => {
    const value = Math.min(Number(e.target.value), priceRange[1] - 1);
    handlePriceChange(value, priceRange[1]);
  };

  const handleMaxChange = (e) => {
    const value = Math.max(Number(e.target.value), priceRange[0] + 1);
    handlePriceChange(priceRange[0], value);
  };

  const leftPercent = (priceRange[0] / maxLimit) * 100;
  const widthPercent = ((priceRange[1] - priceRange[0]) / maxLimit) * 100;

  return (
    <div className="pt-4">
      <h3 className="mb-3 text-sm font-semibold text-gray-900">Price range</h3>
      <div className="mb-3 flex items-center gap-2 text-sm">
        <span className="flex-1 rounded-full border border-gray-200 px-3 py-1.5 text-center tabular-nums text-gray-700">
          {taka(priceRange[0])}
        </span>
        <span className="text-gray-400">–</span>
        <span className="flex-1 rounded-full border border-gray-200 px-3 py-1.5 text-center tabular-nums text-gray-700">
          {taka(priceRange[1])}
        </span>
      </div>
      <div className="relative mx-2 h-8">
        <div className="absolute inset-x-0 top-[14px] h-1 rounded-full bg-gray-200" />

        <div
          className="absolute top-[14px] h-1 rounded-full bg-[#0C3F8E] dark:bg-[#7FB2FF]"
          style={{
            left: `${leftPercent}%`,
            width: `${widthPercent}%`,
          }}
        />

        <input
          type="range"
          min={minLimit}
          max={maxLimit}
          value={priceRange[0]}
          onChange={handleMinChange}
          aria-label="Minimum price"
          className={`pointer-events-none absolute inset-x-0 h-8 w-full appearance-none bg-transparent ${THUMB}`}
        />

        <input
          type="range"
          min={minLimit}
          max={maxLimit}
          value={priceRange[1]}
          onChange={handleMaxChange}
          aria-label="Maximum price"
          className={`pointer-events-none absolute inset-x-0 h-8 w-full appearance-none bg-transparent ${THUMB}`}
        />
      </div>
    </div>
  );
};

export default PriceRangeSlider;
