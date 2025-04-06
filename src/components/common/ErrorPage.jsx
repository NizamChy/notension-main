import React from "react";
import Image from "next/image";

const ErrorPage = () => {
  return (
    <div className="w-screen h-screen flex justify-center items-center overflow-hidden bg-[#E9F8FF]">
      <div className="relative w-4/5 h-4/5">
        <Image
          src="/png/error-page.png"
          alt="Error Page"
          className="object-contain"
          fill
        />
      </div>
    </div>
  );
};

export default ErrorPage;
