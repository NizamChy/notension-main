"use client";

import { useEffect } from "react";
import Cart from "@/components/Cart/Cart";
import { useParams } from "next/navigation";
import Loader from "@/components/common/Loader";
import Footer from "@/components/shared/Footer/Footer";
import Navbar from "@/components/Medicine/Navbar/Navbar";
import { useMedicine } from "@/hooks/fetch-data/useMedicine";
import CategorySidebar from "@/components/Medicine/MedicineCategorySection/CategorySidebar";

export default function MedicineStoreLayout({ children }) {
  const params = useParams();
  const { exploreStore, progressing } = useMedicine();

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
          {progressing ? (
            <div className="min-h-content mx-auto flex justify-center items-center">
              <Loader />
            </div>
          ) : (
            <div className="min-h-content">{children}</div>
          )}
          <Footer />
        </div>
      </div>
    </>
  );
}
