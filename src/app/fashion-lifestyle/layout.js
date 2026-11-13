import Navbar from "@/components/shared/Navbar/Navbar";
import Footer from "@/components/FashionLifestyle/shared/Footer/Footer";
import { CartProvider } from "@/components/FashionLifestyle/context/CartContext";
import FashionNavActions from "@/components/FashionLifestyle/shared/Navbar/FashionNavActions";
import FashionCategoryButton from "@/components/FashionLifestyle/shared/Navbar/FashionCategoryButton";

export const metadata = {
  title: "Fashion & Lifestyle",
  description:
    "Online Shopping Site for Fashion & Lifestyle in Bangladesh. Bangladesh's Fashion Expert brings you a variety of footwear, Clothing, Accessories and lifestyle products.",
};

export default function RootLayout({ children }) {
  return (
    <CartProvider>
      <Navbar
        search="fashion"
        leading={<FashionCategoryButton />}
        actions={<FashionNavActions />}
      />
      {/* Room for the fixed navbar */}
      <div className="h-16 lg:h-[72px]" />
      {children}
      <Footer />
    </CartProvider>
  );
}
