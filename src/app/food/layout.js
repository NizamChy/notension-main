import Navbar from "@/components/Food/Navbar/Navbar";

export default function FoodLayout({ children }) {
  return (
    <>
      <Navbar />
      <div className="pt-10 md:pt-16">{children}</div>
    </>
  );
}
