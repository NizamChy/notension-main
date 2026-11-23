import type { Metadata } from "next";
import type { ReactNode } from "react";
import Footer from "@/components/shared/Footer/Footer";
import Navbar from "@/components/shared/Navbar/Navbar";
import LocationMobile from "@/components/shared/LocationModal/LocationMobile";

export const metadata: Metadata = {
  title: "Find Doctor",
  description:
    "Find doctors by department or location and book appointments online with NoTension.",
};

export default function DoctorLayout({ children }: { children: ReactNode }) {
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
