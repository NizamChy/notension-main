import React from "react";
import Link from "next/link";
import { HiOutlineExclamationTriangle } from "react-icons/hi2";

const ErrorPage = ({ onRetry }) => {
  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-gray-50 px-4 py-12">
      <div className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-8 text-center shadow-sm shadow-gray-900/[0.03] md:p-10">
        <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#D92D20]/10 text-3xl text-[#D92D20]">
          <HiOutlineExclamationTriangle aria-hidden="true" />
        </span>
        <h1 className="mt-5 text-xl font-bold tracking-tight text-gray-900 md:text-2xl">
          Something went wrong
        </h1>
        <p className="mt-2 text-sm text-gray-500 md:text-base">
          We couldn&apos;t load this page. Please try again in a moment.
        </p>

        <div className="mt-7 flex flex-col-reverse justify-center gap-3 sm:flex-row">
          <Link
            href="/"
            className="inline-flex h-11 items-center justify-center gap-2 rounded-full border border-gray-200 bg-white px-5 text-sm font-semibold text-gray-800 transition-colors hover:border-gray-300 hover:bg-gray-50"
          >
            Go to home
          </Link>
          {onRetry && (
            <button
              type="button"
              onClick={onRetry}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-[#0C3F8E] px-5 text-sm font-semibold text-white shadow-sm shadow-[#0C3F8E]/20 transition-colors hover:bg-[#0A3478]"
            >
              Try again
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ErrorPage;
