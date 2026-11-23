import Footer from "@/components/shared/Footer/Footer";
import Navbar from "@/components/shared/Navbar/Navbar";
import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "All Care Services",
  description:
    "Book nurses, caregivers, ambulances and other home care services near you with NoTension.",
};

export default function AllCareLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <Navbar />
      <div className="pt-16 lg:pt-[72px]">{children}</div>
      <Footer />
    </>
  );
}
