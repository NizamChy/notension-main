"use client";

import React from "react";
import Loader from "../common/Loader";
import ServiceCard from "./ServiceCard";
import { useSelector } from "react-redux";

const ServicesArea = ({
  sliceEnd = 4,
  sliceStart = 0,
  imageWidth = 600,
  imageHeight = 300,
  bgClassName = "bg-[#F3F7FB]",
  imageKey = "service_banner_app",
  title = "Your Trusted Partner for Every Service",
  gridClassName = "grid grid-cols-2 xl:grid-cols-4 gap-2 md:gap-5 justify-center items-center",
}) => {
  const { allServicesInfo, isLoading } = useSelector((state) => state.allCare);

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <>
          {allServicesInfo?.length > sliceStart ? (
            <div className="py-10 lg:py-5">
              <div
                className={`flex justify-center p-4 lg:p-20 ${bgClassName} rounded-md`}
              >
                <div>
                  <p className="md:text-2xl font-semibold pb-5 text-[#0C3F8E] text-center">
                    {title}
                  </p>

                  <div className={gridClassName}>
                    {allServicesInfo
                      ?.slice(sliceStart, sliceEnd)
                      ?.map((service, index) => {
                        const originalIndex = sliceStart + index;

                        return (
                          <ServiceCard
                            key={service?._id}
                            service={service}
                            imageKey={imageKey}
                            index={originalIndex}
                            imageWidth={imageWidth}
                            imageHeight={imageHeight}
                          />
                        );
                      })}
                  </div>
                </div>
              </div>
            </div>
          ) : null}
        </>
      )}
    </>
  );
};

export default ServicesArea;

// "use client";

// import React from "react";
// import Loader from "../common/Loader";
// import ServiceCard from "./ServiceCard";
// import { useSelector } from "react-redux";

// const ServicesArea = ({
//   sliceEnd = 4,
//   sliceStart = 0,
//   imageWidth = 600,
//   imageHeight = 300,
//   bgClassName = "bg-[#F3F7FB]",
//   imageKey = "service_banner_app",
//   title = "Your Trusted Partner for Every Service",
//   gridClassName = "grid grid-cols-2 xl:grid-cols-4 gap-2 md:gap-5 justify-center items-center",
// }) => {
//   const { allServicesInfo, isLoading } = useSelector((state) => state.allCare);

//   return (
//     <>
//       {isLoading ? (
//         <Loader />
//       ) : (
//         <>
//           {allServicesInfo?.length > sliceStart ? (
//             <div className="py-10 lg:py-5">
//               <div
//                 className={`flex justify-center p-4 lg:p-20 ${bgClassName} rounded-md`}
//               >
//                 <div>
//                   <p className="md:text-2xl font-semibold pb-5 text-[#0C3F8E] text-center">
//                     {title}
//                   </p>

//                   <div className={gridClassName}>
//                     {allServicesInfo
//                       ?.slice(sliceStart, sliceEnd)
//                       ?.map((service) => (
//                         <ServiceCard
//                           key={service?._id}
//                           service={service}
//                           imageKey={imageKey}
//                           imageWidth={imageWidth}
//                           imageHeight={imageHeight}
//                         />
//                       ))}
//                   </div>
//                 </div>
//               </div>
//             </div>
//           ) : null}
//         </>
//       )}
//     </>
//   );
// };

// export default ServicesArea;
