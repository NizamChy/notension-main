"use client";

import Map from "../Map/Map";
import { useEffect, useRef } from "react";

const MapModal = ({ isOpen, onCloseModal }) => {
  const modalRef = useRef(null);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        onCloseModal();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);

      modalRef.current?.focus();
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onCloseModal]);

  return (
    <div
      onClick={onCloseModal}
      className={`fixed z-10 inset-0 grid place-items-center bg-black/50 transition-opacity duration-200 outline-none ${
        isOpen ? "visible opacity-100" : "invisible opacity-0"
      }`}
      aria-modal="true"
      role="dialog"
    >
      <div
        ref={modalRef}
        onClick={(e) => e.stopPropagation()}
        className={`relative w-[90%] md:w-11/12 lg:w-1/2 bg-white p-6 rounded-lg shadow-lg transition-all duration-300 outline-none ${
          isOpen ? "scale-100 opacity-100" : "scale-110 opacity-0"
        }`}
        tabIndex={-1}
      >
        <button
          onClick={onCloseModal}
          className="absolute -top-4 -right-4 p-2 rounded-full bg-white text-gray-500 hover:text-primaryFood"
          aria-label="Close modal"
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

        <Map onCloseModal={onCloseModal} />
      </div>
    </div>
  );
};

export default MapModal;
