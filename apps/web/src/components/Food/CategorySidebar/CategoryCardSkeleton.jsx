"use client";

import React from "react";
import { Skeleton } from "@/components/shared/UI/UI";

// Placeholder for one menu category entry (sidebar row / tab pill).
const CategoryCardSkeleton = ({ className = "h-10 w-full" }) => (
  <Skeleton className={`rounded-xl ${className}`} />
);

export default CategoryCardSkeleton;
