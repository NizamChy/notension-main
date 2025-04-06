"use client";

import Cart from "@/components/Cart/Cart";
import { useSelector } from "react-redux";
import { useEffect, useRef } from "react";
import Loader from "@/components/common/Loader";
import { useFood } from "@/hooks/fetch-data/useFood";
import Footer from "@/components/shared/Footer/Footer";
import { useParams, usePathname, useRouter } from "next/navigation";
import ShopInfoCard from "@/components/ShopInfoSection/ShopInfoCard";
import CategorySlider from "@/components/Food/CategorySidebar/CategorySlider";
import CategorySidebar from "@/components/Food/CategorySidebar/CategorySidebar";
import CategoryBannerCarousel from "@/components/Food/CategoryBannerCarousel/CategoryBannerCarousel";

export default function RootLayout({ children }) {
  const router = useRouter();
  const params = useParams();
  const pathname = usePathname();
  const foodItemsRef = useRef(null);

  const { exploreStore, progressing } = useFood();
  const { visitedFoodStore } = useSelector((state) => state.dashboard);

  const scrollToFoodItems = () => {
    if (foodItemsRef.current) {
      const elementPosition =
        foodItemsRef.current.getBoundingClientRect().top + window.scrollY;
      const offset = window.innerHeight * 0.16;

      window.scrollTo({
        top: elementPosition - offset,
        behavior: "smooth",
      });
    }
  };

  useEffect(() => {
    if (params?.storeId && params?.customStoreId) {
      const shop = {
        _id: params?.storeId,
        custom_store_id: params?.customStoreId,
      };

      exploreStore(shop);
    }
  }, []);

  return (
    <>
      <Cart />

      {progressing ? (
        <Loader />
      ) : (
        <div className="flex justify-center bg-[#F3F4F6]">
          <div className="lg:w-[20%] hidden lg:block">
            <div className="fixed top-0 left-0 w-[20%] h-full">
              <CategorySidebar scrollToFoodItems={scrollToFoodItems} />
            </div>
          </div>

          <div className="w-full lg:w-[80%] ml-auto md:p-16">
            <div className="flex flex-col gap-2 lg:flex-row lg:gap-10">
              <div className="lg:w-1/2 xl:w-1/3 px-4 lg:px-0">
                <ShopInfoCard
                  onClick={() =>
                    router.push(
                      `/food/store/${params?.store}/${params?.storeId}/${params?.customStoreId}`
                    )
                  }
                  shop={visitedFoodStore}
                  type="food"
                />
              </div>
              <div className="lg:w-1/2 xl:w-2/3">
                <CategoryBannerCarousel />
              </div>
            </div>

            {pathname !==
              `/food/store/${params?.store}/${params?.storeId}/${params?.customStoreId}` && (
              <CategorySlider />
            )}

            <div ref={foodItemsRef} className="min-h-content mt-5">
              {children}
            </div>
            <Footer />
          </div>
        </div>
      )}
    </>
  );
}
