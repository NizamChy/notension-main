import React from "react";
import Link from "next/link";
import Image from "next/image";
import LoginModalDetails from "@/components/LoginSection/LoginModalDetails";

export const metadata = {
  title: "Login",
  description:
    "Log in to NoTension with your mobile number.",
};

const page = () => {
  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-50 px-4 py-10">
      <div className="w-full max-w-[420px]">
        <Link href="/" className="block w-40 md:w-48 mx-auto mb-6">
          <Image
            width={224}
            height={40}
            src="/png/notension-logo.png"
            alt="notension"
            className="object-contain w-full h-auto"
            priority
          />
        </Link>

        <div className="bg-white border border-gray-100 rounded-xl shadow-sm p-5 md:p-7">
          <h1 className="text-xl md:text-2xl font-semibold text-secondary text-center">
            Welcome back
          </h1>
          <p className="mt-1 mb-2 text-sm text-gray-500 text-center">
            Log in with your mobile number to continue
          </p>

          <LoginModalDetails type="login" />
        </div>
      </div>
    </div>
  );
};

export default page;
