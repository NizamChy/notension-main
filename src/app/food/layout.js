import LocationModal from "@/components/LocationModal/LocationModal";

export default function FoodLayout({ children }) {
  return (
    <>
      <LocationModal />
      {children}
    </>
  );
}
