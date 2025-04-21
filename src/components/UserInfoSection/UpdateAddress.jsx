"use client";

import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { CgProfile } from "react-icons/cg";
import React, { useEffect, useState } from "react";
import { useUser } from "@/hooks/fetch-data/useUser";
import LoginModalDetails from "../Cart/LoginModalDetails";
import FloatingInput from "../LoginSection/FloatingInput";
import CommonModal from "../shared/CommonModal/CommonModal";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";

const UpdateAddress = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { progressing, userInfo, handleDataChange, registerUser } = useUser();
  const { userInfo: savedUserInfo } = useSelector((state) => state.user);

  const handleUpdateUser = (e) => {
    e.preventDefault();
    e.stopPropagation();

    registerUser();

    if (!progressing) {
      return toast.success("আপনার তথ্য আপডেট করা হয়েছে", {
        position: "top-center",
      });
    }
  };

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  useEffect(() => {
    if (!savedUserInfo?._id) {
      openModal();
    }
  }, []);

  return (
    <>
      {savedUserInfo?._id && (
        <div className="flex flex-col lg:flex-row gap-10 lg:gap-20 justify-center items-center">
          <div className="px-4">
            <div className="mx-auto mt-20 lg:mt-0 text-center space-y-1 max-w-md border rounded-lg p-4">
              <div className="flex justify-center">
                <CgProfile className="text-8xl text-primary" />
              </div>

              <p className="font-medium text-base lg:text-xl text-primary">
                Name: {savedUserInfo?.customer_name}
              </p>
              <p className="text-sm md:text-base lg:text-lg text-mediumGray">
                Address: {savedUserInfo?.customer_address}
              </p>
              <p className="text-sm md:text-base lg:text-lg text-deepGray">
                Phone: {savedUserInfo?.contact_no}
              </p>
            </div>
          </div>

          <div className="">
            <div className="w-full lg:w-80 lg:py-32 min-h-content px-4">
              <p className="text-center font-medium text-secondary text-2xl mb-3">
                Update Address
              </p>

              <div className="py-4">
                <FloatingInput
                  label="Name"
                  id="customer_name"
                  value={userInfo?.customer_name || ""}
                  onChange={(e) =>
                    handleDataChange(e.target.value, "customer_name")
                  }
                />
              </div>

              <div className="py-4">
                <FloatingInput
                  label="Address"
                  id="customer_address"
                  multiline={true}
                  value={userInfo?.customer_address || ""}
                  onChange={(e) =>
                    handleDataChange(e.target.value, "customer_address")
                  }
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
                  className="mt-4 px-4 bg-primary text-white rounded-md w-full"
                  disabled={progressing}
                >
                  {/* {progressing ? "Please wait..." : "Save"} */}

                  {progressing ? (
                    <div className="flex justify-center items-center">
                      <p>Please wait</p>
                      <DotLottieReact
                        src="https://lottie.host/6958d316-ea05-4122-9dff-1d526f59b3ca/ZilAm5yZWu.lottie"
                        loop
                        autoplay
                        className="size-10"
                      />
                    </div>
                  ) : (
                    <>
                      <p className="py-2">Save</p>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {isModalOpen && (
        <>
          <CommonModal isOpen={isModalOpen} onClose={closeModal}>
            <LoginModalDetails onClose={closeModal} type="private-route" />
          </CommonModal>
        </>
      )}
    </>
  );
};

export default UpdateAddress;
