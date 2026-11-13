import Footer from "@/components/shared/Footer/Footer";
import LocationMobile from "@/components/shared/LocationModal/LocationMobile";
import SelectedCategory from "@/components/Food/FoodCategorySection/SelectedCategory";
import FoodStoreSearchBar from "@/components/Food/FoodSearchStore/FoodStoreSearchBar";

export default function FoodCategoryLayout({ children }) {
  return (
    <>
      <LocationMobile />
      <SelectedCategory />
      <div className="mx-auto my-5 max-w-2xl px-4 md:my-8">
        <FoodStoreSearchBar />
      </div>

      {children}
      <Footer />
    </>
  );
}
