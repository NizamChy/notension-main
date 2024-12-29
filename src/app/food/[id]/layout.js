import SelectedCategory from "@/components/Food/FoodCategorySection/SelectedCategory";
import FoodStoreSearchBar from "@/components/Food/FoodSearchStore/FoodStoreSearchBar";
import Footer from "@/components/shared/Footer/Footer";
import LocationModal from "@/components/shared/LocationModal/LocationModal";

export default function FoodCategoryLayout({ children }) {
  return (
    <>
      <LocationModal />
      <SelectedCategory />
      <div className="w-1/2 mx-auto my-5">
        <FoodStoreSearchBar />
      </div>

      {children}
      <Footer />
    </>
  );
}
