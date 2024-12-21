import SelectedCategory from "@/components/Food/FoodCategorySection/SelectedCategory";
import FoodStoreSearchBar from "@/components/Food/FoodSearchStore/FoodStoreSearchBar";

export default function FoodCategoryLayout({ children }) {
  return (
    <>
      <SelectedCategory />
      <div className="w-1/2 mx-auto my-5">
        <FoodStoreSearchBar />
      </div>

      <>{children}</>
    </>
  );
}
