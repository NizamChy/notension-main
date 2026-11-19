"use client";

import React, { useState } from "react";

// Text field with a label that floats to the top when focused or filled.
// Extra props (inputMode, autoComplete, maxLength...) go to the field.
const FloatingInput = ({
  id,
  label,
  value,
  onChange,
  type = "text",
  multiline = false,
  size = "text-base",
  className = "",
  ...rest
}) => {
  const [isFocused, setIsFocused] = useState(false);
  // Tracks the DOM value too, for callers that leave `value` undefined.
  const [filled, setFilled] = useState(false);

  const hasValue =
    value !== undefined && value !== null
      ? String(value).length > 0
      : filled;
  const raised = isFocused || hasValue;

  const fieldClass = `block w-full appearance-none rounded-xl border bg-white px-4 pb-2 pt-6 text-gray-900 outline-none transition ${
    isFocused
      ? "border-[#0C3F8E]/60 ring-4 ring-[#0C3F8E]/10 dark:border-[#7FB2FF]/60 dark:ring-[#7FB2FF]/10"
      : "border-gray-200 hover:border-gray-300"
  } ${size} ${className}`;

  const handlers = {
    onFocus: () => setIsFocused(true),
    onBlur: (e) => {
      setIsFocused(false);
      setFilled(e.target.value.length > 0);
    },
  };

  return (
    <div className="relative">
      {multiline ? (
        <textarea
          id={id}
          value={value}
          onChange={onChange}
          rows={4}
          className={`${fieldClass} resize-none`}
          {...handlers}
          {...rest}
        />
      ) : (
        <input
          type={type}
          id={id}
          value={value}
          onChange={onChange}
          className={`${fieldClass} h-14`}
          {...handlers}
          {...rest}
        />
      )}
      <label
        htmlFor={id}
        className={`pointer-events-none absolute left-4 transition-all ${
          raised
            ? `top-2 text-xs font-medium ${
                isFocused ? "text-[#0C3F8E] dark:text-[#7FB2FF]" : "text-gray-500"
              }`
            : `top-4 ${size} text-gray-400`
        }`}
      >
        {label}
      </label>
    </div>
  );
};

export default FloatingInput;
