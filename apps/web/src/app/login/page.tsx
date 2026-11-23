import React from "react";
import Link from "next/link";
import Image from "next/image";
import { HiOutlineShieldCheck } from "react-icons/hi2";
import LoginModalDetails from "@/components/LoginSection/LoginModalDetails";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Login",
  description:
    "Log in to NoTension with your mobile number.",
};

const page = () => {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gray-50 px-4 py-10">
      {/* Soft brand glow behind the card */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-40 left-1/2 h-112 w-md -translate-x-1/2 rounded-full bg-primary/10 blur-3xl"
      />

      <div className="relative w-full max-w-[420px]">
        <Link
          href="/"
          aria-label="NoTension home"
          className="mx-auto mb-6 block w-40 md:w-48"
        >
          <Image
            width={224}
            height={40}
            src="/png/notension-logo.png"
            alt="notension"
            className="h-auto w-full object-contain"
            preload
          />
        </Link>

        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-xl shadow-gray-900/5 md:p-8">
          <h1 className="text-center text-2xl font-bold tracking-tight text-gray-900">
            Welcome back
          </h1>
          <p className="mt-1 text-center text-sm text-gray-500">
            Log in with your mobile number to continue
          </p>

          <LoginModalDetails type="login" showHeading={false} />
        </div>

        <p className="mt-5 flex items-center justify-center gap-1.5 text-xs text-gray-500">
          <HiOutlineShieldCheck className="text-base text-[#12B76A]" />
          We only use your number to verify your account.
        </p>
      </div>
    </div>
  );
};

export default page;
