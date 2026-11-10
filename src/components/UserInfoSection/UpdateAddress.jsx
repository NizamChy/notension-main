"use client";

import toast from "react-hot-toast";
import { isLengthBetween } from "@/utils/validation";
import { useSelector } from "react-redux";
import { CgProfile } from "react-icons/cg";
import React, { useEffect, useState } from "react";
import { useUser } from "@/hooks/fetch-data/useUser";
import LoginModalDetails from "../LoginSection/LoginModalDetails";
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

    if (!isLengthBetween(userInfo?.customer_name, 3, 50)) {
      return toast("নাম কমপক্ষে ৩ অক্ষরের এবং সর্বাধিক ৫০ অক্ষরের হতে পারে!", {
        style: {
          border: "1px solid #FC8F1E",
        },
        icon: "ℹ️",
        iconTheme: {
          primary: "#FC8F1E",
          secondary: "#FFFAEE",
        },
      });
    }

    if (!isLengthBetween(userInfo?.customer_address, 5, 200)) {
      return toast(
        "ঠিকানা কমপক্ষে ৫ অক্ষরের এবং সর্বোচ্চ ২০০ অক্ষরের মধ্যে হতে হবে!",
        {
          style: {
            border: "1px solid #FC8F1E",
          },
          icon: "ℹ️",
          iconTheme: {
            primary: "#FC8F1E",
            secondary: "#FFFAEE",
          },
        }
      );
    }

    const success_message = "আপনার তথ্য আপডেট করা হয়েছে";
    registerUser(success_message);
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
        <div className="max-w-4xl mx-auto px-4 py-8 md:py-12 grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
          <div className="bg-white border border-gray-100 rounded-xl shadow-sm p-6 md:p-8">
            <div className="flex flex-col items-center text-center">
              <CgProfile className="text-7xl md:text-8xl text-primary" />
              <p className="mt-3 text-lg md:text-xl font-semibold text-primary break-words">
                {savedUserInfo?.customer_name}
              </p>
            </div>

            <dl className="mt-6 divide-y divide-gray-100 text-sm md:text-base">
              <div className="flex justify-between gap-4 py-3">
                <dt className="text-mediumGray shrink-0">Phone</dt>
                <dd className="text-deepGray font-medium text-right break-words">
                  {savedUserInfo?.contact_no || "—"}
                </dd>
              </div>
              <div className="flex justify-between gap-4 py-3">
                <dt className="text-mediumGray shrink-0">Address</dt>
                <dd className="text-deepGray font-medium text-right break-words">
                  {savedUserInfo?.customer_address || "—"}
                </dd>
              </div>
            </dl>
          </div>

          <div className="bg-white border border-gray-100 rounded-xl shadow-sm p-6 md:p-8">
            <h1 className="font-semibold text-secondary text-xl md:text-2xl mb-2">
              Update Address
            </h1>

            <div className="py-3">
              <FloatingInput
                label="Name"
                id="customer_name"
                value={userInfo?.customer_name || ""}
                onChange={(e) =>
                  handleDataChange(e.target.value, "customer_name")
                }
              />
            </div>

            <div className="py-3">
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

            <div className="py-3">
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
                className="mt-3 px-4 bg-primary hover:bg-primary/95 text-white font-medium rounded-md w-full"
                disabled={progressing}
              >
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
