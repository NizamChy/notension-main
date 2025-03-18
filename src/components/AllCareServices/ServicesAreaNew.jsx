import React from "react";
import Image from "next/image";

const ServicesAreaNew = () => {
  const services = [
    {
      image: "/images/all-care-services/services/services-1.png",
      title: "Banking Services",
    },
    {
      image: "/images/all-care-services/services/services-2.png",
      title: "Delivery Service",
    },
    {
      image: "/images/all-care-services/services/services-3.png",
      title: "Labour or Manpower supplier",
    },
    {
      image: "/images/all-care-services/services/services-4.png",
      title: "Photo & Document Printing",
    },
  ];

  return (
    <div className="mx-auto px-4 py-12">
      <h2 className="text-xl md:text-2xl lg:text-3xl font-semibold text-center mb-3 lg:mb-8 text-primary">
        Our Services
      </h2>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
        {services.map((service, index) => (
          <div
            key={index}
            className="bg-white rounded-lg shadow-lg overflow-hidden cursor-pointer text-mediumGray hover:text-primary"
          >
            <div className="flex justify-center">
              <Image
                src={service.image}
                alt={service.title}
                width={200}
                height={200}
              />
            </div>
            <div className="pb-3 md:pb-7">
              <h3 className="text-sm md:text-lg lg:text-xl font-medium mb-2 text-center">
                {service.title}
              </h3>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ServicesAreaNew;
