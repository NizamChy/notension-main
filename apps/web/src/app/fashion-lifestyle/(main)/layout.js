import CategoryNav from "@/components/FashionLifestyle/shared/Navbar/CategoryNav";

export default function MainLayout({ children }) {
  return (
    <>
      <CategoryNav />
      {children}
    </>
  );
}
