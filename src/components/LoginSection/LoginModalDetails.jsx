"use client";

import toast from "react-hot-toast";
import OtpSection from "./OtpSection";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import { usePathname } from "next/navigation";
import { useUser } from "@/hooks/fetch-data/useUser";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import UserInfoInputs from "../UserInfoSection/UserInfoInputs";

const LoginModalDetails = ({ onClose = () => {}, type = "login" }) => {
  const [phone, setPhone] = useState("");
  const [otpGenerated, setOtpGenerated] = useState("");
  const [contentType, setContentType] = useState("otp");

  const pathname = usePathname();
  const { progressing, userInfo, handleDataChange, getOtp, registerUser } =
    useUser();

  const currentModule = useSelector((state) => state.dashboard.currentModule);
  const module = currentModule.toLowerCase();

  let category = "";

  if (pathname.includes("/grocery")) {
    category = "grocery";
  } else if (pathname.includes("/medicine")) {
    category = "medicine";
  } else if (pathname.includes("/food")) {
    category = "food";
  } else if (pathname.includes("/all-care-services")) {
    category = "all-care-services";
  }

  const sendSms = () => {
    const generatedOtp = Math.floor(Math.random() * 8999 + 1000);
    getOtp({
      contact_no: phone,
      otp: generatedOtp,
      smsKey: "fZtUYT1",
    });

    setOtpGenerated(generatedOtp.toString());

    if (!progressing) {
      setTimeout(() => {
        setContentType("userInfo");
      }, 1000);
    }
  };

  const handleOtp = () => {
    if (phone?.length < 1) {
      return toast("মোবাইল নম্বর প্রদান করা আবশ্যক।", {
        style: {
          border: "1px solid #FC8F1E",
        },
        icon: "ℹ️",
        iconTheme: {
          primary: "#FC8F1E",
          secondary: "#FFFAEE",
        },
      });
    } else if (phone?.length < 11) {
      return toast("মোবাইল নম্বরটি অবশ্যই সঠিক ১১টি ডিজিট হতে হবে!", {
        style: {
          border: "1px solid #FC8F1E",
        },
        icon: "ℹ️",
        iconTheme: {
          primary: "#FC8F1E",
          secondary: "#FFFAEE",
        },
      });
    }

    sendSms();
  };

  const getPrimaryClass = () => {
    if (module === "medicine" && category === "medicine")
      return "bg-primaryMedicine";
    if (module === "grocery" && category === "grocery")
      return "bg-primaryGrocery";
    if (module === "food" && category === "food") return "bg-primaryFood";
    return "bg-primary";
  };

  return (
    <>
      {contentType === "otp" ? (
        <div className="md:border-2 rounded-md p-3 md:p-6">
          <OtpSection setPhone={setPhone} />
          <div className="flex justify-center">
            <button
              onClick={handleOtp}
              className={`md:mt-1 px-4 ${getPrimaryClass()} text-white rounded-md w-full`}
              disabled={progressing}
            >
              {progressing ? (
                <div className="flex justify-center items-center">
                  <p>Sending OTP...</p>
                  <DotLottieReact
                    src="https://lottie.host/6958d316-ea05-4122-9dff-1d526f59b3ca/ZilAm5yZWu.lottie"
                    loop
                    autoplay
                    className="size-10"
                  />
                </div>
              ) : (
                <>
                  <p className="py-2">LOGIN WITH OTP</p>
                </>
              )}
            </button>
          </div>
        </div>
      ) : (
        <div className="md:border-2 rounded-md p-3 md:p-6">
          <UserInfoInputs
            onClose={onClose}
            type={type}
            getPrimaryClass={getPrimaryClass}
            userInfo={userInfo}
            otpGenerated={otpGenerated}
            sendSms={sendSms}
            progressing={progressing}
            handleDataChange={handleDataChange}
            registerUser={registerUser}
          />
        </div>
      )}
    </>
  );
};

export default LoginModalDetails;

// "use client";

// import toast from "react-hot-toast";
// import OtpSection from "./OtpSection";
// import React, { useState } from "react";
// import { useSelector } from "react-redux";
// import { usePathname } from "next/navigation";
// import UserInfoInputs from "../UserInfoSection/UserInfoInputs";

// const LoginModalDetails = ({ onClose = () => {}, type = "login" }) => {
//   const [phone, setPhone] = useState("");
//   const [contentType, setContentType] = useState("otp");

//   const pathname = usePathname();

//   const currentModule = useSelector((state) => state.dashboard.currentModule);
//   const module = currentModule.toLowerCase();

//   let category = "";

//   if (pathname.includes("/grocery")) {
//     category = "grocery";
//   } else if (pathname.includes("/medicine")) {
//     category = "medicine";
//   } else if (pathname.includes("/food")) {
//     category = "food";
//   } else if (pathname.includes("/all-care-services")) {
//     category = "all-care-services";
//   }

//   const handleOtp = () => {
//     if (phone?.length < 1) {
//       return toast("মোবাইল নম্বর প্রদান করা আবশ্যক।", {
//         style: {
//           border: "1px solid #FC8F1E",
//         },
//         icon: "ℹ️",
//         iconTheme: {
//           primary: "#FC8F1E",
//           secondary: "#FFFAEE",
//         },
//       });
//     } else if (phone?.length < 11) {
//       return toast("মোবাইল নম্বরটি অবশ্যই সঠিক ১১টি ডিজিট হতে হবে!", {
//         style: {
//           border: "1px solid #FC8F1E",
//         },
//         icon: "ℹ️",
//         iconTheme: {
//           primary: "#FC8F1E",
//           secondary: "#FFFAEE",
//         },
//       });
//     }

//     setContentType("userInfo");
//   };

//   const getPrimaryClass = () => {
//     if (module === "medicine" && category === "medicine")
//       return "bg-primaryMedicine";
//     if (module === "grocery" && category === "grocery")
//       return "bg-primaryGrocery";
//     if (module === "food" && category === "food") return "bg-primaryFood";
//     return "bg-primary";
//   };

//   return (
//     <>
//       {contentType === "otp" ? (
//         <div className="md:border-2 rounded-md p-3 md:p-6">
//           <OtpSection setPhone={setPhone} />
//           <div className="flex justify-center">
//             <button
//               onClick={handleOtp}
//               className={`md:mt-1 px-4 py-2 ${getPrimaryClass()} text-white rounded-md w-full`}
//             >
//               LOGIN WITH OTP
//             </button>
//           </div>
//         </div>
//       ) : (
//         <div className="md:border-2 rounded-md p-3 md:p-6">
//           <UserInfoInputs
//             phone={phone}
//             onClose={onClose}
//             type={type}
//             getPrimaryClass={getPrimaryClass}
//           />
//         </div>
//       )}
//     </>
//   );
// };

// export default LoginModalDetails;
