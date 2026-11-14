import React from "react";

const FilterCheckbox = ({ label, checked, onChange, disabled, swatch }) => {
  return (
    <label
      className={`flex min-h-9 items-center gap-2.5 rounded-lg px-1 text-sm transition-colors ${
        disabled
          ? "cursor-not-allowed text-gray-500"
          : "cursor-pointer text-gray-700 hover:text-gray-900"
      }`}
    >
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        disabled={disabled}
        className="h-4 w-4 shrink-0 cursor-pointer rounded border-gray-300 accent-[#0C3F8E] disabled:cursor-not-allowed"
      />
      {swatch && (
        <span
          aria-hidden
          className="h-4 w-4 shrink-0 rounded-full border border-gray-300"
          style={{ background: swatch }}
        />
      )}
      <span className={`min-w-0 truncate ${checked ? "font-medium text-gray-900" : ""}`}>
        {label}
      </span>
    </label>
  );
};

export default FilterCheckbox;
