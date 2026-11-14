import React from "react";
import { Noto_Sans_Bengali } from "next/font/google";
import Footer from "@/components/shared/Footer/Footer";
import Navbar from "@/components/shared/Navbar/Navbar";
import MarketingPolicy from "@/components/Policy/MarketingPolicy";

export const metadata = {
  title: "Marketing Policy",
  description:
    "NoTension merchant fees, current offers and partner programme benefits.",
};

const NotoSansBengali = Noto_Sans_Bengali({
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["latin"],
});

const page = () => {
  return (
    <section className={NotoSansBengali.className}>
      <Navbar />
      {/* Offset for the fixed navbar, as in the module layouts. */}
      <main className="pt-16 lg:pt-[72px]">
        <MarketingPolicy />
      </main>
      <Footer />
    </section>
  );
};

export default page;
