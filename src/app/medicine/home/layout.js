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
        <div className="w-2/3 md:w-1/2 lg:w-1/3 mx-auto my-5">
          <SearchBar moduleName="medicine" scope="store" />
        </div>
        {children}
      </div>
      <Footer />
    </>
  );
}
