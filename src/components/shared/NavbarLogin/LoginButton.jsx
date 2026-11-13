"use client";

import React, { useState } from "react";
import { CgProfile } from "react-icons/cg";
import CommonModal from "../CommonModal/CommonModal";
import LoginModalDetails from "@/components/LoginSection/LoginModalDetails";

const LoginButton = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const handleLogin = () => {
    openModal();
  };

  return (
    <>
      <button
        onClick={handleLogin}
        type="button"
        className="flex items-center gap-1.5 rounded-full bg-[#0C3F8E] px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#0A3478]"
      >
        <CgProfile className="text-lg" />
        Log in
      </button>

      <CommonModal isOpen={isModalOpen} onClose={closeModal}>
        <LoginModalDetails onClose={closeModal} type="login" />
      </CommonModal>
    </>
  );
};

export default LoginButton;
