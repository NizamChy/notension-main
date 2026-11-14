import Footer from "@/components/shared/Footer/Footer";
import Navbar from "@/components/shared/Navbar/Navbar";
import LocationMobile from "@/components/shared/LocationModal/LocationMobile";
import MedicalCenterSearchbar from "@/components/MedicalServices/SearchMedicalCenter/MedicalCenterSearchbar";

export const metadata = {
  title: "Search Medical Centers",
  description:
    "Search hospitals, diagnostic, eye care and dental care centers with NoTension.",
};

export default function SearchCenterLayout({ children }) {
  return (
    <>
      <Navbar />
      <div className="min-h-content pt-16 md:pt-20">
        <LocationMobile />
        <div className="max-w-2xl mx-auto px-4 pt-6 md:pt-8">
          <MedicalCenterSearchbar />
        </div>
        {children}
      </div>
      <Footer />
    </>
  );
}
