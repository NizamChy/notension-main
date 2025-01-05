"use client";

import Image from "next/image";
import React from "react";
import HomeSlider from "./HomeSlider";
import Link from "next/link";

const MiddleSection = () => {
  return (
    <div className="lg:flex gap-4">
      <Link
        href="https://play.google.com/store/apps/details?id=com.bitsnotension"
        prefetch={false}
        target="_blank"
      >
        <div className="group overflow-hidden relative mb-4 lg:mb-0">
          <Image
            width={632}
            height={300}
            className="transition-transform duration-300 group-hover:scale-105"
            src="/images/home/find-medical-services.jpg"
            alt="find-medical-services.jpg"
          />

          <div className="absolute bottom-10 left-8">
            <h3
              className="text-xl md:text-2xl font-semibold tracking-widest text-gray-500
            "
            >
              Find Medical Services
            </h3>
            <p className="text-xs md:text-base tracking-wider font-semibold text-gray-500">
              + Contact Now
            </p>
          </div>
        </div>
      </Link>

      <HomeSlider />
    </div>
  );
};

export default MiddleSection;

// "use client";

// import Image from "next/image";
// import React from "react";
// import HomeSlider from "./HomeSlider";

// const MiddleSection = () => {
//   return (
//     <div className="lg:flex gap-4">
//       <div className="group overflow-hidden relative hidden lg:block">
//         <Image
//           width={308}
//           height={302}
//           className="transition-transform duration-300 group-hover:scale-105"
//           src="/images/home/home-banner-6.webp"
//           alt="home-banner-6"
//         />

//         <div className="absolute bottom-10 left-8">
//           <h3 className="text-xl md:text-2xl font-semibold tracking-widest text-gray-500">
//             Find Hospital
//           </h3>
//           <p className="text-xs md:text-base tracking-wider font-semibold text-gray-500">
//             + Contact Now
//           </p>
//         </div>
//       </div>

//       {/*  */}
//       <div className="flex lg:hidden mb-4">
//         <div className="group overflow-hidden relative">
//           <Image
//             width={308}
//             height={302}
//             className="transition-transform duration-300 group-hover:scale-105"
//             src="/images/home/home-banner-6.webp"
//             alt="home-banner-6"
//           />

//           <div className="absolute bottom-10 left-8">
//             <h3 className="text-xl md:text-2xl font-semibold tracking-widest text-gray-500">
//               Find Hospital
//             </h3>
//             <p className="text-xs md:text-base tracking-wider font-semibold text-gray-500">
//               + Contact Now
//             </p>
//           </div>
//         </div>

//         <div className="group overflow-hidden relative">
//           <Image
//             width={308}
//             height={302}
//             className="transition-transform duration-300 group-hover:scale-105"
//             src="/images/home/home-banner-8.webp"
//             alt="home-banner-8"
//           />

//           <div className="absolute bottom-10 left-8">
//             <h3 className="text-xl md:text-2xl font-semibold tracking-widest text-gray-500">
//               Find Diagnostic
//             </h3>
//             <p className="text-xs md:text-base tracking-wider font-semibold text-gray-500">
//               + Contact Now
//             </p>
//           </div>
//         </div>
//       </div>
//       {/*  */}

//       <HomeSlider />

//       <div className="group overflow-hidden relative hidden lg:block">
//         <Image
//           width={308}
//           height={302}
//           className="transition-transform duration-300 group-hover:scale-105"
//           src="/images/home/home-banner-8.webp"
//           alt="home-banner-8"
//         />

//         <div className="absolute bottom-10 left-8">
//           <h3 className="text-xl md:text-2xl font-semibold tracking-widest text-gray-500">
//             Find Diagnostic
//           </h3>
//           <p className="text-xs md:text-base tracking-wider font-semibold text-gray-500">
//             + Contact Now
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default MiddleSection;
