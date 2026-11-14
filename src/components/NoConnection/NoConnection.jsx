import React from "react";
import { MdWifiOff } from "react-icons/md";

const NoConnection = () => {
  return (
    <div className="flex min-h-content w-full items-center justify-center px-4 py-12">
      <div className="flex w-full max-w-md flex-col items-center rounded-2xl border border-gray-200 bg-white px-6 py-12 text-center shadow-sm shadow-gray-900/[0.03]">
        <span className="flex h-16 w-16 items-center justify-center rounded-full bg-[#F79009]/10 text-3xl text-[#F79009]">
          <MdWifiOff aria-hidden="true" />
        </span>
        <p className="mt-4 text-lg font-semibold text-gray-900">
          You&apos;re offline
        </p>
        <p className="mt-1 max-w-xs text-sm text-gray-500">
          Check your internet connection and refresh the page.
        </p>
      </div>
    </div>
  );
};

export default NoConnection;
