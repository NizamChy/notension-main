import React from "react";
import Image from "next/image";

const NoConnection = () => {
  return (
    <div className="flex justify-center min-h-screen items-center">
      <div>
        <Image
          src="/png/no-connection.png"
          width={619}
          height={434}
          alt="no-connection"
          className="rounded-lg"
        />
      </div>
    </div>
  );
};

export default NoConnection;
