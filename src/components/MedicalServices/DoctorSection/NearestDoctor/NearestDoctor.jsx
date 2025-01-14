import Image from "next/image";
import React from "react";

const doctorData = [
  {
    id: 1,
    name: "Dr. Manzurul Kader Chowdhury",
    qualification: "MBBS, BCS (Health), MD (Neurology)",
    position: "Asst. Professor, Neurology",
    hospital: "Evercare Hospital Chittagong",
    image: "/images/medical-services/doctor-male.jpg",
  },
  {
    id: 2,
    name: "Dr. Example Name",
    qualification: "MBBS, MD (Cardiology)",
    position: "Professor, Cardiology",
    hospital: "City Hospital Chittagong",
    image: "/images/medical-services/doctor-male.jpg",
  },
  {
    id: 3,
    name: "Dr. Example Name",
    qualification: "MBBS, MD (Cardiology)",
    position: "Professor, Cardiology",
    hospital: "City Hospital Chittagong",
    image: "/images/medical-services/doctor-male.jpg",
  },
  {
    id: 4,
    name: "Dr. Example Name",
    qualification: "MBBS, MD (Cardiology)",
    position: "Professor, Cardiology",
    hospital: "City Hospital Chittagong",
    image: "/images/medical-services/doctor-male.jpg",
  },
  {
    id: 5,
    name: "Dr. Example Name",
    qualification: "MBBS, MD (Cardiology)",
    position: "Professor, Cardiology",
    hospital: "City Hospital Chittagong",
    image: "/images/medical-services/doctor-male.jpg",
  },
  {
    id: 6,
    name: "Dr. Example Name",
    qualification: "MBBS, MD (Cardiology)",
    position: "Professor, Cardiology",
    hospital: "City Hospital Chittagong",
    image: "/images/medical-services/doctor-male.jpg",
  },
];

const NearestDoctor = () => {
  return (
    <div className="flex justify-center">
      <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-4 gap-2 md:gap-5 justify-center items-center">
        {doctorData.map((doctor) => (
          <div key={doctor.id} className="flex justify-center">
            <div className="bg-white w-full h-52 flex flex-col justify-center items-center border rounded-lg shadow-sm cursor-pointer py-3 my-2">
              <div className="flex gap-2 px-3">
                <div>
                  <Image
                    src={doctor.image}
                    alt={doctor.name}
                    width={100}
                    height={100}
                    className="rounded-full object-contain"
                  />
                </div>
                <div>
                  <h3 className="mt-3 text-center font-semibold text-deepGray">
                    {doctor.name}
                  </h3>
                  <p className="text-center text-sm text-gray-600">
                    {doctor.qualification}
                  </p>
                  <p className="text-center text-sm text-gray-600">
                    {doctor.position}
                  </p>
                </div>
              </div>
              <div className="my-2 text-center bg-orange-400 text-white py-1 px-3 rounded-full text-sm">
                {doctor.hospital}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NearestDoctor;
