import Navbar from "@/components/FashionLifestyle/shared/Navbar/Navbar";
import Footer from "@/components/FashionLifestyle/shared/Footer/Footer";
import { CartProvider } from "@/components/FashionLifestyle/context/CartContext";

export const metadata = {
  title: "Notension | Fashion & Lifestyle",
  description:
    "Online Shopping Site for Fashion & Lifestyle in Bangladesh. Bangladesh's Fashion Expert brings you a variety of footwear, Clothing, Accessories and lifestyle products.",
};

export default function RootLayout({ children }) {
  return (
    <CartProvider>
      <Navbar />
      {children}
      <Footer />
    </CartProvider>
  );
}
