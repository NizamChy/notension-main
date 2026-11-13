"use client";

import React, { useState } from "react";
import { CgProfile } from "react-icons/cg";
import CommonModal from "../CommonModal/CommonModal";
import LoginModalDetails from "@/components/LoginSection/LoginModalDetails";

const LoginButton = ({ compact = false }) => {
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
        aria-label="Log in"
        className={`flex items-center gap-1.5 rounded-full bg-[#0C3F8E] py-2 text-sm font-semibold text-white transition-colors hover:bg-[#0A3478] ${
          compact ? "px-2 sm:px-4" : "px-4"
        }`}
      >
        <CgProfile className="text-lg" />
        {/* `compact`: icon only on small phones */}
        <span className={compact ? "hidden sm:inline" : ""}>Log in</span>
      </button>

      <CommonModal isOpen={isModalOpen} onClose={closeModal}>
        <LoginModalDetails onClose={closeModal} type="login" />
      </CommonModal>
    </>
  );
};

export default LoginButton;
