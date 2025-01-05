import SelectedCategory from "@/components/Food/FoodCategorySection/SelectedCategory";
import FoodStoreSearchBar from "@/components/Food/FoodSearchStore/FoodStoreSearchBar";
import Footer from "@/components/shared/Footer/Footer";
import LocationMobile from "@/components/shared/LocationModal/LocationMobile";

export default function FoodCategoryLayout({ children }) {
  return (
    <>
      <LocationMobile />
      <SelectedCategory />
      <div className="w-2/3 md:w-1/2 lg:w-1/3 mx-auto my-5">
        <FoodStoreSearchBar />
      </div>

      {children}
      <Footer />
    </>
  );
}
