"use client";

import React from "react";
import { Skeleton } from "@/components/shared/UI/UI";

// Placeholder for one menu category entry (sidebar row / tab pill).
type Props = { className?: string };

const CategoryCardSkeleton = ({ className = "h-10 w-full" }: Props) => (
  <Skeleton className={`rounded-xl ${className}`} />
);

export default CategoryCardSkeleton;
