import React from "react";

const Title = ({ title }) => {
  return (
    <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 py-4">
      {title}
    </h2>
  );
};

export default Title;
