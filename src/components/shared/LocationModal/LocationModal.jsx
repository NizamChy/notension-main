"use client";
import { useState } from "react";
import LocationButton from "./LocationButton";
import MapModal from "./MapModal";

const LocationModal = () => {
  const [openModal, setOpenModal] = useState(false);

  const handleOpenModal = () => setOpenModal(true);
  const handleCloseModal = () => setOpenModal(false);

  return (
    <div className="mx-auto pt-2">
      <LocationButton onOpenModal={handleOpenModal} />
      <MapModal isOpen={openModal} onCloseModal={handleCloseModal} />
    </div>
  );
};

export default LocationModal;
