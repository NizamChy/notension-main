import type { ReactNode } from "react";
import type { Metadata } from "next";
import Navbar from "@/components/shared/Navbar/Navbar";
import Footer from "@/components/shared/Footer/Footer";
import { CartProvider } from "@/components/FashionLifestyle/context/CartContext";
import FashionNavActions from "@/components/FashionLifestyle/shared/Navbar/FashionNavActions";
import FashionCategoryButton from "@/components/FashionLifestyle/shared/Navbar/FashionCategoryButton";

export const metadata: Metadata = {
  title: "Fashion & Lifestyle",
  description:
    "Online Shopping Site for Fashion & Lifestyle in Bangladesh. Bangladesh's Fashion Expert brings you a variety of footwear, Clothing, Accessories and lifestyle products.",
};

export default function FashionLayout({ children }: { children: ReactNode }) {
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
