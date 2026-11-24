import type { Metadata } from "next";
import type { ReactNode } from "react";
import Footer from "@/components/shared/Footer/Footer";
import Navbar from "@/components/shared/Navbar/Navbar";
import LocationMobile from "@/components/shared/LocationModal/LocationMobile";

export const metadata: Metadata = {
  title: "Find Dental Care Center",
  description:
    "Find nearby dental care centers and dentists with NoTension.",
};

export default function DentalCareCenterLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <Navbar />
      <div className="pt-16 md:pt-20">
        <LocationMobile />
        {children}
      </div>
      <Footer />
    </>
  );
}
