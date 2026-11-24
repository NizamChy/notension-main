import Footer from "@/components/shared/Footer/Footer";
import Navbar from "@/components/shared/Navbar/Navbar";
import Guide from "@/components/Guide/Guide";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Project guide",
  description:
    "How NoTension works end to end: every module, every role, and every step from the website to the customer's door. In English and Bangla.",
};

export default function GuidePage() {
  return (
    <>
      <Navbar />
      <main className="bg-gray-50 pt-16 lg:pt-[72px]">
        <div className="mx-auto max-w-6xl px-4 py-8 md:py-12">
          <Guide stickyTop="lg:top-24" />
        </div>
      </main>
      <Footer />
    </>
  );
}
