import Image from "next/image";
import Link from "next/link";
import React from "react";

const SecondSection = () => {
  return (
    <div className="lg:flex gap-4 space-y-4">
      <div className="flex justify-center lg:gap-4 mt-4">
        <Link href="/medical-services/eye-care-center">
          <div className="group overflow-hidden relative">
            <Image
              width={308}
              height={303}
              className="transition-transform duration-300 group-hover:scale-105"
              src="/images/home/find-eye-care.jpg"
              alt="find-eye-care.jpg"
            />

            <div className="absolute bottom-2 left-3 md:bottom-10 md:left-8">
              <h3
                className="text-sm md:text-2xl font-semibold tracking-widest text-gray-500
            "
              >
                Find Eye Care Center
              </h3>
              <p className="text-xs md:text-base tracking-wider font-semibold text-gray-500">
                + Shop Now
              </p>
            </div>
          </div>
        </Link>

        <Link href="/medical-services/dental-care-center">
          <div className="group overflow-hidden relative">
            <Image
              width={308}
              height={303}
              className="transition-transform duration-300 group-hover:scale-105"
              src="/images/home/find-dental-care.jpg"
              alt="find-dental-care.jpg"
            />

            <div className="absolute bottom-2 left-3 md:bottom-10 md:left-8">
              <h3
                className="text-sm md:text-2xl font-semibold tracking-widest text-gray-500
            "
              >
                Find Dental Care Center
              </h3>
              <p className="text-xs md:text-base tracking-wider font-semibold text-gray-500">
                + Order Now
              </p>
            </div>
          </div>
        </Link>
      </div>
      <div className="flex justify-center lg:gap-4 mt-4">
        <Link href="/medical-services/hospital">
          <div className="group overflow-hidden relative">
            <Image
              width={308}
              height={302}
              className="transition-transform duration-300 group-hover:scale-105"
              src="/images/home/home-banner-6.webp"
              alt="home-banner-6"
            />

            <div className="absolute bottom-2 left-3 md:bottom-10 md:left-8">
              <h3 className="text-sm md:text-2xl font-semibold tracking-widest text-gray-500">
                Find Hospital
              </h3>
              <p className="text-xs md:text-base tracking-wider font-semibold text-gray-500">
                + Contact Now
              </p>
            </div>
          </div>
        </Link>

        <Link href="/medical-services/diagnostic">
          <div className="group overflow-hidden relative">
            <Image
              width={308}
              height={302}
              className="transition-transform duration-300 group-hover:scale-105"
              src="/images/home/home-banner-8.webp"
              alt="home-banner-8"
            />

            <div className="absolute bottom-2 left-3 md:bottom-10 md:left-8">
              <h3 className="text-sm md:text-2xl font-semibold tracking-widest text-gray-500">
                Find Diagnostic
              </h3>
              <p className="text-xs md:text-base tracking-wider font-semibold text-gray-500">
                + Contact Now
              </p>
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default SecondSection;

// import Image from "next/image";
// import Link from "next/link";
// import React from "react";

// const SecondSection = () => {
//   return (
//     <div className="lg:flex gap-4 space-y-4">
//       <div className="flex justify-center lg:gap-4 mt-4">
//         <Link href="#">
//           <div className="group overflow-hidden relative">
//             <Image
//               width={308}
//               height={303}
//               className="transition-transform duration-300 group-hover:scale-105"
//               src="/images/home/find-eye-care.jpg"
//               alt="find-eye-care.jpg"
//             />

//             <div className="absolute bottom-10 left-8">
//               <h3
//                 className="text-sm md:text-2xl font-semibold tracking-widest text-gray-500
//             "
//               >
//                 Find Eye Care Center
//               </h3>
//               <p className="text-xs md:text-base tracking-wider font-semibold text-gray-500">
//                 + Shop Now
//               </p>
//             </div>
//           </div>
//         </Link>

//         <Link href="#">
//           <div className="group overflow-hidden relative">
//             <Image
//               width={308}
//               height={303}
//               className="transition-transform duration-300 group-hover:scale-105"
//               src="/images/home/find-dental-care.jpg"
//               alt="find-dental-care.jpg"
//             />

//             <div className="absolute bottom-10 left-8">
//               <h3
//                 className="text-sm md:text-2xl font-semibold tracking-widest text-gray-500
//             "
//               >
//                 Find Dental Care Center
//               </h3>
//               <p className="text-xs md:text-base tracking-wider font-semibold text-gray-500">
//                 + Order Now
//               </p>
//             </div>
//           </div>
//         </Link>
//       </div>

//       <Link href="#">
//         <div className="group overflow-hidden relative mt-4 lg:mt-0">
//           <Image
//             width={632}
//             height={300}
//             className="transition-transform duration-300 group-hover:scale-105"
//             src="/images/home/find-medical-services.jpg"
//             alt="find-medical-services.jpg"
//           />

//           <div className="absolute bottom-10 left-8">
//             <h3
//               className="text-sm md:text-2xl font-semibold tracking-widest text-gray-500
//             "
//             >
//               Find Medical Services
//             </h3>
//             <p className="text-xs md:text-base tracking-wider font-semibold text-gray-500">
//               + Contact Now
//             </p>
//           </div>
//         </div>
//       </Link>
//     </div>
//   );
// };

// export default SecondSection;
