import GroceryStoreSearchBar from "@/components/Grocery/GrocerySearchStore/GroceryStoreSearchBar";
import LocationModal from "@/components/shared/LocationModal/LocationModal";
import Navbar from "@/components/shared/Navbar/Navbar";

export default function AboutLayout({ children }) {
  return (
    <>
      <div className="pb-20">
        <Navbar />
      </div>
      <LocationModal />
      <div className="w-1/2 mx-auto my-5">
        <GroceryStoreSearchBar />
      </div>
      <>{children}</>
    </>
  );
}
