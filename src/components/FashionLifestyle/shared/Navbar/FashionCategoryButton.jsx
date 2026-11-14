"use client";

import React, { useState } from "react";
import { BiCategory } from "react-icons/bi";
import Sidebar from "../../Sidebar/Sidebar";
import { NAV_ICON_BUTTON } from "@/components/shared/Navbar/navStyles";

// Opens the fashion category sidebar on small screens (lg+ has the
// category row under the navbar).
const FashionCategoryButton = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="lg:hidden">
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        aria-label="Browse categories"
        className={`${NAV_ICON_BUTTON} -ml-2 text-xl`}
      >
        <BiCategory />
      </button>
      <Sidebar isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </div>
  );
};

export default FashionCategoryButton;
