import { Toaster } from "react-hot-toast";
import { Hind_Siliguri } from "next/font/google";
import Navbar from "@/components/FashionLifestyle/shared/Navbar/Navbar";
import Footer from "@/components/FashionLifestyle/shared/Footer/Footer";
import { CartProvider } from "@/components/FashionLifestyle/context/CartContext";

const HindSiliguri = Hind_Siliguri({
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["latin"],
});

export const metadata = {
  title: "Notension | Fashion & Lifestyle",
  description:
    "Online Shopping Site for Fashion & Lifestyle in Bangladesh. Bangladesh's Fashion Expert brings you a variety of footwear, Clothing, Accessories and lifestyle products.",
};

export default function RootLayout({ children }) {
  return (
    <div className={HindSiliguri.className}>
      <CartProvider>
        <Toaster />
        <Navbar />
        {children}
        <Footer />
      </CartProvider>
    </div>
  );
}
