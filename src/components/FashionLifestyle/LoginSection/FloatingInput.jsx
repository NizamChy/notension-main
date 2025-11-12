"use client";

import React, { useState } from "react";

const FloatingInput = ({
  id,
  label,
  value,
  onChange,
  type = "text",
  multiline = false,
  size = "text-base",
}) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div className="relative">
      {multiline ? (
        <textarea
          id={id}
          value={value}
          onChange={onChange}
          className={`block w-full px-4 py-2 bg-transparent border-2 rounded-md appearance-none outline-none transition-all resize-none
                      ${
                        isFocused ? "border-blue-500" : "border-gray-300"
                      } ${size}`}
          onFocus={() => setIsFocused(true)}
          onBlur={(e) => setIsFocused(e.target.value.length > 0)}
          rows={4}
        />
      ) : (
        <input
          type={type}
          id={id}
          value={value}
          onChange={onChange}
          className={`block w-full px-4 py-2 bg-transparent border-2 rounded-md appearance-none outline-none transition-all
                      ${
                        isFocused ? "border-blue-500" : "border-gray-300"
                      } ${size}`}
          onFocus={() => setIsFocused(true)}
          onBlur={(e) => setIsFocused(e.target.value.length > 0)}
        />
      )}
      <label
        htmlFor={id}
        className={`absolute left-4 transition-all pointer-events-none text-sm bg-white rounded-lg px-1 
                    ${
                      isFocused || value
                        ? "-top-2 text-xs text-blue-500"
                        : `top-3 ${size} text-gray-400`
                    }
                  `}
      >
        {label}
      </label>
    </div>
  );
};

export default FloatingInput;
