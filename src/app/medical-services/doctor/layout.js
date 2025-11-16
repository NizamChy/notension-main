import Footer from "@/components/shared/Footer/Footer";
import Navbar from "@/components/shared/Navbar/Navbar";
import LocationMobile from "@/components/shared/LocationModal/LocationMobile";

export const metadata = {
  title: "Notension | Find Doctor",
  description:
    "Online Shopping Site for Fashion & Lifestyle in Bangladesh. Bangladesh's Fashion Expert brings you a variety of footwear, Clothing, Accessories and lifestyle products.",
};

export default function DoctorLayout({ children }) {
  return (
    <>
      <Navbar />
      <div className="pt-16 md:pt-20">
        <LocationMobile />
        {children}
      </div>
      <Footer />
    </>
  );
}
