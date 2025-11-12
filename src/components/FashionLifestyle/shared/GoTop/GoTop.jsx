"use client";

import { useState, useEffect } from "react";
import { MdKeyboardArrowUp } from "react-icons/md";

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
          className="fixed bottom-8 right-8 lg:right-32 text-3xl lg:text-4xl border hover:bg-primary hover:text-white text-primary border-primary rounded"
          style={{ zIndex: 2 }}
          onClick={scrollToTop}
        >
          <MdKeyboardArrowUp />
        </button>
      )}
    </>
  );
};

export default GoTop;
