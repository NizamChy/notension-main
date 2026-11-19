import React, { useId } from "react";
import { HiChevronDown } from "react-icons/hi";

const FilterSection = ({ title, children, isOpen, onClick }) => {
  const panelId = useId();

  return (
    <div className="border-b border-gray-200 last:border-b-0">
      <button
        type="button"
        onClick={onClick}
        aria-expanded={!!isOpen}
        aria-controls={panelId}
        className="flex min-h-12 w-full items-center justify-between gap-3 text-left text-sm font-semibold text-gray-900"
      >
        {title}
        <HiChevronDown
          className={`text-lg text-gray-500 transition-transform duration-300 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      <div
        id={panelId}
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          isOpen ? "max-h-[28rem] pb-4 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="max-h-[26rem] overflow-y-auto">{children}</div>
      </div>
    </div>
  );
};

export default FilterSection;
