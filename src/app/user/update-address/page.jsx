import React from "react";
import Navbar from "@/components/shared/Navbar/Navbar";
import Footer from "@/components/shared/Footer/Footer";
import UpdateAddress from "@/components/UserInfoSection/UpdateAddress";

export const metadata = {
  title: "Update Address",
  description:
    "Update your NoTension delivery address.",
};

const page = () => {
  return (
    <>
      <Navbar />
      <div className="min-h-content pt-16 lg:pt-[72px]">
        <UpdateAddress />
      </div>
      <Footer />
    </>
  );
};

export default page;
