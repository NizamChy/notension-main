"use client";

import { useState, useEffect } from "react";
import { HiArrowUp } from "react-icons/hi";

const GoTop = () => {
  const [isSticky, setSticky] = useState(false);

  const handleScroll = () => {
    if (window.scrollY > 100) {
      setSticky(true);
    } else {
      setSticky(false);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <>
      {isSticky && (
        <button
          type="button"
          aria-label="Back to top"
          onClick={scrollToTop}
          className="fixed bottom-6 right-4 z-30 flex h-11 w-11 items-center justify-center rounded-full border border-gray-200 bg-white text-lg text-gray-800 shadow-lg shadow-gray-900/10 transition-colors hover:border-[#0C3F8E] hover:bg-[#0C3F8E] hover:text-white sm:right-6 lg:bottom-8 lg:right-8"
        >
          <HiArrowUp />
        </button>
      )}
    </>
  );
};

export default GoTop;
