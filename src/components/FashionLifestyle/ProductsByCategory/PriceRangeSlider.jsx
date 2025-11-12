"use client";

import React from "react";

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
    <div>
      <h3 className="font-medium mb-3">Price Range</h3>
      <div className="px-2">
        <div className="flex justify-between mb-2 text-sm text-gray-600">
          <span>৳{priceRange[0]}</span>
          <span>৳{priceRange[1]}</span>
        </div>
        <div className="relative h-6">
          <div className="absolute inset-0 bg-gray-300 rounded h-1 top-2" />

          <div
            className="absolute bg-blue-500 h-1 top-2 rounded"
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
            className="absolute w-full pointer-events-none appearance-none h-6 bg-transparent [&::-webkit-slider-thumb]:pointer-events-auto"
          />

          <input
            type="range"
            min={minLimit}
            max={maxLimit}
            value={priceRange[1]}
            onChange={handleMaxChange}
            className="absolute w-full pointer-events-none appearance-none h-6 bg-transparent [&::-webkit-slider-thumb]:pointer-events-auto"
          />
        </div>
      </div>
    </div>
  );
};

export default PriceRangeSlider;
