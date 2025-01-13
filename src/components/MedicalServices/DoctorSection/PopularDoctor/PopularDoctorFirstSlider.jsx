"use client";
import React from "react";
import "swiper/css";
import "swiper/css/navigation";
import { Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import { GrPrevious, GrNext } from "react-icons/gr";
import Image from "next/image";

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

const PopularDoctorFirstSlider = () => {
  return (
    <div className="py-20 relative flex justify-center items-center">
      <button
        className="absolute top-1/2 left-2 z-10 -translate-y-1/2 p-2 bg-gray-200 rounded-full shadow-md hover:bg-gray-300 text-deepGray"
        id="custom-prev"
      >
        <GrPrevious />
      </button>

      <button
        className="absolute top-1/2 right-2 z-10 -translate-y-1/2 p-2 bg-gray-200 rounded-full shadow-md hover:bg-gray-300 text-deepGray"
        id="custom-next"
      >
        <GrNext />
      </button>

      <div className="w-full flex justify-center mx-auto px-5 items-center">
        <Swiper
          slidesPerView={1.3}
          spaceBetween={20}
          loop={true}
          navigation={{
            prevEl: "#custom-prev",
            nextEl: "#custom-next",
          }}
          breakpoints={{
            640: {
              slidesPerView: 2,
              spaceBetween: 20,
            },
            1024: {
              slidesPerView: 4,
              spaceBetween: 30,
            },
          }}
          modules={[Navigation]}
          className="mx-auto"
        >
          {doctorData.map((doctor) => (
            <SwiperSlide key={doctor.id} className="flex justify-center">
              <div className="bg-white w-full h-52 flex flex-col justify-center items-center border rounded-lg shadow-sm cursor-pointer px-3 py-3 my-2">
                <div className="flex gap-2">
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
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
};

export default PopularDoctorFirstSlider;
