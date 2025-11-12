"use client";

import { useState } from "react";
import MapModal from "./MapModal";
import LocationButton from "./LocationButton";

const LocationModal = () => {
  const [openMapModal, setOpenMapModal] = useState(false);

  const handleOpenMapModal = () => setOpenMapModal(true);
  const handleCloseMapModal = () => setOpenMapModal(false);

  return (
    <div className="mx-auto hidden md:block">
      <LocationButton onOpenModal={handleOpenMapModal} />

      {openMapModal && (
        <MapModal isOpen={openMapModal} onCloseModal={handleCloseMapModal} />
      )}
    </div>
  );
};

export default LocationModal;
