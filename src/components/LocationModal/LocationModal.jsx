"use client";
import { useState } from "react";
import LocationButton from "./LocationButton";
import MapModal from "./MapModal";

const LocationModal = () => {
  const [openModal, setOpenModal] = useState(false);

  const [navLocation, setNavLocation] = useState("");

  const handleOpenModal = () => setOpenModal(true);
  const handleCloseModal = () => setOpenModal(false);

  return (
    <div className="mx-auto">
      <LocationButton onOpenModal={handleOpenModal} navLocation={navLocation} />
      <MapModal
        isOpen={openModal}
        onCloseModal={handleCloseModal}
        setNavLocation={setNavLocation}
      />
    </div>
  );
};

export default LocationModal;

// "use client";
// import { useState } from "react";
// import { FaLocationDot } from "react-icons/fa6";
// import Map from "../Map/Map";

// const LocationModal = () => {
//   const [openModal, setOpenModal] = useState(false);

//   const handleGetCurrentLocation = () => {
//     setOpenModal(true);
//   };

//   return (
//     <div className="mx-auto px-20 hidden md:block">
//       <button
//         onClick={handleGetCurrentLocation}
//         className="my-10 rounded-md px-5 py-2 text-xl text-white font-medium bg-primary w-full flex justify-center items-center gap-1"
//       >
//         <span>
//           <FaLocationDot />
//         </span>
//         <span>Select Location</span>
//       </button>
//       <div
//         onClick={() => setOpenModal(false)}
//         className={`fixed z-[100] inset-0 grid place-items-center bg-black/50 transition-opacity duration-200 ${
//           openModal ? "visible opacity-100" : "invisible opacity-0"
//         }`}
//       >
//         <div
//           onClick={(e) => e.stopPropagation()}
//           className={`relative w-full md:w-11/12 lg:w-1/2 bg-white p-6 rounded-lg shadow-lg transition-transform duration-300 ${
//             openModal ? "scale-100 opacity-100" : "scale-110 opacity-0"
//           }`}
//         >
//           <button
//             onClick={() => setOpenModal(false)}
//             className="absolute -top-4 -right-4 p-2 rounded-full bg-white text-gray-500 hover:text-primary"
//           >
//             <svg
//               className="w-6 h-6"
//               fill="none"
//               stroke="currentColor"
//               viewBox="0 0 24 24"
//               xmlns="http://www.w3.org/2000/svg"
//             >
//               <path
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//                 strokeWidth="2"
//                 d="M6 18L18 6M6 6l12 12"
//               ></path>
//             </svg>
//           </button>

//           <Map />
//         </div>
//       </div>
//     </div>
//   );
// };

// export default LocationModal;
