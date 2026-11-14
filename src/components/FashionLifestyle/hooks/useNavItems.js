"use client";

import { useSyncExternalStore } from "react";
import { isDemoMode } from "@/demo/demoMode";
import staticNavItems from "../../../../public/data/navItems.json";
import { useCategoryItem } from "./fetchData/useCategoryItem";

const noopSubscribe = () => () => {};

// The first 7 fashion types for the navbar, sidebar and search.
// Live mode keeps the static JSON (its image names point at the real
// backend). Demo mode builds the same shape from the demo API, so the
// mega-menu images resolve to demo files; until that loads it falls back
// to the JSON, which has the same ids and names.
export const useNavItems = () => {
  const demoOn = useSyncExternalStore(noopSubscribe, isDemoMode, () => false);
  const { navItems: apiNavItems } = useCategoryItem();

  const navItems =
    demoOn && apiNavItems?.length ? apiNavItems : staticNavItems;

  return { navItems: navItems.slice(0, 7) };
};
