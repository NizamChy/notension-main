"use client";

import React from "react";
import ModuleNavbar from "@/components/StoreModule/ModuleNavbar";
import LocationModal from "@/components/shared/LocationModal/LocationModal";
import MobileCategoryDrawer from "../MobileCategoryDrawer/MobileCategoryDrawer";

const Navbar = () => (
  <ModuleNavbar
    module="food"
    storePrefix="/food/store"
    drawer={<MobileCategoryDrawer />}
    actions={<LocationModal />}
  />
);

export default Navbar;
