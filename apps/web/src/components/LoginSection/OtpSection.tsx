import React, { type ChangeEvent } from "react";
import FloatingInput from "./FloatingInput";

type Props = {
  phone: string;
  setPhone: (phone: string) => void;
  /** Validation message, shown in place of the hint. */
  error?: string;
};

const OtpSection = ({ phone, setPhone, error }: Props) => {
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
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? "phone-error" : undefined}
      />
      {error ? (
        <span id="phone-error" role="alert" className="mt-2 block text-xs text-[#D92D20]">
          {error}
        </span>
      ) : (
        <p className="mt-2 text-xs text-gray-500">
          11-digit number, e.g. 01XXXXXXXXX
        </p>
      )}
    </div>
  );
};

export default OtpSection;
