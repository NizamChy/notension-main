import CheckoutSection from "@/components/Food/CheckoutSection/CheckoutSection";
import Footer from "@/components/shared/Footer/Footer";
import React from "react";

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
