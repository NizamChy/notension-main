import React from "react";
import Navbar from "@/components/shared/Navbar/Navbar";
import Footer from "@/components/shared/Footer/Footer";
import UserProfile from "@/components/UserInfoSection/UserProfile";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "My Profile",
  description:
    "Manage your NoTension profile.",
};

const page = () => {
  return (
    <>
      <Navbar />
      <div className="min-h-content pt-16 lg:pt-[72px]">
        <UserProfile />
      </div>
      <Footer />
    </>
  );
};

export default page;
