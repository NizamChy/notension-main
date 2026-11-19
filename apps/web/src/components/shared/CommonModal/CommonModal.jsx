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
          role="dialog"
          aria-modal="true"
          className={`relative w-[90%] md:w-full max-w-md bg-white p-4 md:p-6 rounded-2xl border border-gray-200 shadow-2xl shadow-gray-900/20 transition-transform duration-300 ${
            isOpen ? "scale-100 opacity-100" : "scale-110 opacity-0"
          } ${className}`}
        >
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="absolute -top-3 -right-3 z-10 flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-500 shadow-md transition-colors hover:bg-gray-50 hover:text-gray-900"
          >
            <svg
              className="w-5 h-5"
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
