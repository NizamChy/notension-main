import React from "react";
import Link from "next/link";
import Image from "next/image";
import LocationModal from "@/components/shared/LocationModal/LocationModal";
import Footer from "@/components/shared/Footer/Footer";
import Navbar from "@/components/shared/Navbar/Navbar";
import LandingPage from "@/components/LandingPage/LandingPage";

const page = () => {
  return (
    <>
      <div className="min-h-content">
        <div className="pb-20">
          <Navbar />
        </div>
        <LocationModal />

        {/* Landing Page Content */}
        <LandingPage />
        {/* Landing Page Content end */}

        {/* <div className="flex justify-center gap-5 mt-16 px-3">
          <div className="w-full max-w-xs space-y-3 rounded-xl bg-white p-4 shadow-lg">
            <Link href="/grocery/all">
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
            <Link href="/medicine/all">
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
        </div> */}
      </div>

      <Footer />
    </>
  );
};

export default page;
