import Footer from "@/components/shared/Footer/Footer";
import Navbar from "@/components/shared/Navbar/Navbar";

export const metadata = {
  title: "All Care Services",
  description:
    "Book nurses, caregivers, ambulances and other home care services near you with NoTension.",
};

export default function AllCareLayout({ children }) {
  return (
    <>
      <Navbar />
      <div className="pt-16 lg:pt-[72px]">{children}</div>
      <Footer />
    </>
  );
}
