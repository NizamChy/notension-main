import React from "react";
import Image from "next/image";

const NoItemFound = () => {
  return (
    <div className="min-h-[50vh] flex justify-center items-center w-full">
      <div>
        <Image
          width={500}
          height={500}
          src="/png/no-item-found.png"
          alt="notension"
          className="object-cover w-80 rounded-lg rounded-b-none"
        />

        <p className="text-center text-deepGray font-semibold text-xl bg-white pb-3 rounded-b-lg">
          No item found!
        </p>
      </div>
    </div>
  );
};

export default NoItemFound;
