import React from "react";
import { CARD } from "@/components/shared/UI/UI";

// Same shape as a sub-type tile in TypeSection.
const SubtypeSkeleton = () => (
  <div aria-hidden className={`animate-pulse overflow-hidden p-2 ${CARD}`}>
    <div className="aspect-square w-full rounded-xl bg-gray-100" />
    <div className="mx-auto mb-1 mt-2.5 h-3 w-2/3 rounded-full bg-gray-100" />
  </div>
);

export default SubtypeSkeleton;
