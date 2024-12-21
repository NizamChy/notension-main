"use client";
import { IMAGE_URL } from "@/api-endpoints/secret";
import React from "react";
import { useSelector } from "react-redux";
import { IoCallOutline, IoLocationOutline } from "react-icons/io5";
import { BsShop } from "react-icons/bs";
import Image from "next/image";

const ShopInfo = () => {
  const visitedGroceryStore = useSelector(
    (state) => state.dashboard.visitedGroceryStore
  );

  return (
    <>
      {visitedGroceryStore?._id && (
        <div className="p-4 w-full h-full border border-gray-200 rounded-2xl shadow-sm transition-shadow duration-300 flex flex-col items-center bg-white">
          <Image
            width={500}
            height={300}
            alt="shop banner"
            src={`${IMAGE_URL}/grocery-store-docs/${visitedGroceryStore?.shop_banner_web}`}
            className="rounded-lg overflow-hidden border w-full object-cover"
          />
          <div className="mt-6 space-y-1 w-full text-gray-700">
            <div className="flex items-center gap-2">
              <BsShop className="text-indigo-600 text-xl" />
              <span className="font-semibold text-lg text-gray-900">
                Shop Name:
              </span>
              <span className="truncate font-medium">
                {visitedGroceryStore?.shop_name}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <IoCallOutline className="text-indigo-600 text-xl" />
              <span className="font-semibold text-lg text-gray-900">
                Contact:
              </span>
              <span className="truncate font-medium">
                {visitedGroceryStore?.contact_no},{" "}
                {visitedGroceryStore?.alternative_contact_no}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <IoLocationOutline className="text-indigo-600 text-xl" />
              <span className="font-semibold text-lg text-gray-900">
                Location:
              </span>
              <span className="truncate font-medium">
                {visitedGroceryStore?.district_area_name},{" "}
                {visitedGroceryStore?.district_name}
              </span>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ShopInfo;

// "use client";
// import { IMAGE_URL } from "@/api-endpoints/secret";
// import React from "react";
// import { useSelector } from "react-redux";
// import { IoCallOutline, IoLocationOutline } from "react-icons/io5";
// import { BsShop } from "react-icons/bs";
// import Image from "next/image";

// const ShopInfo = () => {
//   const visitedGroceryStore = useSelector(
//     (state) => state.dashboard.visitedGroceryStore
//   );

//   return (
//     <>
//       {visitedGroceryStore?._id && (
//         <>
//           {" "}
//           <div className="p-6 w-full h-full border border-indigo-300 rounded-2xl hover:shadow-xl hover:shadow-indigo-50 flex flex-col items-center">
//             <Image
//               width={500}
//               height={300}
//               alt="shop banner"
//               src={`${IMAGE_URL}/grocery-store-docs/${visitedGroceryStore?.shop_banner_web}`}
//               className="shadow rounded-lg overflow-hidden border w-full object-cover md:h-full h-40"
//             />
//             <div className="mt-8 space-y-0.5 w-full">
//               <p className="flex items-center gap-1">
//                 <span>
//                   <BsShop />
//                 </span>
//                 <span className="font-semibold text-nowrap">Shop name:</span>{" "}
//                 <span className="truncate">
//                   {visitedGroceryStore?.shop_name}
//                 </span>
//               </p>
//               <p className="flex items-center gap-1">
//                 <span>
//                   <IoCallOutline />
//                 </span>
//                 <span className="font-semibold">Contact:</span>
//                 <span className="truncate">
//                   {visitedGroceryStore?.contact_no},{" "}
//                   {visitedGroceryStore?.alternative_contact_no}
//                 </span>
//               </p>
//               <p className="flex items-center gap-1">
//                 <span>
//                   <IoLocationOutline />
//                 </span>
//                 <span className="font-semibold">Location:</span>{" "}
//                 <span className="truncate">
//                   {visitedGroceryStore?.district_area_name},{" "}
//                   {visitedGroceryStore?.district_name}
//                 </span>
//               </p>
//             </div>
//           </div>
//         </>
//       )}
//     </>
//   );
// };

// export default ShopInfo;
