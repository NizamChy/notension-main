import React, { type ChangeEvent } from "react";
import FloatingInput from "./FloatingInput";

type Props = {
  phone: string;
  setPhone: (phone: string) => void;
};

const OtpSection = ({ phone, setPhone }: Props) => {
  const handlePhoneChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setPhone(e.target.value);
  };

  return (
    <div className="py-5">
      <FloatingInput
        label="Mobile number"
        id="phone"
        type="tel"
        inputMode="tel"
        autoComplete="tel"
        value={phone}
        onChange={handlePhoneChange}
      />
      <p className="mt-2 text-xs text-gray-500">
        11-digit number, e.g. 01XXXXXXXXX
      </p>
    </div>
  );
};

export default OtpSection;
