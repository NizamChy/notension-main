import React from "react";

const Title = ({ title, className = "" }) => {
  return (
    <h2
      className={`text-xl md:text-2xl lg:text-3xl font-bold text-gray-900 mb-4 md:mb-6 ${className}`}
    >
      {title}
    </h2>
  );
};

export default Title;
