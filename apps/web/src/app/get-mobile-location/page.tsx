import LocationPage from "@/components/shared/Map/LocationPage";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Delivery location" };

const page = () => <LocationPage />;

export default page;
