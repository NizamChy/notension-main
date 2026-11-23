import type { ReactNode } from "react";
import Navbar from "@/components/shared/Navbar/Navbar";
import Footer from "@/components/shared/Footer/Footer";
import LocationMobile from "@/components/shared/LocationModal/LocationMobile";
import SearchBar from "@/components/StoreModule/SearchBar";

export default function GroceryHomeLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <div className="min-h-content">
        <div className="pb-16 lg:pb-20">
          {/* boundary: legacy JS caller. Navbar and SearchBar are JS, so TS reads
              every prop as required; the defaults are what they used before. */}
          <Navbar search={undefined} leading={undefined} actions={undefined} />
        </div>
        <LocationMobile />
        <div className="mx-auto my-5 max-w-2xl px-4 md:my-8">
          <SearchBar moduleName="grocery" scope="store" size="lg" onSubmitted={undefined} />
        </div>
        {children}
      </div>

      <Footer />
    </>
  );
}
