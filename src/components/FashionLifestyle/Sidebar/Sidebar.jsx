"use client";

import React from "react";
import { useEffect } from "react";
import SidebarItems from "./SidebarItems";
import { IoClose } from "react-icons/io5";

const Sidebar = ({ isOpen, onClose }) => {
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isOpen && !event.target.closest(".sidebar-container")) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

  return (
    <>
      <div
        className={`fixed inset-0 bg-black/50 z-40 transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      />

      <div
        className={`sidebar-container fixed top-0 left-0 h-full w-[75%] lg:w-96 bg-white shadow-lg z-50 transform transition-all duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="p-2">
          <div className="flex items-center justify-between p-2">
            <h2 className="text-xl font-bold">Categories</h2>

            <button onClick={() => onClose()}>
              <IoClose className="text-2xl" />
            </button>
          </div>

          <SidebarItems onClose={onClose} />
        </div>
      </div>
    </>
  );
};

export default Sidebar;
