import type { ReactNode } from "react";
import StoreCategoryNav from "@/components/FashionLifestyle/store/StoreCategoryNav";

export default function ShopLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <StoreCategoryNav />
      {children}
    </>
  );
}
