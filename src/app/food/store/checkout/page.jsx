import React from "react";
import Footer from "@/components/shared/Footer/Footer";
import CheckoutSection from "@/components/Food/CheckoutSection/CheckoutSection";

const page = () => {
  return (
    <>
      <div className="bg-gray-100 min-h-content">
        <CheckoutSection />
      </div>

      <Footer />
    </>
  );
};

export default page;
