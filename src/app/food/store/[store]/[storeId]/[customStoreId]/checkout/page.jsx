import React from "react";
import CheckoutSection from "@/components/Food/CheckoutSection/CheckoutSection";

// Footer is rendered by the parent [customStoreId]/layout.jsx.
const page = () => {
  return (
    <div className="bg-gray-100 min-h-content">
      <CheckoutSection />
    </div>
  );
};

export default page;
