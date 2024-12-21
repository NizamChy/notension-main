// import MedicineStoreSearchBar from "@/components/Medicine/MedicineSearchStore/MedicineStoreSearchBar";

import MedicineStoreSearchBar from "@/components/Medicine/MedicineSearchStore/MedicineStoreSearchBar";

export default function AboutLayout({ children }) {
  return (
    <>
      <div className="w-1/2 mx-auto my-5">
        <MedicineStoreSearchBar />
      </div>
      <div> {children}</div>
    </>
  );
}
