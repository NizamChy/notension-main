import Navbar from "@/components/shared/Navbar/Navbar";
import Footer from "@/components/shared/Footer/Footer";
import LocationMobile from "@/components/shared/LocationModal/LocationMobile";
import SearchBar from "@/components/StoreModule/SearchBar";

export default function MedicineStoreLayout({ children }) {
  return (
    <>
      <div className="min-h-content">
        <div className="pb-16 lg:pb-20">
          <Navbar />
        </div>
        <LocationMobile />
        <div className="mx-auto my-5 max-w-2xl px-4 md:my-8">
          <SearchBar moduleName="medicine" scope="store" size="lg" />
        </div>
        {children}
      </div>
      <Footer />
    </>
  );
}
