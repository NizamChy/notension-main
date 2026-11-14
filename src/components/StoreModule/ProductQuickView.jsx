"use client";

import React from "react";
import CommonModal from "@/components/shared/CommonModal/CommonModal";

// Modal frame for the product quick-view: wider, rounded-2xl, and its body
// scrolls on short screens (the close button sits outside the scroll area).
const ProductQuickView = ({ isOpen, onClose, children }) => (
  <CommonModal
    isOpen={isOpen}
    onClose={onClose}
    className="!w-[calc(100%-2rem)] !max-w-3xl !rounded-2xl !p-0"
  >
    <div className="max-h-[85vh] overflow-y-auto overscroll-contain p-4 sm:p-6">
      {children}
    </div>
  </CommonModal>
);

export default ProductQuickView;
