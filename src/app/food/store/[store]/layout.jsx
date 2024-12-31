"use client";
import Cart from "@/components/Cart/Cart";
import CategoryBannerCarousel from "@/components/Food/CategoryBannerCarousel/CategoryBannerCarousel";
import CategorySidebar from "@/components/Food/CategorySidebar/CategorySidebar";
import CategorySlider from "@/components/Food/CategorySidebar/CategorySlider";
import Footer from "@/components/shared/Footer/Footer";
import { useParams, usePathname } from "next/navigation";
import { useRef } from "react";

export default function RootLayout({ children }) {
  const foodItemsRef = useRef(null);

  const pathname = usePathname();
  const params = useParams();

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

  return (
    <>
      <Cart />
      <div className="flex justify-center bg-[#F3F4F6]">
        <div className="lg:w-[20%] hidden lg:block">
          <div className="fixed top-0 left-0 w-[20%] h-full">
            <CategorySidebar scrollToFoodItems={scrollToFoodItems} />
          </div>
        </div>

        <div className="w-full lg:w-[80%] ml-auto md:p-16">
          <CategoryBannerCarousel />
          {pathname !== `/food/store/${params?.store}` && <CategorySlider />}

          <div ref={foodItemsRef} className="min-h-content mt-5">
            {children}
          </div>
          <Footer />
        </div>
      </div>
    </>
  );
}
