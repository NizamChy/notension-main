"use client";

import React from "react";
import SidebarItems from "./SidebarItems";
import { useParams } from "next/navigation";
import StoreSidebarItems from "./StoreSidebarItems";
import Drawer from "@/components/shared/Drawer/Drawer";

// Fashion category menu for small screens. Inside a shop it lists that
// shop's categories.
const Sidebar = ({ isOpen, onClose }) => {
  const params = useParams();

  return (
    <Drawer
      side="left"
      isOpen={isOpen}
      onClose={onClose}
      title="Categories"
      subtitle={params?.shopSlugId ? "In this shop" : "Fashion & lifestyle"}
      widthClass="w-[86%] max-w-[360px]"
      bodyClass="px-3 py-3"
    >
      {params?.shopSlugId ? (
        <StoreSidebarItems onClose={onClose} />
      ) : (
        <SidebarItems onClose={onClose} />
      )}
    </Drawer>
  );
};

export default Sidebar;
