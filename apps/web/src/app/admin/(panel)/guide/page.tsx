import type { Metadata } from "next";
import Guide from "@/components/Guide/Guide";

export const metadata: Metadata = { title: "Guide" };

export default function AdminGuidePage() {
  return <Guide stickyTop="lg:top-8" />;
}
