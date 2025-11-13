import StoreCategoryNav from "@/components/store/StoreCategoryNav";

export default function ShopLayout({ children }) {
  return (
    <>
      <StoreCategoryNav />
      {children}
    </>
  );
}
