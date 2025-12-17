"use client";

import React from "react";
import Image from "next/image";
import { FaPhone } from "react-icons/fa6";
import { useParams } from "next/navigation";
import Loader from "../shared/Loader/Loader";
import { MdLocationOn } from "react-icons/md";
import { FASHION_IMAGE_URL } from "@/api-endpoints/secret";
import { useStoreItems } from "../hooks/fetchData/useStoreItems";

const StoreBanner = () => {
  const params = useParams();
  const storeId = params?.shopSlugId?.split("_")[1];

  const { useStoreInfo } = useStoreItems();
  const { data: storeInfo, isLoading } = useStoreInfo(storeId);

  if (isLoading) return <Loader />;

  return (
    <div className="pt-5">
      <div className="relative w-full h-56 md:h-[350px] overflow-hidden shadow-xl">
        <Image
          src={
            storeInfo?.shop_banner_app
              ? `${FASHION_IMAGE_URL}/${storeInfo?.shop_banner_web}`
              : "/png/dummyImage.png"
          }
          alt="Shopping store banner"
          fill
          className="object-cover"
          priority
        />

        <div
          className="relative z-10 flex flex-col items-start justify-center h-full px-8
             text-deepGray w-2/3 lg:w-1/3 bg-gradient-to-br from-white to-white/20 md:to-white/30
             clip-diagonal"
        >
          <h1 className="text-xl md:text-4xl lg:text-5xl font-bold mb-2 md:mb-4">
            {storeInfo?.shop_name}
          </h1>

          <p className="text-sm md:text-xl font-semibold max-w-lg flex gap-1 items-start">
            <span>
              <FaPhone className="lg:text-base lg:mt-1" />
            </span>
            <span>{storeInfo?.contact_no}</span>
          </p>

          <p className="text-sm md:text-xl font-semibold mb-4 md:mb-8 max-w-lg flex gap-1 items-start">
            <span>
              <MdLocationOn className="lg:text-xl lg:mt-1" />
            </span>
            <span>{storeInfo?.shop_address}</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default StoreBanner;

// "use client";

// import React from "react";
// import Image from "next/image";
// import { FaPhone } from "react-icons/fa6";
// import { useParams } from "next/navigation";
// import Loader from "../shared/Loader/Loader";
// import { MdLocationOn } from "react-icons/md";
// import { FASHION_IMAGE_URL } from "@/api-endpoints/secret";
// import { useStoreItems } from "../hooks/fetchData/useStoreItems";

// const StoreBanner = () => {
//   const params = useParams();
//   const storeId = params?.shopSlugId?.split("_")[1];

//   const { useStoreInfo } = useStoreItems();
//   const { data: storeInfo, isLoading } = useStoreInfo(storeId);

//   if (isLoading) return <Loader />;

//   return (
//     <div className="pt-5">
//       <div className="relative w-full h-56 md:h-[350px] overflow-hidden shadow-xl">
//         <Image
//           src={
//             storeInfo?.shop_banner_app
//               ? `${FASHION_IMAGE_URL}/${storeInfo?.shop_banner_web}`
//               : "/png/dummyImage.png"
//           }
//           alt="Shopping store banner"
//           fill
//           className="object-cover"
//           priority
//         />

//         {/* <div className="absolute inset-0 bg-black bg-opacity-40"></div> */}

//         <div className="relative z-10 flex flex-col items-start justify-center h-full px-8 text-white max-w-7xl mx-auto ">
//           <div className="bg-black bg-opacity-40 p-4">
//             <span className="text-sm md:text-xl font-medium mb-2">
//               Products by
//             </span>
//             <h1 className="text-xl md:text-6xl font-bold mb-2 md:mb-4">
//               {storeInfo?.shop_name}
//             </h1>

//             <p className="text-sm md:text-xl font-semibold max-w-lg flex gap-1 items-start">
//               <span>
//                 <FaPhone className="lg:text-base lg:mt-1" />
//               </span>
//               {storeInfo?.contact_no}
//             </p>
//             <p className="text-sm md:text-xl font-semibold mb-4 md:mb-8 max-w-lg flex gap-1 items-start">
//               <span>
//                 <MdLocationOn className="lg:text-xl lg:mt-1" />
//               </span>
//               {storeInfo?.shop_address}
//             </p>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default StoreBanner;
