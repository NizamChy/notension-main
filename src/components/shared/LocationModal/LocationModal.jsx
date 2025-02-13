"use client";

import { useState } from "react";
import MapModal from "./MapModal";
import LocationButton from "./LocationButton";

const LocationModal = () => {
  const [openModal, setOpenModal] = useState(false);

  const handleOpenModal = () => setOpenModal(true);
  const handleCloseModal = () => setOpenModal(false);

  return (
    <div className="mx-auto hidden md:block">
      <LocationButton onOpenModal={handleOpenModal} />
      <MapModal isOpen={openModal} onCloseModal={handleCloseModal} />
    </div>
  );
};

export default LocationModal;
