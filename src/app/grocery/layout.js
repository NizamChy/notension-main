import GroceryStoreSearchBar from "@/components/GrocerySearchStore/GroceryStoreSearchBar";
import LocationModal from "@/components/LocationModal/LocationModal";

export default function AboutLayout({ children }) {
  return (
    <>
      <LocationModal />
      <div className="w-1/2 mx-auto my-5">
        <GroceryStoreSearchBar />
      </div>
      <>{children}</>
    </>
  );
}
