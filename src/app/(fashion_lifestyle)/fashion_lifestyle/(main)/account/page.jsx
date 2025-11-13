import React from "react";
// import { FaUserGear } from "react-icons/fa6";
import UserProfile from "@/components/UserInfoSection/UserProfile";

const page = () => {
  return (
    <div className="min-h-content flex justify-center items-center">
      {/* <div className="flex flex-col gap-5 justify-center items-center">
        <FaUserGear className="text-7xl text-primary animate-pulse" />

        <p className="text-primary font-medium text-2xl">
          Profile section coming soon..
        </p>
      </div> */}

      <UserProfile />
    </div>
  );
};

export default page;
