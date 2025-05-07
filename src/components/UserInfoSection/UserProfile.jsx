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
