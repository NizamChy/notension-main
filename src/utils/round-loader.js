import React from "react";
import "./round-loader.css";

const RoundLoader = () => {
  return (
    <div className="loader-mian-sec">
      <div className="container">
        <div className="ring"></div>
        <div className="ring"></div>
        <div className="ring"></div>
        <div className="ring"></div>
        <img src="/images/logo/no-tension-logo.jpg" alt="Loader Logo" />
      </div>
    </div>
  );
};

export default RoundLoader;
