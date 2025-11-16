import Navbar from "@/components/Food/Navbar/Navbar";

export const metadata = {
  title: "Notension | Food",
  description:
    "Online Shopping Site for Fashion & Lifestyle in Bangladesh. Bangladesh's Fashion Expert brings you a variety of footwear, Clothing, Accessories and lifestyle products.",
};

export default function FoodLayout({ children }) {
  return (
    <>
      <Navbar />
      <div className="pt-16">{children}</div>
    </>
  );
}
