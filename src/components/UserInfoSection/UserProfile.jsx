"use client";

import { useSelector } from "react-redux";
import { CgProfile } from "react-icons/cg";
import React, { useEffect, useState } from "react";
import LoginModalDetails from "../LoginSection/LoginModalDetails";
import CommonModal from "../shared/CommonModal/CommonModal";

const UserProfile = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { userInfo } = useSelector((state) => state.user);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  useEffect(() => {
    if (!userInfo?._id) {
      openModal();
    }
  }, []);

  return (
    <>
      {userInfo?._id && (
        <div className="flex justify-center px-4 py-8 md:py-12">
          <div className="w-full max-w-md bg-white border border-gray-100 rounded-xl shadow-sm p-6 md:p-8">
            <div className="flex flex-col items-center text-center">
              <CgProfile className="text-7xl md:text-8xl text-primary" />
              <h1 className="mt-3 text-xl md:text-2xl font-semibold text-primary break-words">
                {userInfo?.customer_name}
              </h1>
            </div>

            <dl className="mt-6 divide-y divide-gray-100 text-sm md:text-base">
              <div className="flex justify-between gap-4 py-3">
                <dt className="text-mediumGray shrink-0">Phone</dt>
                <dd className="text-deepGray font-medium text-right break-words">
                  {userInfo?.contact_no || "—"}
                </dd>
              </div>
              <div className="flex justify-between gap-4 py-3">
                <dt className="text-mediumGray shrink-0">Address</dt>
                <dd className="text-deepGray font-medium text-right break-words">
                  {userInfo?.customer_address || "—"}
                </dd>
              </div>
            </dl>
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

export default UserProfile;
