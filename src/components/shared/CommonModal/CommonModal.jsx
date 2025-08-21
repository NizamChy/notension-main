"use client";

import React, { useEffect, useState } from "react";

const CommonModal = ({ isOpen, onClose, children, className = "" }) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") onClose();
    };

    const disableScroll = () => {
      document.body.style.overflow = "hidden";
    };

    const enableScroll = () => {
      document.body.style.overflow = "";
    };

    if (isOpen) {
      disableScroll();
      document.addEventListener("keydown", handleEscape);
    } else {
      enableScroll();
    }

    return () => {
      enableScroll();
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen, onClose]);

  if (!isOpen && !mounted) return null;

  return (
    <>
      <div
        onClick={onClose}
        className={`fixed inset-0 z-50 flex items-center justify-center bg-black/50 transition-opacity duration-200 ${
          isOpen ? "visible opacity-100" : "invisible opacity-0"
        }`}
      >
        <div
          onClick={(e) => e.stopPropagation()}
          className={`relative w-[87%] md:w-full max-w-md bg-white p-3 md:p-6 rounded-lg shadow-lg transition-transform duration-300 ${
            isOpen ? "scale-100 opacity-100" : "scale-110 opacity-0"
          } ${className}`}
        >
          <button
            onClick={onClose}
            className="absolute -top-4 -right-4 p-2 rounded-full bg-white text-gray-500 hover:text-primaryFood"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              ></path>
            </svg>
          </button>

          {children}
        </div>
      </div>
    </>
  );
};

export default CommonModal;
