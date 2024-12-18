import Image from "next/image";
import React from "react";

const NoStoreFound = () => {
  return (
    <div className="min-h-[50vh] flex justify-center items-center w-full">
      <div>
        <Image
          width={500}
          height={500}
          src="/png/store-not-found.png"
          alt="notension"
          className="object-cover w-80"
        />

        <p className="text-center text-xl lg:text-2xl font-semibold text-deepGray">
          No store found!
        </p>
      </div>
    </div>
  );
};

export default NoStoreFound;
