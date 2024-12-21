import CategorySidebar from "@/components/Medicine/MedicineCategorySection/CategorySidebar";

export default function MedicineStoreLayout({ children }) {
  return (
    <>
      <div className="flex justify-center">
        <div className="lg:w-[20%] hidden lg:block">
          <div className="fixed top-0 left-0 w-[20%] h-full">
            <CategorySidebar />
          </div>
        </div>

        <div className="w-full lg:w-[80%] ml-auto">{children}</div>
      </div>
    </>
  );
}
