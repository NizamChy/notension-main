"use client";

import { useEffect } from "react";
import toast, { ToastBar, Toaster, useToasterStore } from "react-hot-toast";
import { HiXMark } from "react-icons/hi2";
import { TOAST_ACCENT, TOAST_DURATION } from "@/utils/notify";

// At most this many toasts on screen; older ones are dismissed.
const MAX_VISIBLE = 3;

const toastOptions = {
  duration: TOAST_DURATION.info,
  // A card that follows the theme: surface, text and border colours come
  // from the CSS variables in globals.css, so dark mode works too.
  style: {
    background: "rgb(var(--surface))",
    color: "var(--foreground)",
    border: "1px solid rgb(var(--c-gray-200))",
    borderLeft: `4px solid ${TOAST_ACCENT.info}`,
    borderRadius: "12px",
    boxShadow:
      "0 10px 30px -8px rgba(15, 23, 42, 0.18), 0 2px 6px rgba(15, 23, 42, 0.06)",
    padding: "10px 8px 10px 14px",
    fontSize: "14px",
    lineHeight: "1.45",
    fontWeight: 500,
    maxWidth: "min(420px, calc(100vw - 32px))",
  },
  success: {
    duration: TOAST_DURATION.success,
    style: { borderLeft: `4px solid ${TOAST_ACCENT.success}` },
    iconTheme: { primary: TOAST_ACCENT.success, secondary: "#ffffff" },
  },
  error: {
    duration: TOAST_DURATION.error,
    style: { borderLeft: `4px solid ${TOAST_ACCENT.error}` },
    iconTheme: { primary: TOAST_ACCENT.error, secondary: "#ffffff" },
  },
  loading: {
    style: { borderLeft: `4px solid ${TOAST_ACCENT.loading}` },
    iconTheme: { primary: TOAST_ACCENT.loading, secondary: "rgb(var(--c-gray-200))" },
  },
};

const AppToaster = () => {
  const { toasts } = useToasterStore();

  // Newest toasts come first: keep the first few, dismiss the rest.
  useEffect(() => {
    toasts
      .filter((t) => t.visible)
      .slice(MAX_VISIBLE)
      .forEach((t) => toast.dismiss(t.id));
  }, [toasts]);

  return (
    <Toaster
      position="top-center"
      gutter={10}
      containerStyle={{ top: 16, left: 16, right: 16 }}
      toastOptions={toastOptions}
    >
      {(t) => (
        <ToastBar toast={t}>
          {({ icon, message }) => (
            <>
              {icon}
              <div className="min-w-0 flex-1 break-words [&>div]:m-0! [&>div]:justify-start! [&>div]:px-2.5!">
                {message}
              </div>
              {t.type !== "loading" && (
                <button
                  type="button"
                  onClick={() => toast.dismiss(t.id)}
                  aria-label="Dismiss notification"
                  className="ml-1 shrink-0 self-start rounded-md p-1 text-gray-400 transition hover:bg-gray-100 hover:text-gray-700 focus-visible:outline-2 focus-visible:outline-primary"
                >
                  <HiXMark size={18} aria-hidden="true" />
                </button>
              )}
            </>
          )}
        </ToastBar>
      )}
    </Toaster>
  );
};

export default AppToaster;
