import React from "react";
import RoundLoader from "@/components/shared/RoundLoader/RoundLoader";

const Loading = () => {
  return (
    // Page background (white / near-black), so the overlay matches the page.
    <div className="fixed inset-0 z-50 bg-(--background) flex justify-center items-center">
      <RoundLoader />
    </div>
  );
};

export default Loading;
