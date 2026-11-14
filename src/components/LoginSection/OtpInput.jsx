"use client";

import React, { useRef } from "react";

// One box per digit. `value` is the code as a string; `onChange` gets the
// new string. Supports typing, backspace, arrow keys and pasting the code.
const OtpInput = ({ value = "", onChange, length = 4, idPrefix = "otp" }) => {
  const inputs = useRef([]);
  const digits = Array.from({ length }, (_, i) => (value[i] || "").trim());

  const focusBox = (index) => {
    const el = inputs.current[Math.max(0, Math.min(length - 1, index))];
    el?.focus();
    el?.select();
  };

  // Empty boxes in the middle are kept as spaces so digits stay in place;
  // trailing empties are dropped, so an untouched code is "".
  const setDigits = (next) =>
    onChange(
      next
        .map((d) => d || " ")
        .join("")
        .slice(0, length)
        .trimEnd()
    );

  const handleChange = (index, e) => {
    let typed = e.target.value.replace(/\D/g, "");
    if (!typed) {
      const next = [...digits];
      next[index] = "";
      setDigits(next);
      return;
    }
    // Typing next to an existing digit: keep only the new one.
    if (digits[index] && typed.length === 2 && typed.includes(digits[index])) {
      typed = typed.replace(digits[index], "");
    }
    // Autofill can drop the whole code into one box.
    const next = [...digits];
    typed.split("").forEach((d, i) => {
      if (index + i < length) next[index + i] = d;
    });
    setDigits(next);
    focusBox(index + typed.length);
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !digits[index] && index > 0) {
      e.preventDefault();
      const next = [...digits];
      next[index - 1] = "";
      setDigits(next);
      focusBox(index - 1);
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      focusBox(index - 1);
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      focusBox(index + 1);
    }
  };

  const handlePaste = (e) => {
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "");
    if (!pasted) return;
    e.preventDefault();
    onChange(pasted.slice(0, length));
    focusBox(pasted.length);
  };

  return (
    <div className="flex justify-center gap-2 sm:gap-3" role="group" aria-label="One-time code">
      {digits.map((digit, index) => (
        <input
          key={index}
          id={`${idPrefix}-${index}`}
          ref={(el) => (inputs.current[index] = el)}
          type="text"
          inputMode="numeric"
          autoComplete={index === 0 ? "one-time-code" : "off"}
          maxLength={length}
          aria-label={`Digit ${index + 1}`}
          value={digit}
          onChange={(e) => handleChange(index, e)}
          onKeyDown={(e) => handleKeyDown(index, e)}
          onPaste={handlePaste}
          onFocus={(e) => e.target.select()}
          className={`h-14 w-12 rounded-xl border bg-white text-center text-xl font-semibold tabular-nums text-gray-900 outline-none transition focus:border-[#0C3F8E]/60 focus:ring-4 focus:ring-[#0C3F8E]/10 dark:focus:border-[#7FB2FF]/60 sm:w-14 ${
            digit ? "border-gray-300" : "border-gray-200"
          }`}
        />
      ))}
    </div>
  );
};

export default OtpInput;
