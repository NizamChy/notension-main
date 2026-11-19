import Footer from "@/components/shared/Footer/Footer";
import LocationMobile from "@/components/shared/LocationModal/LocationMobile";
import SelectedCategory from "@/components/Food/FoodCategorySection/SelectedCategory";
import FoodStoreSearchBar from "@/components/Food/FoodSearchStore/FoodStoreSearchBar";

export default function FoodCategoryLayout({ children }) {
  return (
    <>
      <LocationMobile />
      <SelectedCategory>
        <FoodStoreSearchBar />
      </SelectedCategory>

      <div className="bg-gray-50">{children}</div>
      <Footer />
    </>
  );
}
