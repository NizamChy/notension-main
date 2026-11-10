import Footer from "@/components/shared/Footer/Footer";
import Navbar from "@/components/shared/Navbar/Navbar";
import LocationMobile from "@/components/shared/LocationModal/LocationMobile";

export const metadata = {
  title: "Find Dental Care Center",
  description:
    "Find nearby dental care centers and dentists with NoTension.",
};

export default function DentalCareCenterLayout({ children }) {
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
