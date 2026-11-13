"use client";

import React from "react";
import SearchBar from "@/components/StoreModule/SearchBar";
import ModuleNavbar from "@/components/StoreModule/ModuleNavbar";
import MobileCategoryDrawer from "../MobileCategoryDrawer/MobileCategoryDrawer";

const Navbar = () => (
  <ModuleNavbar
    module="grocery"
    storePrefix="/grocery"
    wishlist
    drawer={<MobileCategoryDrawer />}
    center={<SearchBar moduleName="grocery" />}
  />
);

export default Navbar;
