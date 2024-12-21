"use client";
import CategoryBannerCarousel from "@/components/Food/CategoryBannerCarousel/CategoryBannerCarousel";
import CategorySidebar from "@/components/Food/CategorySidebar/CategorySidebar";
import CategorySlider from "@/components/Food/CategorySidebar/CategorySlider";
import { useFood } from "@/hooks/fetch-data/useFood";
// import CategoryBannerCarousel from "@/components/FoodCategorySection/CategoryBannerCarousel/CategoryBannerCarousel";
// import CategorySidebar from "@/components/FoodCategorySection/CategorySidebar/CategorySidebar";
// import CategorySlider from "@/components/FoodCategorySection/CategorySidebar/CategorySlider";
// import MobileLocationButton from "@/components/MobileLocation/MobileLocationButton";
// import Cart from "@/components/Cart/Cart";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
// import { useShop } from "@/hooks/fetch-data/useShop";
// import LocationModal from "@/components/LocationModal/LocationModal";

export default function RootLayout({ children }) {
  const foodItemsRef = useRef(null);
  // const { exploreStore } = useShop();
  const { exploreStore } = useFood();

  const pathname = usePathname();

  // const scrollToFoodItems = () => {
  //   if (foodItemsRef.current) {
  //     foodItemsRef.current.scrollIntoView({
  //       behavior: "smooth",
  //       block: "start",
  //     });
  //   }
  // };

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
    exploreStore();
  }, []);

  return (
    <div className="bg-[#F3F4F6] min-h-[100vh]">
      {/* <Cart /> */}
      <div className="flex gap-5 py-10 md:mx-10">
        <div className="hidden lg:flex justify-center w-[25%]">
          <CategorySidebar scrollToFoodItems={scrollToFoodItems} />
        </div>

        <div className="lg:w-[70%]">
          {/* <LocationModal /> */}
          {/* <MobileLocationButton /> */}
          <CategoryBannerCarousel />
          {pathname !== "/food-category" && <CategorySlider />}

          <div ref={foodItemsRef}>{children}</div>
        </div>
      </div>
    </div>
  );
}
