import React from "react";
import Navbar from "@/components/shared/Navbar/Navbar";
import Footer from "@/components/shared/Footer/Footer";
import AllCareHome from "@/components/AllCareServices/AllCareHome";

const page = () => {
  return (
    <>
      <Navbar />
      <AllCareHome />
      <Footer />
    </>
  );
};

export default page;
