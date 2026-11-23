"use client";

import { useEffect, type ReactNode } from "react";
import Cart from "@/components/Cart/Cart";
import StoreUnavailable from "@/components/ShopInfoSection/StoreUnavailable";
import Loader from "@/components/common/Loader";
import Footer from "@/components/shared/Footer/Footer";
import Navbar from "@/components/shared/Navbar/Navbar";
import StoreCategoryDrawer from "@/components/StoreModule/StoreCategoryDrawer";
import { STORE_PAGE_CLASS } from "@/components/StoreModule/storeModules";
import StoreCategorySidebar from "@/components/StoreModule/StoreCategorySidebar";
import { useMedicineStore } from "@/hooks/medicine/useMedicineStore";
import { useStoreRef } from "@/hooks/grocery/useStoreRef";
import { usePreferencesStore } from "@/stores/preferencesStore";

export default function MedicineStoreLayout({ children }: { children: ReactNode }) {
  const { isLoading, status } = useMedicineStore();
  const ref = useStoreRef();

  // As the old explore did on every store visit, open or not: the cart and
  // the post-login redirect follow Medicine from here.
  useEffect(() => {
    if (ref) usePreferencesStore.getState().setCurrentModule("Medicine");
  }, [ref]);

  return (
    <>
      <Cart />
      {/* boundary: legacy JS caller. Navbar is JS, so TS reads every prop as
          required; no actions here. */}
      <Navbar
        search="medicine"
        leading={<StoreCategoryDrawer moduleName="medicine" />}
        actions={undefined}
      />
      <div className="flex justify-center">
        <div className="lg:w-[20%] hidden lg:block">
          <div className="fixed top-0 left-0 w-[20%] h-full">
            <StoreCategorySidebar moduleName="medicine" />
          </div>
        </div>

        <div className="w-full lg:w-[80%] ml-auto min-w-0">
          {isLoading ? (
            <div className="min-h-content mx-auto flex justify-center items-center">
              <Loader />
            </div>
          ) : (
            <div className={`min-h-content ${STORE_PAGE_CLASS}`}>
              {status ? <StoreUnavailable moduleName="medicine" status={status} /> : children}
            </div>
          )}

          <Footer />
        </div>
      </div>
    </>
  );
}
