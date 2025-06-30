import React from "react";
import Footer from "@/components/shared/Footer/Footer";
import Navbar from "@/components/shared/Navbar/Navbar";
import MarketingPolicy from "@/components/Policy/MarketingPolicy";

const page = () => {
  return (
    <>
      <Navbar />
      <MarketingPolicy />
      <Footer />
    </>
  );
};

export default page;
