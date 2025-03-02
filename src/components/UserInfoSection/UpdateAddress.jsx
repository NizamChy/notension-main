"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/hooks/fetch-data/useUser";
import FloatingInput from "../LoginSection/FloatingInput";

const UpdateAddress = () => {
  const { progressing, userInfo, handleDataChange, registerUser } = useUser();

  const router = useRouter();

  const handleUpdateUser = (e) => {
    e.preventDefault();
    e.stopPropagation();

    registerUser();

    if (!progressing) {
      router?.push("/user/profile");
    }
  };

  return (
    <div className="max-w-md mx-auto py-32 min-h-content px-4">
      <p className="text-center font-medium text-secondary text-2xl mb-3">
        Update Address
      </p>

      <div className="py-4">
        <FloatingInput
          label="Name"
          id="customer_name"
          value={userInfo?.customer_name || ""}
          onChange={(e) => handleDataChange(e.target.value, "customer_name")}
        />
      </div>

      <div className="py-4">
        <FloatingInput
          label="Address"
          id="customer_address"
          multiline={true}
          value={userInfo?.customer_address || ""}
          onChange={(e) => handleDataChange(e.target.value, "customer_address")}
        />
      </div>

      <div className="py-4">
        <FloatingInput
          label="Alternative number"
          id="alternative_contact_no"
          value={userInfo?.alternative_contact_no || ""}
          onChange={(e) =>
            handleDataChange(e.target.value, "alternative_contact_no")
          }
        />
      </div>

      <div className="flex justify-center">
        <button
          onClick={(e) => handleUpdateUser(e)}
          className="mt-4 px-4 py-2 bg-primary text-white rounded-md w-full"
          disabled={progressing}
        >
          {progressing ? "Please wait..." : "Save"}
        </button>
      </div>
    </div>
  );
};

export default UpdateAddress;
