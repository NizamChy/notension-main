"use client";
import React, { useState } from "react";
import { CgProfile } from "react-icons/cg";
import CommonModal from "../CommonModal/CommonModal";
import LoginModalDetails from "@/components/Cart/LoginModalDetails";

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
        className="flex justify-center items-center gap-1 border rounded-full py-1 px-2.5 hover:bg-gray-50 text-secondary text-lg"
      >
        <CgProfile className="text-2xl" />
        Log in
      </button>

      <CommonModal isOpen={isModalOpen} onClose={closeModal}>
        <LoginModalDetails onClose={closeModal} type="login" />
      </CommonModal>
    </>
  );
};

export default LoginButton;
