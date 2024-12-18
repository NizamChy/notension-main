import Link from "next/link";
import React from "react";
import { CiShop } from "react-icons/ci";

const page = () => {
  return (
    <>
      {/* <div className="flex justify-center">
        <Link href="/grocery/find-store">
          <button
            type="button"
            className="text-white bg-gradient-to-r from-teal-400 via-teal-500 to-teal-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-teal-300 dark:focus:ring-teal-800 font-semibold rounded-lg text-2xl p-10 text-center me-2 mb-2"
          >
            Find Nearby Stores
          </button>
        </Link>
      </div> */}

      <div className="relative flex flex-col justify-center overflow-hidden py-6 sm:py-12">
        <Link href="/grocery/find-store">
          <div className="group relative cursor-pointer overflow-hidden bg-white md:px-6 pt-10 pb-8 shadow-xl ring-1 ring-gray-900/5 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl mx-auto max-w-sm rounded-lg px-10">
            <span className="absolute top-10 z-0 h-20 w-20 rounded-full bg-sky-500 transition-all duration-300 group-hover:scale-[10]"></span>
            <div className="relative z-auto mx-auto max-w-md">
              <span className="grid h-20 w-20 place-items-center rounded-full bg-sky-500 transition-all duration-300 group-hover:bg-sky-400">
                <CiShop className="text-4xl text-white" />
              </span>
              <div className="space-y-6 pt-5 text-base leading-7 text-gray-600 transition-all duration-300 group-hover:text-white/90">
                <p>
                  Discover stores near you to shop for your favorite items or
                  explore new products.
                </p>
              </div>
              <div className="pt-5 text-base font-semibold leading-7">
                <p className="text-sky-500 transition-all duration-300 group-hover:text-white text-xl">
                  Find Nearby Stores &rarr;
                </p>
              </div>
            </div>
          </div>
        </Link>
      </div>
    </>
  );
};

export default page;
