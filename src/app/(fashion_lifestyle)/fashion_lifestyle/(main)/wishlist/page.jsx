import React from "react";
import Image from "next/image";

const page = () => {
  return (
    <div className="min-h-content flex justify-center items-center">
      <div>
        <Image
          className="w-full"
          src="/images/empty-wishlist.webp"
          alt="empty-wishlist"
          height={500}
          width={750}
        />

        <p className="text-2xl text-primary text-center font-medium">
          Your wishlist is empty!
        </p>
      </div>
    </div>
  );
};

export default page;
