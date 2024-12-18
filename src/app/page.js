import React from "react";
import LocationModal from "../components/LocationModal/LocationModal";
import Link from "next/link";
import Image from "next/image";

const page = () => {
  return (
    <>
      <LocationModal />
      {/* <div className="flex justify-center gap-5 mt-10">
        <Link href="/grocery">
          <button className="bg-gradient-to-r from-blue-500 to-blue-700 text-white px-6 py-3 rounded-lg shadow-md hover:from-blue-600 hover:to-blue-800 transition duration-300">
            Grocery Shop
          </button>
        </Link>

        <Link href="/medicine">
          <button className="bg-gradient-to-r from-green-500 to-green-700 text-white px-6 py-3 rounded-lg shadow-md hover:from-green-600 hover:to-green-800 transition duration-300">
            Medicine Shop
          </button>
        </Link>

        <Link href="/food">
          <button className=" text-white px-6 py-3 rounded-lg shadow-md bg-gradient-to-r from-red-500 to-red-700 hover:from-red-600 hover:to-red-800 transition duration-300">
            Food Shop
          </button>
        </Link>
      </div> */}
      <div className="flex justify-center gap-5 mt-16 px-3">
        <div className="w-full max-w-xs space-y-3 rounded-xl bg-white p-4 shadow-lg">
          <Link href="/grocery">
            <div className="group flex w-full justify-center overflow-hidden">
              <Image
                width={400}
                height={400}
                className="rounded-lg bg-black/40 object-contain transition-transform duration-300 group-hover:scale-105"
                src="/png/grocery-shop.png"
                alt="grocery"
              />
            </div>
          </Link>
        </div>

        <div className="w-full max-w-xs space-y-3 rounded-xl bg-white p-4 shadow-lg">
          <Link href="/medicine">
            <div className="group flex w-full justify-center overflow-hidden">
              <Image
                width={400}
                height={400}
                className="rounded-lg bg-black/40 object-contain transition-transform duration-300 group-hover:scale-105"
                src="/png/medicine-shop.png"
                alt="medicine"
              />
            </div>
          </Link>
        </div>
        <div className="w-full max-w-xs space-y-3 rounded-xl bg-white p-4 shadow-lg">
          <Link href="/food">
            <div className="group flex w-full justify-center overflow-hidden">
              <Image
                width={400}
                height={400}
                className="rounded-lg bg-black/40 object-contain transition-transform duration-300 group-hover:scale-105"
                src="/png/food-shop.png"
                alt="food"
              />
            </div>
          </Link>
        </div>
      </div>
    </>
  );
};

export default page;
