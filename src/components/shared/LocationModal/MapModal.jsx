"use client";
import Map from "../Map/Map";

const MapModal = ({ isOpen, onCloseModal }) => {
  return (
    <div
      onClick={onCloseModal}
      className={`fixed z-10 inset-0 grid place-items-center bg-black/50 transition-opacity duration-200 ${
        isOpen ? "visible opacity-100" : "invisible opacity-0"
      }`}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={`relative w-full md:w-11/12 lg:w-1/2 bg-white p-6 rounded-lg shadow-lg transition-transform duration-300 ${
          isOpen ? "scale-100 opacity-100" : "scale-110 opacity-0"
        }`}
      >
        <button
          onClick={onCloseModal}
          className="absolute -top-4 -right-4 p-2 rounded-full bg-white text-gray-500 hover:text-primary"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M6 18L18 6M6 6l12 12"
            ></path>
          </svg>
        </button>

        {isOpen && <Map onCloseModal={onCloseModal} />}
      </div>
    </div>
  );
};

export default MapModal;
