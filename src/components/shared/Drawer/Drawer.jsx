"use client";

import React, { useEffect, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import { HiX } from "react-icons/hi";

const noopSubscribe = () => () => {};

// Slide-in panel used for carts and category menus.
// Rendered into <body> so a parent's transform/filter or z-index can't
// trap it. Closes on Esc, overlay click or the X button.
// - `side`: "left" | "right"
// - `title`, `subtitle`: header text; `headerExtra`: node under the header
// - `footer`: sticky bottom area (totals, buttons)
const Drawer = ({
  isOpen,
  onClose,
  side = "right",
  title,
  subtitle,
  headerExtra,
  footer,
  children,
  widthClass = "w-[88%] max-w-[420px]",
  bodyClass = "px-5 py-4",
}) => {
  // Only portal on the client (document is missing during SSR).
  const isClient = useSyncExternalStore(
    noopSubscribe,
    () => true,
    () => false,
  );

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e) => e.key === "Escape" && onClose();
    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = overflow;
      document.removeEventListener("keydown", onKey);
    };
  }, [isOpen, onClose]);

  if (!isClient) return null;

  const hidden = side === "left" ? "-translate-x-full" : "translate-x-full";

  return createPortal(
    <div
      className={`fixed inset-0 z-[60] ${isOpen ? "" : "pointer-events-none"}`}
      aria-hidden={!isOpen}
    >
      <div
        onClick={onClose}
        className={`absolute inset-0 bg-gray-950/50 backdrop-blur-[2px] transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "opacity-0"
        }`}
      />

      <aside
        role="dialog"
        aria-modal="true"
        aria-label={typeof title === "string" ? title : undefined}
        className={`absolute inset-y-0 ${side === "left" ? "left-0" : "right-0"} ${widthClass} flex flex-col bg-white shadow-2xl shadow-gray-950/20 transition-transform duration-300 ease-out ${
          isOpen ? "translate-x-0" : hidden
        }`}
      >
        <header className="flex items-start justify-between gap-3 border-b border-gray-200 px-5 py-4">
          <div className="min-w-0">
            <h2 className="truncate text-lg font-semibold text-gray-900">
              {title}
            </h2>
            {subtitle && (
              <p className="mt-0.5 text-sm text-gray-500">{subtitle}</p>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="-mr-2 -mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xl text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-900"
          >
            <HiX />
          </button>
        </header>

        {headerExtra}

        <div
          className={`flex-1 overflow-y-auto overscroll-contain ${bodyClass}`}
        >
          {children}
        </div>

        {footer && (
          <footer className="border-t border-gray-200 bg-white px-5 pb-5 pt-4">
            {footer}
          </footer>
        )}
      </aside>
    </div>,
    document.body,
  );
};

export default Drawer;
