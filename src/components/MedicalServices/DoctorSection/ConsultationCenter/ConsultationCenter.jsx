import React from "react";
import Image from "next/image";

const consultationData = [
  {
    id: 1,
    name: "Evercare Hospital Chittagong",
    address:
      "Plot No. H1, Anannya CDA Residential Area, Oxygen - Kuwaish Rd, Chattogram 4337",
    image: "/images/medical-services/evercare-hospital.jpg",
  },
  {
    id: 2,
    name: "Medical Center Hospital",
    address: "123 CDA Avenue, Chattogram 4000",
    image: "/images/medical-services/evercare-hospital.jpg",
  },
  {
    id: 3,
    name: "Chattogram General Hospital",
    address: "456 General Road, Chattogram 4100",
    image: "/images/medical-services/evercare-hospital.jpg",
  },
  {
    id: 4,
    name: "Diabetes Center Chattogram",
    address: "789 Diabetes Lane, Chattogram 4200",
    image: "/images/medical-services/evercare-hospital.jpg",
  },
];

const ConsultationCenter = () => {
  return (
    <div className="flex justify-center px-4 lg:px-28 py-5 lg:py-20">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
        {consultationData.map((center) => (
          <div
            key={center.id}
            className="bg-white border rounded-lg shadow-md overflow-hidden"
          >
            <div className="relative w-full h-48">
              <Image
                src={center.image}
                alt={center.name}
                layout="fill"
                objectFit="cover"
                className="rounded-t-lg"
              />
            </div>
            <div className="p-4">
              <h3 className="text-sm md:text-xl font-semibold text-[#A93356] mb-2">
                {center.name}
              </h3>
              <p className="text-xs md:text-sm text-gray-600">
                {center.address}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ConsultationCenter;
