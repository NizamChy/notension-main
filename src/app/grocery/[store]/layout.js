import Cart from "@/components/Cart/Cart";

import CategorySidebar from "@/components/Grocery/GroceryCategorySection/CategorySidebar";
import Navbar from "@/components/Grocery/Navbar/Navbar";
import Footer from "@/components/shared/Footer/Footer";

export default function GroceryStoreLayout({ children }) {
  return (
    <>
      <Cart />
      <Navbar />
      <div className="flex justify-center">
        <div className="lg:w-[20%] hidden lg:block">
          <div className="fixed top-0 left-0 w-[20%] h-full">
            <CategorySidebar />
          </div>
        </div>

        <div className="w-full lg:w-[80%] ml-auto">
          <div className="min-h-content">{children}</div>
          <Footer />
        </div>
      </div>
    </>
  );
}
