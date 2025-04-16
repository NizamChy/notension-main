"use client";

import Cart from "@/components/Cart/Cart";
import Footer from "@/components/shared/Footer/Footer";
import Navbar from "@/components/Grocery/Navbar/Navbar";
import CategorySidebar from "@/components/Grocery/GroceryCategorySection/CategorySidebar";
import { useParams } from "next/navigation";
import { useGroceryShop } from "@/hooks/fetch-data/useGroceryShop";
import { useEffect } from "react";

export default function GroceryStoreLayout({ children }) {
  const params = useParams();

  const { exploreStore, progressing } = useGroceryShop();

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
      <Navbar />
      <div className="flex justify-center">
        <div className="lg:w-[20%] hidden lg:block">
          <div className="fixed top-0 left-0 w-[20%] h-full">
            <CategorySidebar />
          </div>
        </div>

        <div className="w-full lg:w-[80%] ml-auto">
          <div className="min-h-content">{children}</div>
          <Footer />
        </div>
      </div>
    </>
  );
}
