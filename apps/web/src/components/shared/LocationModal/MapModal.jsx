"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { HiXMark } from "react-icons/hi2";
import LocationPicker from "../Map/LocationPicker";
import { bumpLocationVersion } from "../Map/locationRefresh";

/**
 * Delivery location dialog (tablet and desktop; phones use the
 * /get-mobile-location page). onConfirmed runs after a location is saved,
 * for callers that continue somewhere afterwards.
 */
const MapModal = ({ isOpen, onCloseModal, onConfirmed }) => {
  const dialogRef = useRef(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    if (!isOpen) return;

    const onKeyDown = (e) => {
      // Escape inside the search list closes the list first.
      if (e.key === "Escape" && !document.querySelector(".pac-container:not([style*='display: none'])")) {
        onCloseModal();
      }
    };
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", onKeyDown);
    dialogRef.current?.focus();
    const frame = requestAnimationFrame(() => setShown(true));

    return () => {
      cancelAnimationFrame(frame);
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKeyDown);
      setShown(false);
    };
  }, [isOpen, onCloseModal]);

  if (!isOpen || typeof document === "undefined") return null;

  const handleConfirm = ({ changed }) => {
    onCloseModal();
    onConfirmed?.();
    // Reload the page's lists for the new district.
    if (changed) bumpLocationVersion();
  };

  return createPortal(
    <div
      onClick={onCloseModal}
      className={`fixed inset-0 z-50 flex items-end justify-center bg-gray-950/50 backdrop-blur-[2px] transition-opacity duration-200 sm:items-center sm:p-4 ${
        shown ? "opacity-100" : "opacity-0"
      }`}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="location-dialog-title"
        tabIndex={-1}
        onClick={(e) => e.stopPropagation()}
        className={`flex max-h-[100dvh] w-full flex-col overflow-hidden rounded-t-3xl bg-white shadow-2xl shadow-gray-950/30 outline-none transition-transform duration-300 ease-out sm:max-h-[calc(100dvh-2rem)] sm:max-w-2xl sm:rounded-3xl ${
          shown ? "translate-y-0 sm:scale-100" : "translate-y-6 sm:translate-y-0 sm:scale-[0.97]"
        }`}
      >
        <header className="flex items-start justify-between gap-4 px-5 pb-3 pt-5 sm:px-6">
          <div>
            <h2 id="location-dialog-title" className="text-lg font-semibold text-gray-900">
              Choose your delivery location
            </h2>
            <p className="mt-0.5 text-sm text-gray-500">
              Search, or move the map so the pin sits on your address.
            </p>
          </div>
          <button
            type="button"
            onClick={onCloseModal}
            aria-label="Close"
            className="-mr-2 -mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-900"
          >
            <HiXMark className="text-xl" />
          </button>
        </header>

        <div className="min-h-0 overflow-y-auto">
          <LocationPicker variant="modal" onConfirm={handleConfirm} />
        </div>
      </div>
    </div>,
    document.body,
  );
};

export default MapModal;
