import LoginModalDetails from "@/components/Cart/LoginModalDetails";
import React from "react";

const page = () => {
  return (
    <div className="min-h-[80vh] flex justify-center items-center">
      <div className="lg:w-1/6">
        <LoginModalDetails type="login" />
      </div>
    </div>
  );
};

export default page;
