"use client";
import CategoryBannerCarousel from "@/components/Food/CategoryBannerCarousel/CategoryBannerCarousel";
import CategorySidebar from "@/components/Food/CategorySidebar/CategorySidebar";
import CategorySlider from "@/components/Food/CategorySidebar/CategorySlider";
import Footer from "@/components/shared/Footer/Footer";
import { useFood } from "@/hooks/fetch-data/useFood";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

export default function RootLayout({ children }) {
  const foodItemsRef = useRef(null);

  const { exploreStore } = useFood();

  const pathname = usePathname();

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
    // <>
    //   <div className="bg-[#F3F4F6] min-h-[100vh]">
    //     {/* <Cart /> */}
    //     <div className="flex gap-5 py-10">
    //       <div className="hidden lg:flex justify-center w-[25%]">
    //         <CategorySidebar scrollToFoodItems={scrollToFoodItems} />
    //       </div>

    //       <div className="lg:w-[70%]">
    //         <CategoryBannerCarousel />
    //         {pathname !== "/food-category" && <CategorySlider />}

    //         <div ref={foodItemsRef}>{children}</div>
    //         <Footer />
    //       </div>
    //     </div>
    //   </div>
    // </>

    //   <div className="bg-[#F3F4F6] min-h-screen">
    //   <div className="mx-auto flex flex-col lg:flex-row gap-5 py-10 px-4 md:px-20">
    //     {/* Sidebar - Hidden on smaller screens */}
    //     <div className="hidden lg:block lg:w-1/4 ml-auto">
    //       <CategorySidebar scrollToFoodItems={scrollToFoodItems} />
    //     </div>

    //     {/* Main Content */}
    //     <div className="w-full lg:w-3/4 ">
    //       <CategoryBannerCarousel />
    //       {pathname !== "/food-category" && <CategorySlider />}
    //       <div ref={foodItemsRef} className="mt-5">
    //         {children}
    //       </div>
    //       <Footer />
    //     </div>
    //   </div>
    // </div>

    <>
      <div className="flex justify-center bg-[#F3F4F6]">
        <div className="lg:w-[20%] hidden lg:block">
          <div className="fixed top-0 left-0 w-[20%] h-full">
            <CategorySidebar scrollToFoodItems={scrollToFoodItems} />
          </div>
        </div>

        <div className="w-full lg:w-[80%] ml-auto md:p-16">
          <CategoryBannerCarousel />
          {pathname !== "/food-category" && <CategorySlider />}

          <div ref={foodItemsRef} className="min-h-content mt-5">
            {children}
          </div>
          <Footer />
        </div>
      </div>
    </>
  );
}
