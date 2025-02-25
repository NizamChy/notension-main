import React from "react";
import Navbar from "@/components/shared/Navbar/Navbar";
import Footer from "@/components/shared/Footer/Footer";
import UserProfile from "@/components/UserInfoSection/UserProfile";

const page = () => {
  return (
    <>
      <Navbar />
      <div className="container min-h-content pt-20">
        <UserProfile />
      </div>
      <Footer />
    </>
  );
};

export default page;
