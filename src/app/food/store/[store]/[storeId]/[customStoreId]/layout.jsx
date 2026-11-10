"use client";

import Cart from "@/components/Cart/Cart";
import Loader from "@/components/common/Loader";
import { useEffect, useRef, useState } from "react";
import { useFood } from "@/hooks/fetch-data/useFood";
import Footer from "@/components/shared/Footer/Footer";
import { useParams, usePathname, useRouter } from "next/navigation";
import ShopInfo from "@/components/ShopInfoSection/ShopInfo";
import CategorySlider from "@/components/Food/CategorySidebar/CategorySlider";
import CategorySidebar from "@/components/Food/CategorySidebar/CategorySidebar";
import CategoryBannerCarousel from "@/components/Food/CategoryBannerCarousel/CategoryBannerCarousel";

export default function FoodLayout({ children }) {
  const [isScroll, setIsScroll] = useState(false);

  const router = useRouter();
  const params = useParams();
  const pathname = usePathname();
  const foodItemsRef = useRef(null);

  const { exploreStore, progressing } = useFood();

  const scrollToFoodItems = () => {
    if (isScroll) {
      if (params?.catId && foodItemsRef.current) {
        const elementPosition =
          foodItemsRef.current.getBoundingClientRect().top + window.scrollY;
        const offset = window.innerHeight * 0.1;

        window.scrollTo({
          top: elementPosition - offset,
          behavior: "smooth",
        });
      }
    }

    setIsScroll(false);
  };

  useEffect(() => {
    if (params?.storeId && params?.customStoreId) {
      const shop = {
        _id: params?.storeId,
        custom_store_id: params?.customStoreId,
      };

      exploreStore(shop);
    }
    // Re-fetch when the user navigates to a different store; exploreStore is
    // recreated on every render, so it is intentionally not a dependency.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params?.storeId, params?.customStoreId]);

  return (
    <>
      <Cart />

      {progressing ? (
        <div className="min-h-[70vh] flex justify-center items-center">
          <Loader />
        </div>
      ) : (
        <div className="flex justify-center bg-[#F3F4F6]">
          <div className="lg:w-[25%] xl:w-[20%] hidden lg:block">
            <div className="fixed top-0 left-0 w-[25%] xl:w-[20%] h-full">
              <CategorySidebar
                scrollToFoodItems={scrollToFoodItems}
                setIsScroll={setIsScroll}
              />
            </div>
          </div>

          <div className="w-full lg:w-[75%] xl:w-[80%] ml-auto min-w-0">
            {/* Same frame as the grocery / medicine store pages: one side
                padding per breakpoint and a right gutter on lg+ for the
                floating cart tab. */}
            <div className="px-4 md:px-6 lg:pl-8 lg:pr-24 py-5 md:py-8">
              {!pathname.includes("/orders") &&
                !pathname.includes("/checkout") &&
                !pathname.includes("/user") && (
                  <div className="space-y-4 md:space-y-5">
                    <button
                      type="button"
                      onClick={() =>
                        router.push(
                          `/food/store/${params?.store}/${params?.storeId}/${params?.customStoreId}`
                        )
                      }
                      className="block w-full text-left"
                    >
                      <ShopInfo moduleName="food" layout="row" />
                    </button>
                    <CategoryBannerCarousel />
                  </div>
                )}

              {pathname ===
                `/food/store/${params?.store}/${params?.storeId}/${params?.customStoreId}/${params?.catId}` && (
                <CategorySlider />
              )}

              <div ref={foodItemsRef} className="min-h-content mt-6 md:mt-8">
                {children}
              </div>
            </div>
            <Footer />
          </div>
        </div>
      )}
    </>
  );
}
