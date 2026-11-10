import Footer from "@/components/shared/Footer/Footer";
import Navbar from "@/components/shared/Navbar/Navbar";
import LocationMobile from "@/components/shared/LocationModal/LocationMobile";

export const metadata = {
  title: "Find Hospital",
  description:
    "Find nearby and top-rated hospitals in your district with NoTension.",
};

export default function HospitalLayout({ children }) {
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
