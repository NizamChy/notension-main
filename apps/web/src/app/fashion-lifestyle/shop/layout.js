import StoreCategoryNav from "@/components/FashionLifestyle/store/StoreCategoryNav";

export default function ShopLayout({ children }) {
  return (
    <>
      <StoreCategoryNav />
      {children}
    </>
  );
}
