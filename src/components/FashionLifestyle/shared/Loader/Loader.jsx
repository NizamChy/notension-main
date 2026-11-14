import React from "react";

const Loader = ({ label = "Loading" }) => {
  return (
    <div
      role="status"
      className="flex min-h-[60vh] flex-col items-center justify-center gap-3"
    >
      <span className="h-10 w-10 animate-spin rounded-full border-[3px] border-gray-200 border-t-[#0C3F8E] dark:border-t-[#7FB2FF]" />
      <span className="text-sm text-gray-500">{label}…</span>
    </div>
  );
};

export default Loader;
