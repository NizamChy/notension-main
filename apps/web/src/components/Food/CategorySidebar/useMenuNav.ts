"use client";

import { useFoodStore } from "@/hooks/food/useFoodStore";
import { useCallback, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

// Shared by the restaurant page's category tabs (mobile) and category list
// (desktop). On the store home every menu section is on the page, so a tab
// scrolls to its section and the active tab follows the scroll position. On
// a category page (/[catId]) a tab opens that category's page as before.

export const POPULAR_SECTION = "popular";
export const menuSectionId = (id: string) => `menu-section-${id}`;

// Space taken by the fixed navbar plus the sticky tabs.
const SPY_OFFSET = 150;

type StoreParams = {
  store?: string;
  storeId?: string;
  customStoreId?: string;
  catId?: string;
  productId?: string;
};

export type MenuNavItem = { id: string; name: string; count: number };

type Options = { onNavigate?: (id: string) => void };

const useMenuNav = ({ onNavigate }: Options = {}) => {
  const router = useRouter();
  const params = useParams<StoreParams>();

  const { productCategory, popularItem, productInfoByShop } = useFoodStore();

  const basePath = `/food/store/${params?.store}/${params?.storeId}/${params?.customStoreId}`;
  const isHome = !params?.catId && !params?.productId;

  const counts: Record<string, number | undefined> = Object.fromEntries(
    (productInfoByShop || []).map((cat) => [cat?._id, cat?.itemsInfo?.length])
  );

  const items: MenuNavItem[] = [
    ...(popularItem?.length
      ? [{ id: POPULAR_SECTION, name: "Popular", count: popularItem.length }]
      : []),
    ...(productCategory || []).map((category) => ({
      id: category?.categoryInfo?._id,
      name:
        category?.categoryName ||
        category?.categoryInfo?.category_name ||
        "Category",
      count: counts[category?.categoryInfo?._id] ?? category?.totalProduct,
    })),
  ].filter((item) => item.id);

  const [spyId, setSpyId] = useState<string | null | undefined>(null);

  // Scroll-spy: the last section whose top has passed under the sticky bar.
  useEffect(() => {
    if (!isHome) return;

    let frame: number | null = null;
    const update = () => {
      frame = null;
      const sections = document.querySelectorAll<HTMLElement>("[data-menu-section]");
      let current: string | null | undefined = sections[0]?.dataset.menuSection || null;
      sections.forEach((section) => {
        if (section.getBoundingClientRect().top <= SPY_OFFSET + 8) {
          current = section.dataset.menuSection;
        }
      });
      setSpyId(current);
    };
    const onScroll = () => {
      if (frame === null) frame = window.requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame !== null) window.cancelAnimationFrame(frame);
    };
  }, [isHome, items.length]);

  const activeId = isHome ? spyId : params?.catId;

  const goTo = useCallback(
    (id: string) => {
      if (isHome) {
        const section = document.getElementById(menuSectionId(id));
        if (section) {
          const top =
            section.getBoundingClientRect().top + window.scrollY - SPY_OFFSET + 4;
          window.scrollTo({ top, behavior: "smooth" });
          setSpyId(id);
          return;
        }
      }

      router.push(id === POPULAR_SECTION ? basePath : `${basePath}/${id}`);
      onNavigate?.(id);
    },
    [isHome, basePath, router, onNavigate]
  );

  return { items, activeId, goTo, isHome };
};

export default useMenuNav;
