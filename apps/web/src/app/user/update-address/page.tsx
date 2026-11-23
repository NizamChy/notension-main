import React from "react";
import Navbar from "@/components/shared/Navbar/Navbar";
import Footer from "@/components/shared/Footer/Footer";
import UpdateAddress from "@/components/UserInfoSection/UpdateAddress";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Update Address",
  description:
    "Update your NoTension delivery address.",
};

const page = () => {
  return (
    <>
      {/* boundary: legacy JS caller. Navbar is JS, so TS reads every prop as
          required; this page passes none. */}
      <Navbar search={undefined} leading={undefined} actions={undefined} />
      <div className="min-h-content pt-16 lg:pt-[72px]">
        <UpdateAddress />
      </div>
      <Footer />
    </>
  );
};

export default page;
