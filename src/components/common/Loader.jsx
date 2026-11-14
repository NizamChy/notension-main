import React from "react";

// Full-area page loader: a navy ring with an orange arc. Fills the content
// height so the footer does not jump while data loads.
const Loader = () => {
  return (
    <div
      role="status"
      aria-live="polite"
      className="flex min-h-content w-full flex-col items-center justify-center gap-3"
    >
      <span className="relative h-11 w-11">
        <span className="absolute inset-0 rounded-full border-4 border-gray-200" />
        <span className="absolute inset-0 animate-spin rounded-full border-4 border-transparent border-l-[#EB5C2F] border-t-[#0C3F8E] dark:border-t-[#7FB2FF]" />
      </span>
      <span className="text-sm font-medium text-gray-500">Loading…</span>
    </div>
  );
};

export default Loader;
