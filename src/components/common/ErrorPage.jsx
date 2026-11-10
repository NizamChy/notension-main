import React from "react";
import Image from "next/image";

const ErrorPage = ({ onRetry }) => {
  return (
    <div className="w-screen h-screen flex flex-col justify-center items-center overflow-hidden bg-[#E9F8FF]">
      <div className="relative w-4/5 h-4/5">
        <Image
          src="/png/error-page.png"
          alt="Error Page"
          className="object-contain"
          fill
        />
      </div>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="mb-8 px-6 py-2 rounded-md bg-primary text-white font-medium hover:opacity-90"
        >
          Try again
        </button>
      )}
    </div>
  );
};

export default ErrorPage;
