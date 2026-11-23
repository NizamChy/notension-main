"use client";

import Cart from "@/components/Cart/Cart";
import StoreUnavailable from "@/components/ShopInfoSection/StoreUnavailable";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { useFoodStore } from "@/hooks/food/useFoodStore";
import Footer from "@/components/shared/Footer/Footer";
import { useParams, usePathname } from "next/navigation";
import { PAGE_CONTAINER } from "@/components/shared/UI/UI";
import CategorySlider from "@/components/Food/CategorySidebar/CategorySlider";
import CategorySidebar from "@/components/Food/CategorySidebar/CategorySidebar";
import { MenuSkeleton } from "@/components/Food/FoodItems/MenuSection";
import RestaurantHeader, {
  RestaurantHeaderSkeleton,
} from "@/components/Food/RestaurantHeader/RestaurantHeader";
import CategoryBannerCarousel from "@/components/Food/CategoryBannerCarousel/CategoryBannerCarousel";

// Restaurant page frame: header (cover, logo, info), offers on the menu
// home, sticky category tabs (below lg) or category list (lg+), then the
// page. lg:pr-24 leaves room for the floating cart tab on the right edge.
export default function FoodStoreLayout({ children }: { children: ReactNode }) {
  const [isScroll, setIsScroll] = useState(false);

  const params = useParams();
  const pathname = usePathname();
  const foodItemsRef = useRef<HTMLDivElement>(null);

  // The restaurant in the URL, from the store query.
  const { isLoading: progressing, status: storeStatus } = useFoodStore();

  const scrollToFoodItems = () => {
    if (isScroll) {
      if (params?.catId && foodItemsRef.current) {
        const elementPosition =
          foodItemsRef.current.getBoundingClientRect().top + window.scrollY;
        // Clear the fixed navbar and the sticky category tabs.
        const offset = window.innerWidth >= 1024 ? 96 : 136;

        window.scrollTo({
          top: elementPosition - offset,
          behavior: "smooth",
        });
      }
    }

    setIsScroll(false);
  };

  // After a category tab opens another category page, bring its dishes into
  // view (scrollToFoodItems only scrolls when a tab asked for it).
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (isScroll) scrollToFoodItems();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params?.catId, isScroll]);

  const showStoreChrome =
    !pathname.includes("/orders") &&
    !pathname.includes("/checkout") &&
    !pathname.includes("/user");
  const isProductPage = !!params?.productId;
  const isMenuHome = showStoreChrome && !params?.catId && !isProductPage;
  const showMenuNav = showStoreChrome && !isProductPage;

  return (
    <>
      <Cart />

      <div className="bg-gray-50">
        <div className={`${PAGE_CONTAINER} py-4 md:py-6 lg:pr-24`}>
          {progressing ? (
            <div className="space-y-6">
              <RestaurantHeaderSkeleton />
              <div className="lg:grid lg:grid-cols-[220px_minmax(0,1fr)] lg:gap-8">
                <div className="hidden lg:block">
                  <CategorySidebar loading setIsScroll={undefined} />
                </div>
                <MenuSkeleton count={6} />
              </div>
            </div>
          ) : storeStatus ? (
            <StoreUnavailable moduleName="food" status={storeStatus} />
          ) : (
            <>
              {showStoreChrome && (
                <div className="space-y-4 md:space-y-5">
                  <RestaurantHeader compact={isProductPage} />
                  {isMenuHome && <CategoryBannerCarousel />}
                </div>
              )}

              {/* Sticky: must stay a direct child of this tall container. */}
              {showMenuNav && (
                <CategorySlider
                  className="mt-4 md:mt-5"
                  onNavigate={() => setIsScroll(true)}
                />
              )}

              {/* Grid items stretch to the row height so the sidebar's
                  sticky list can follow the menu. */}
              <div
                className={`mt-5 md:mt-8 ${
                  showMenuNav
                    ? "lg:grid lg:grid-cols-[220px_minmax(0,1fr)] lg:gap-8"
                    : ""
                }`}
              >
                {showMenuNav && <CategorySidebar setIsScroll={setIsScroll} />}

                <div ref={foodItemsRef} className="min-h-content min-w-0">
                  {children}
                </div>
              </div>
            </>
          )}
        </div>
        <Footer />
      </div>
    </>
  );
}
