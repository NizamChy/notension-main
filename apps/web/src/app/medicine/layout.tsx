import type { ReactNode } from "react";

export const metadata = {
  title: "Medicine",
  description:
    "Order medicines and healthcare products from nearby pharmacies with home delivery on NoTension.",
};

export default function MedicineLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
