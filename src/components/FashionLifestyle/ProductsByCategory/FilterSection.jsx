import React from "react";
import { FaMinus, FaPlus } from "react-icons/fa6";

const FilterSection = ({ title, children, isOpen, onClick }) => {
  return (
    <div className="mb-6 overflow-hidden">
      <div
        className="flex justify-between items-center cursor-pointer"
        onClick={onClick}
      >
        <h3 className="font-medium">{title}</h3>
        <span className="text-sm text-gray-500 transition-transform duration-300">
          {isOpen ? <FaMinus /> : <FaPlus />}
        </span>
      </div>

      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          isOpen ? "max-h-96 opacity-100 mt-3" : "max-h-0 opacity-0"
        }`}
      >
        {children}
      </div>
    </div>
  );
};

export default FilterSection;
