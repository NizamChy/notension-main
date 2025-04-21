import React from "react";
import Navbar from "@/components/shared/Navbar/Navbar";
import Footer from "@/components/shared/Footer/Footer";
import UpdateAddress from "@/components/UserInfoSection/UpdateAddress";

const page = () => {
  return (
    <>
      <Navbar />
      <div className="min-h-content">
        <UpdateAddress />
      </div>
      <Footer />
    </>
  );
};

export default page;
