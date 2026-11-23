"use client";

import staticNavItems from "../../../../public/data/navItems.json";
import { useCategoryItem } from "./fetchData/useCategoryItem";
import type { NavItem } from "../utils/generateNavItems";

// The first 7 fashion types for the navbar, sidebar and search.
// Built from the API, so the mega-menu images resolve to the local image
// files; until that loads it uses the static JSON, which has the same ids and
// names.
export const useNavItems = () => {
  const { navItems: apiNavItems } = useCategoryItem();

  const navItems: NavItem[] = apiNavItems?.length ? apiNavItems : staticNavItems;

  return { navItems: navItems.slice(0, 7) };
};
