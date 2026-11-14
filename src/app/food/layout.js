import Navbar from "@/components/shared/Navbar/Navbar";

export const metadata = {
  title: "Food",
  description:
    "Order food from nearby restaurants and food stores in your area with NoTension.",
};

export default function FoodLayout({ children }) {
  return (
    <>
      <Navbar />
      <div className="pt-16 lg:pt-[72px]">{children}</div>
    </>
  );
}
