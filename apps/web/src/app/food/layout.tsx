import type { ReactNode } from "react";
import Navbar from "@/components/shared/Navbar/Navbar";

export const metadata = {
  title: "Food",
  description:
    "Order food from nearby restaurants and food stores in your area with NoTension.",
};

export default function FoodLayout({ children }: { children: ReactNode }) {
  return (
    <>
      {/* boundary: legacy JS caller. Navbar is JS, so TS reads every prop as
          required; this layout passes none. */}
      <Navbar search={undefined} leading={undefined} actions={undefined} />
      <div className="pt-16 lg:pt-[72px]">{children}</div>
    </>
  );
}
