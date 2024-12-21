"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useSelector } from "react-redux";

const CategoryBannerCarousel = () => {
  // const DashboardSlider = useSelector(
  //   (state) => state.dashboard.DashboardSlider
  // );

  // console.log(DashboardSlider);

  // const visitedGroceryStore = useSelector(
  //   (state) => state.dashboard.visitedGroceryStore
  // );

  // console.log(visitedGroceryStore);

  const images = [
    "/png/food-banner.png",
    "/png/food-banner-2.png",
    "/png/food-banner-3.png",
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const prevSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  const nextSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
  };

  return (
    <>
      <div className="flex justify-center relative m-2 md:m-3 mt-4">
        <div className="lg:min-h-80 relative overflow-hidden rounded-lg">
          <div
            className="carousel-content flex transition-transform duration-500"
            style={{
              transform: `translateX(-${currentIndex * 100}%)`,
            }}
          >
            {images.map((src, index) => (
              <div key={index} className="carousel-slide flex-shrink-0 w-full">
                <Image
                  src={src}
                  alt={`banner-${index}`}
                  width={800}
                  height={300}
                  className="rounded-lg w-full md:h-[350px] object-cover h-[150px]"
                />
              </div>
            ))}
          </div>

          <button
            onClick={prevSlide}
            className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-black text-white p-2 rounded-full"
          >
            &#10094;
          </button>
          <button
            onClick={nextSlide}
            className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-black text-white p-2 rounded-full"
          >
            &#10095;
          </button>
        </div>
      </div>
    </>
  );
};

export default CategoryBannerCarousel;
