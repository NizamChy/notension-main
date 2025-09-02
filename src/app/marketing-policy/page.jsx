import React from "react";
import { Noto_Sans_Bengali } from "next/font/google";
import Footer from "@/components/shared/Footer/Footer";
import Navbar from "@/components/shared/Navbar/Navbar";
import MarketingPolicy from "@/components/Policy/MarketingPolicy";

const NotoSansBengali = Noto_Sans_Bengali({
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["latin"],
});

const page = () => {
  return (
    <section className={NotoSansBengali.className}>
      <Navbar />
      <MarketingPolicy />
      <Footer />
    </section>
  );
};

export default page;
