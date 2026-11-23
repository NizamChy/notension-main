import type { ReactNode } from "react";
import CategoryNav from "@/components/FashionLifestyle/shared/Navbar/CategoryNav";

export default function MainLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <CategoryNav />
      {children}
    </>
  );
}
