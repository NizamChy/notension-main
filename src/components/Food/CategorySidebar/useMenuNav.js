"use client";

import { useSelector } from "react-redux";
import { useCallback, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

// Shared by the restaurant page's category tabs (mobile) and category list
// (desktop). On the store home every menu section is on the page, so a tab
// scrolls to its section and the active tab follows the scroll position. On
// a category page (/[catId]) a tab opens that category's page as before.

export const POPULAR_SECTION = "popular";
export const menuSectionId = (id) => `menu-section-${id}`;

// Space taken by the fixed navbar plus the sticky tabs.
const SPY_OFFSET = 150;

const useMenuNav = ({ onNavigate } = {}) => {
  const router = useRouter();
  const params = useParams();

  const { productCategory, popularItem, productInfoByShop } = useSelector(
    (state) => state.itemsByStore
  );

  const basePath = `/food/store/${params?.store}/${params?.storeId}/${params?.customStoreId}`;
  const isHome = !params?.catId && !params?.productId;

  const counts = Object.fromEntries(
    (productInfoByShop || []).map((cat) => [cat?._id, cat?.itemsInfo?.length])
  );

  const items = [
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

  const [spyId, setSpyId] = useState(null);

  // Scroll-spy: the last section whose top has passed under the sticky bar.
  useEffect(() => {
    if (!isHome) return;

    let frame = null;
    const update = () => {
      frame = null;
      const sections = document.querySelectorAll("[data-menu-section]");
      let current = sections[0]?.dataset.menuSection || null;
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
    (id) => {
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
