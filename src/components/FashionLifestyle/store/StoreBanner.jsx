"use client";

import Image from "next/image";
import { FaPhone } from "react-icons/fa6";
import { useParams } from "next/navigation";
import Loader from "../shared/Loader/Loader";
import { MdLocationOn } from "react-icons/md";
import React, { useEffect, useState } from "react";
import { FASHION_IMAGE_URL } from "@/api-endpoints/secret";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import { useStoreItems } from "../hooks/fetchData/useStoreItems";
import CommonModal from "@/components/shared/CommonModal/CommonModal";

const StoreBanner = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const params = useParams();
  const storeId = params?.shopSlugId?.split("_")[1];

  const { useStoreInfo } = useStoreItems();
  const { data: storeInfo, isLoading } = useStoreInfo(storeId);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  useEffect(() => {
    if (storeInfo?.isShowingMsg && storeInfo?.popup_message) {
      openModal();
    }
  }, [storeInfo]);

  if (isLoading) return <Loader />;

  return (
    <>
      <div className="pt-5">
        <div className="relative w-full h-56 md:h-[350px] overflow-hidden shadow-xl">
          <Image
            src={
              storeInfo?.shop_banner_web
                ? `${FASHION_IMAGE_URL}/${storeInfo?.shop_banner_web}`
                : "/png/dummyImage.png"
            }
            alt="Shopping store banner"
            fill
            className="object-cover hidden md:block"
            priority
          />

          <Image
            src={
              storeInfo?.shop_banner_app
                ? `${FASHION_IMAGE_URL}/${storeInfo?.shop_banner_app}`
                : "/png/dummyImage.png"
            }
            alt="Shopping store banner"
            fill
            className="object-cover block md:hidden"
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
                <MdLocationOn className="lg:text-xl mt-1" />
              </span>
              <span className="line-clamp-3 md:line-clamp-none">
                {storeInfo?.shop_address}
              </span>
            </p>
          </div>
        </div>
      </div>

      {/* <CommonModal isOpen={isModalOpen} onClose={closeModal}>
        <div className="flex flex-col justify-center items-center min-h-80 text-gray bg-gray-50 rounded-md">
          <p className="py-3 font-semibold text-2xl text-primary text-center">
            {storeInfo?.popup_message}
          </p>
        </div>
      </CommonModal> */}

      <CommonModal isOpen={isModalOpen} onClose={closeModal}>
        <div className="relative w-full max-w-md mx-auto bg-white rounded-xl shadow-xl px-6 pb-6 md:px-8 md:pb-8">
          {/* <div className="flex items-center justify-center w-14 h-14 rounded-full bg-primary/10 mx-auto mb-4">
            <svg
              className="w-7 h-7 text-yellow-500"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M13 16h-1v-4h-1m1-4h.01M12 18a6 6 0 100-12 6 6 0 000 12z"
              />
            </svg>
          </div> */}

          <DotLottieReact
            src="https://lottie.host/a93cc943-48e2-47b5-91bb-6c41e7a3071c/DLXos4RSOw.lottie"
            loop
            autoplay
          />

          {/* <h2 className="text-xl md:text-2xl font-semibold text-yellow-500 text-center mb-2">
            Important Notice
          </h2> */}

          <p className="text-gray-600 text-center leading-relaxed mb-6">
            {storeInfo?.popup_message}
          </p>

          <div className="flex justify-center">
            <button
              onClick={closeModal}
              className="px-6 py-2.5 rounded-md bg-yellow-500 text-white font-medium
                   hover:bg-yellow-600/90 transition-all duration-200"
            >
              Got it
            </button>
          </div>
        </div>
      </CommonModal>
    </>
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
