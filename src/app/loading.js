import React from "react";
import RoundLoader from "@/utils/round-loader";

const Loading = () => {
  return (
    // Page background (white / near-black), so the overlay matches the page.
    <div className="fixed inset-0 z-50 bg-[var(--background)] flex justify-center items-center">
      <RoundLoader />
    </div>
  );
};

export default Loading;
