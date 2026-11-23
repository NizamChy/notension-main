import type { ReactNode } from "react";

export const metadata = {
  title: "Grocery",
  description:
    "Shop groceries and daily essentials from nearby stores with fast home delivery on NoTension.",
};

export default function GroceryLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
