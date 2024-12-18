import LocationModal from "@/components/LocationModal/LocationModal";
import MedicineStoreSearchBar from "@/components/MedicineSearchStore/MedicineStoreSearchBar";

export default function AboutLayout({ children }) {
  return (
    <>
      <LocationModal />
      <div className="w-1/2 mx-auto my-5">
        <MedicineStoreSearchBar />
      </div>
      <div> {children}</div>
    </>
  );
}
