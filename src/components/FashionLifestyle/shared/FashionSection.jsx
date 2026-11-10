import React from "react";

/** Shared page container for the fashion module (width, gutters, rhythm). */
export const FASHION_CONTAINER = "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8";

const FashionSection = ({ children, className = "", innerClassName = "" }) => {
  return (
    <section className={`py-6 md:py-10 bg-white ${className}`}>
      <div className={`${FASHION_CONTAINER} ${innerClassName}`}>{children}</div>
    </section>
  );
};

export default FashionSection;
