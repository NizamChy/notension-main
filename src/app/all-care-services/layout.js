import Footer from "@/components/shared/Footer/Footer";
import Navbar from "@/components/shared/Navbar/Navbar";

export const metadata = {
  title: "Notension | All Care Service",
  description:
    "Online Shopping Site for Fashion & Lifestyle in Bangladesh. Bangladesh's Fashion Expert brings you a variety of footwear, Clothing, Accessories and lifestyle products.",
};

export default function AllCareLayout({ children }) {
  return (
    <>
      <Navbar />
      <div className="pt-14 md:pt-16">{children}</div>
      <Footer />
    </>
  );
}
