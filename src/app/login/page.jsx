import React from "react";
import LoginModalDetails from "@/components/Cart/LoginModalDetails";

const page = () => {
  return (
    <div className="min-h-content flex justify-center items-center mt-20">
      <div className="w-5/6 lg:w-[420px]">
        <LoginModalDetails type="login" />
      </div>
    </div>
  );
};

export default page;
