import Image from "next/image";
import React from "react";

const SecondDoctorCategory = () => {
  const images = [
    "/images/medical-services/doc-cat2-img1.jpg",
    "/images/medical-services/doc-cat2-img2.jpg",
    "/images/medical-services/doc-cat2-img3.jpg",
    "/images/medical-services/doc-cat2-img4.jpg",
  ];

  return (
    <div className="flex justify-center p-4 lg:p-20 bg-[#DEF9EC]">
      <div>
        <p className="text-2xl font-semibold pb-5 text-deepGray">
          বিভাগ অনুযায়ী ডাক্তার খুঁজুন
        </p>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 md:gap-5 justify-center items-center">
          {images.map((image, index) => (
            <div key={index} className="lg:m-3">
              <Image
                src={image}
                alt={`Doctor category ${index + 1}`}
                width={600}
                height={300}
                className="rounded-md shadow-lg"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SecondDoctorCategory;
