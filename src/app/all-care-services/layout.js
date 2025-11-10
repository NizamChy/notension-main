import Footer from "@/components/shared/Footer/Footer";
import Navbar from "@/components/shared/Navbar/Navbar";

export default function AllCareLayout({ children }) {
  return (
    <>
      <Navbar />
      <div className="pt-14 md:pt-16">{children}</div>
      <Footer />
    </>
  );
}
