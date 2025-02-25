"use client";

import React from "react";
import { useSelector } from "react-redux";
import { CgProfile } from "react-icons/cg";

const UserProfile = () => {
  const { userInfo } = useSelector((state) => state.user);

  return (
    <div className="flex justify-center items-center">
      <div className="text-center space-y-1">
        <div className="flex justify-center">
          <CgProfile className="text-8xl text-primary my-3" />
        </div>

        <p className="font-medium text-base lg:text-2xl text-primary">
          Name: {userInfo?.customer_name}
        </p>
        <p className="text-sm md:text-base lg:text-xl text-mediumGray">
          Address: {userInfo?.customer_address}
        </p>
        <p className="text-sm md:text-base lg:text-xl text-deepGray">
          Phone: {userInfo?.contact_no}
        </p>
      </div>
    </div>
  );
};

export default UserProfile;
