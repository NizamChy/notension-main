import React from "react";
import FloatingInput from "./FloatingInput";

const OtpSection = ({ phone, setPhone }) => {
  const handlePhoneChange = (e) => {
    setPhone(e.target.value);
  };

  return (
    <div className="py-4">
      <FloatingInput
        label="Enter your mobile number"
        id="phone"
        value={phone}
        onChange={handlePhoneChange}
      />
    </div>
  );
};

export default OtpSection;
