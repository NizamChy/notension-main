// v3
"use client";

import React, { useState, useEffect } from "react";
import { FASHION_IMAGE_URL } from "@/api-endpoints/secret";

// Swiper imports
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";

const ImageGallery = ({ product, selectedImage }) => {
  const [zoomStyle, setZoomStyle] = useState({});
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const detailImages = [
    product?.web_image,
    ...(product?.detail_product_image || []),
  ];

  useEffect(() => {
    if (selectedImage) {
      const index = detailImages.indexOf(selectedImage);
      if (index !== -1) setCurrentImageIndex(index);
    }
  }, [selectedImage]);

  const handleMove = (e) => {
    const target = e.currentTarget;
    const { left, top, width, height } = target.getBoundingClientRect();

    let clientX = e.touches ? e.touches[0].clientX : e.clientX;
    let clientY = e.touches ? e.touches[0].clientY : e.clientY;

    const x = ((clientX - left) / width) * 100;
    const y = ((clientY - top) / height) * 100;

    setZoomStyle({
      transformOrigin: `${x}% ${y}%`,
      transform: "scale(2)",
    });
  };

  const handleLeave = () => {
    setZoomStyle({});
  };

  return (
    <>
      {/* Main Image */}
      <div
        className="relative bg-gray-100 rounded-lg overflow-hidden aspect-[3/4] mb-4"
        onMouseMove={handleMove}
        onMouseLeave={handleLeave}
        onTouchMove={handleMove}
        onTouchEnd={handleLeave}
      >
        <img
          src={
            detailImages?.length > 0 && detailImages[currentImageIndex] !== null
              ? `${FASHION_IMAGE_URL}/${detailImages[currentImageIndex]}`
              : "/images/png/dummyImage.png"
          }
          alt={product?.product_title_eng}
          className="w-full h-full object-cover transition-transform duration-700 touch-none hover:cursor-zoom-out"
          style={zoomStyle}
        />

        {product?.sale_price && (
          <div className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
            SALE
          </div>
        )}
      </div>

      {/* Swiper Thumbnail Gallery */}
      <Swiper
        modules={[Navigation]}
        navigation
        slidesPerView={4}
        spaceBetween={10}
        className="thumbnail-swiper"
      >
        {detailImages?.map((img, index) => (
          <SwiperSlide key={index}>
            <div className="p-1">
              <button
                onClick={() => setCurrentImageIndex(index)}
                className={`w-full aspect-square bg-gray-100 rounded overflow-hidden ${
                  currentImageIndex === index ? "ring-2 ring-indigo-500" : ""
                }`}
              >
                <img
                  src={`${FASHION_IMAGE_URL}/${img}`}
                  alt={`${product?.product_title_eng} thumbnail ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </button>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </>
  );
};

export default ImageGallery;

// v2

// "use client";

// import React, { useState, useEffect } from "react";
// import { FASHION_IMAGE_URL } from "@/api-endpoints/secret";

// const ImageGallery = ({ product, selectedImage }) => {
//   const [zoomStyle, setZoomStyle] = useState({});
//   const [currentImageIndex, setCurrentImageIndex] = useState(0);

//   const detailImages = [
//     product?.web_image,
//     ...(product?.detail_product_image || []),
//   ];

//   // 👉 Sync parent selectedImage with gallery
//   useEffect(() => {
//     if (selectedImage) {
//       const index = detailImages.indexOf(selectedImage);
//       if (index !== -1) setCurrentImageIndex(index);
//     }
//   }, [selectedImage]);

//   const handleMove = (e) => {
//     const target = e.currentTarget;
//     const { left, top, width, height } = target.getBoundingClientRect();

//     let clientX, clientY;
//     if (e.touches) {
//       clientX = e.touches[0].clientX;
//       clientY = e.touches[0].clientY;
//     } else {
//       clientX = e.clientX;
//       clientY = e.clientY;
//     }

//     const x = ((clientX - left) / width) * 100;
//     const y = ((clientY - top) / height) * 100;

//     setZoomStyle({
//       transformOrigin: `${x}% ${y}%`,
//       transform: "scale(2)",
//     });
//   };

//   const handleLeave = () => {
//     setZoomStyle({});
//   };

//   return (
//     <>
//       {detailImages && (
//         <div
//           className="relative bg-gray-100 rounded-lg overflow-hidden aspect-[3/4] mb-4"
//           onMouseMove={handleMove}
//           onMouseLeave={handleLeave}
//           onTouchMove={handleMove}
//           onTouchEnd={handleLeave}
//           onTouchCancel={handleLeave}
//         >
//           <img
//             src={
//               detailImages?.length > 0 &&
//               detailImages[currentImageIndex] !== null
//                 ? `${FASHION_IMAGE_URL}/${detailImages[currentImageIndex]}`
//                 : "/images/png/dummyImage.png"
//             }
//             alt={product?.product_title_eng}
//             className="w-full h-full object-cover transition-transform duration-700 touch-none hover:cursor-zoom-out"
//             style={zoomStyle}
//           />

//           {/* Sale badge */}
//           {product?.sale_price && (
//             <div className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
//               SALE
//             </div>
//           )}
//         </div>
//       )}

//       {/* Thumbnail gallery */}
//       <div className="grid grid-cols-4 gap-2">
//         {detailImages?.map((img, index) => (
//           <button
//             key={index}
//             onClick={() => setCurrentImageIndex(index)}
//             className={`aspect-square bg-gray-100 rounded overflow-hidden ${
//               currentImageIndex === index ? "ring-2 ring-indigo-500" : ""
//             }`}
//           >
//             <img
//               src={`${FASHION_IMAGE_URL}/${img}`}
//               alt={`${product?.product_title_eng} thumbnail ${index + 1}`}
//               className="w-full h-full object-cover"
//             />
//           </button>
//         ))}
//       </div>
//     </>
//   );
// };

// export default ImageGallery;

// v1

// "use client";

// import React, { useState } from "react";
// import { FASHION_IMAGE_URL } from "@/api-endpoints/secret";

// const ImageGallery = ({ product }) => {
//   const [zoomStyle, setZoomStyle] = useState({});
//   const [currentImageIndex, setCurrentImageIndex] = useState(0);

//   const handleMove = (e) => {
//     const target = e.currentTarget;
//     const { left, top, width, height } = target.getBoundingClientRect();

//     let clientX, clientY;
//     if (e.touches) {
//       clientX = e.touches[0].clientX;
//       clientY = e.touches[0].clientY;
//     } else {
//       clientX = e.clientX;
//       clientY = e.clientY;
//     }

//     const x = ((clientX - left) / width) * 100;
//     const y = ((clientY - top) / height) * 100;

//     setZoomStyle({
//       transformOrigin: `${x}% ${y}%`,
//       transform: "scale(2)",
//     });
//   };

//   const handleLeave = () => {
//     setZoomStyle({});
//   };

//   // const detailImages = [product?.web_image, ...product?.detail_product_image];
//   const detailImages = [
//     product?.web_image,
//     ...(product?.detail_product_image || []),
//   ];

//   console.log(product);

//   return (
//     <>
//       {detailImages && (
//         <div
//           className="relative bg-gray-100 rounded-lg overflow-hidden aspect-[3/4] mb-4"
//           onMouseMove={handleMove}
//           onMouseLeave={handleLeave}
//           onTouchMove={handleMove}
//           onTouchEnd={handleLeave}
//           onTouchCancel={handleLeave}
//         >
//           <img
//             src={
//               detailImages?.length > 0 &&
//               detailImages[currentImageIndex] !== null
//                 ? `${FASHION_IMAGE_URL}/${detailImages[currentImageIndex]}`
//                 : "/images/png/dummyImage.png"
//             }
//             alt={product?.product_title_eng}
//             className="w-full h-full object-cover transition-transform duration-700 touch-none hover:cursor-zoom-out"
//             style={zoomStyle}
//           />

//           {/* Sale badge */}
//           {product?.sale_price && (
//             <div className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
//               SALE
//             </div>
//           )}
//         </div>
//       )}

//       {/* Thumbnail gallery */}
//       <div className="grid grid-cols-4 gap-2">
//         {detailImages?.map((img, index) => (
//           <button
//             key={index}
//             onClick={() => setCurrentImageIndex(index)}
//             className={`aspect-square bg-gray-100 rounded overflow-hidden ${
//               currentImageIndex === index ? "ring-2 ring-indigo-500" : ""
//             }`}
//           >
//             <img
//               src={`${FASHION_IMAGE_URL}/${img}`}
//               alt={`${product?.product_title_eng} thumbnail ${index + 1}`}
//               className="w-full h-full object-cover"
//             />
//           </button>
//         ))}
//       </div>
//     </>
//   );
// };

// export default ImageGallery;
