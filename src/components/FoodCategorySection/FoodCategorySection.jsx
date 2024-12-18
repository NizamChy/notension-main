// "use client";
// import { FOOD_SLIDER_TYPE_SUBTYPE_IMAGES } from "@/api-endpoints/api-endpoint";
// import { useFood } from "@/hooks/fetch-data/useFood";
// import Image from "next/image";
// import Link from "next/link";
// import React, { useEffect } from "react";
// import { useSelector } from "react-redux";

// const FoodCategorySection = () => {
//   const { exploreFoodModule, progressing } = useFood();

//   const shopCategory = useSelector((state) => state.dashboard.shopCategory);

//   const DashboardSlider = useSelector(
//     (state) => state.dashboard.DashboardSlider
//   );

//   console.log("shopCategory from redux:", shopCategory);
//   console.log("DashboardSlider from redux:", DashboardSlider);

//   useEffect(() => {
//     exploreFoodModule();
//   }, []);

//   console.log(shopCategory[0]);

//   return (
//     <div className="px-20">
//       <div className="grid grid-cols-5 gap-20">
//         {shopCategory.map((category) => (
//           <div key={category?._id}>
//             <Link href={`/food/${category?._id}`}>
//               <Image
//                 src={`${FOOD_SLIDER_TYPE_SUBTYPE_IMAGES}/${category?.banner}`}
//                 alt={`${category?.store_category_name} banner`}
//                 width={500}
//                 height={300}
//                 className="w-full rounded-lg"
//               />
//             </Link>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default FoodCategorySection;

// "use client";
// import { FOOD_SLIDER_TYPE_SUBTYPE_IMAGES } from "@/api-endpoints/api-endpoint";
// import { useFood } from "@/hooks/fetch-data/useFood";
// import Image from "next/image";
// import React, { useEffect } from "react";
// import { useSelector } from "react-redux";
// import Link from "next/link";

// const FoodCategorySection = () => {
//   const { exploreFoodModule, progressing } = useFood();

//   const shopCategory = useSelector((state) => state.dashboard.shopCategory);

//   const DashboardSlider = useSelector(
//     (state) => state.dashboard.DashboardSlider
//   );

//   console.log("shopCategory from redux:", shopCategory);
//   console.log("DashboardSlider from redux:", DashboardSlider);

//   useEffect(() => {
//     exploreFoodModule();
//   }, []);

//   console.log(shopCategory[0]);

//   return (
//     <div className="p-20">
//       {/* <div className="grid grid-cols-5 gap-20">
//         {shopCategory.map((category) => (
//           <div key={category?._id}>
//             <Link href={`/food/${category?._id}`}>
//               <Image
//                 src={`${FOOD_SLIDER_TYPE_SUBTYPE_IMAGES}/${category?.banner}`}
//                 alt={`${category?.store_category_name} banner`}
//                 width={500}
//                 height={300}
//                 className="w-full rounded-lg"
//               />
//             </Link>

//           </div>
//         ))}
//       </div> */}

//       <div className="flex gap-10 border">
//         <div className="flex flex-col w-1/2 p-10">
//           <Image
//             src={`${FOOD_SLIDER_TYPE_SUBTYPE_IMAGES}/${shopCategory[2]?.banner}`}
//             alt={`${shopCategory[2]?.store_category_name} banner`}
//             width={500}
//             height={300}
//             className="w-full rounded-lg"
//           />
//           <Image
//             src={`${FOOD_SLIDER_TYPE_SUBTYPE_IMAGES}/${shopCategory[3]?.banner}`}
//             alt={`${shopCategory[3]?.store_category_name} banner`}
//             width={500}
//             height={300}
//             className="w-full rounded-lg"
//           />
//         </div>

//         <div className="w-1/2 p-10">
//           <Image
//             src={`${FOOD_SLIDER_TYPE_SUBTYPE_IMAGES}/${DashboardSlider[0]?.first_slider[0]?.file_name}`}
//             alt={`${shopCategory[6]?.store_category_name} banner`}
//             width={500}
//             height={300}
//             className="w-full h-full object-cover rounded-lg"
//           />
//         </div>
//       </div>

//       <div className="flex gap-5 py-10 border justify-center items-center">
//         <div className="w-1/2 flex items-center justify-center p-20">
//           <Image
//             src={`${FOOD_SLIDER_TYPE_SUBTYPE_IMAGES}/${DashboardSlider[0]?.second_slider[0]?.file_name}`}
//             alt={`${shopCategory[6]?.store_category_name} banner`}
//             width={500}
//             height={300}
//             className="w-full rounded-lg"
//           />
//         </div>
//         <div className="w-1/2 p-10 flex justify-center">
//           <div className="flex gap-20">
//             <Image
//               src={`${FOOD_SLIDER_TYPE_SUBTYPE_IMAGES}/${shopCategory[1]?.banner}`}
//               alt={`${shopCategory[1]?.store_category_name} banner`}
//               width={500}
//               height={300}
//               className="w-72 rounded-lg"
//             />
//             <Image
//               src={`${FOOD_SLIDER_TYPE_SUBTYPE_IMAGES}/${shopCategory[0]?.banner}`}
//               alt={`${shopCategory[0]?.store_category_name} banner`}
//               width={500}
//               height={300}
//               className="w-72 rounded-lg"
//             />
//           </div>
//         </div>
//       </div>

//       <div className="flex gap-5 py-10 border justify-center items-center">
//         <div className="flex flex-col w-1/2 p-10">
//           <Image
//             src={`${FOOD_SLIDER_TYPE_SUBTYPE_IMAGES}/${shopCategory[4]?.banner}`}
//             alt={`${shopCategory[4]?.store_category_name} banner`}
//             width={500}
//             height={300}
//             className="w-full rounded-lg"
//           />

//           <div className="gap-5 flex justify-evenly my-10">
//             <Image
//               src={`${FOOD_SLIDER_TYPE_SUBTYPE_IMAGES}/${shopCategory[5]?.banner}`}
//               alt={`${shopCategory[5]?.store_category_name} banner`}
//               width={500}
//               height={300}
//               className="w-64 rounded-lg"
//             />
//             <Image
//               src={`${FOOD_SLIDER_TYPE_SUBTYPE_IMAGES}/${shopCategory[6]?.banner}`}
//               alt={`${shopCategory[6]?.store_category_name} banner`}
//               width={500}
//               height={300}
//               className="w-64 rounded-lg"
//             />
//           </div>
//         </div>

//         <div className="w-1/2 flex items-center p-10">
//           <Image
//             src={`${FOOD_SLIDER_TYPE_SUBTYPE_IMAGES}/${DashboardSlider[0]?.third_slider[0]?.file_name}`}
//             alt={`${shopCategory[6]?.store_category_name} banner`}
//             width={500}
//             height={300}
//             className="w-full rounded-lg"
//           />
//         </div>
//       </div>

//       <div className="flex gap-5 py-10 border justify-center items-center">
//         <div className="w-1/2 flex items-center p-10">
//           <Image
//             src={`${FOOD_SLIDER_TYPE_SUBTYPE_IMAGES}/${DashboardSlider[0]?.fourth_slider[0]?.file_name}`}
//             alt={`${shopCategory[6]?.store_category_name} banner`}
//             width={500}
//             height={300}
//             className="w-full rounded-lg"
//           />
//         </div>
//         <div className="w-1/2 flex items-center p-10">
//           <Image
//             src={`${FOOD_SLIDER_TYPE_SUBTYPE_IMAGES}/${shopCategory[7]?.banner}`}
//             alt={`${shopCategory[7]?.store_category_name} banner`}
//             width={500}
//             height={300}
//             className="w-full rounded-lg"
//           />
//         </div>
//       </div>
//     </div>
//   );
// };

// export default FoodCategorySection;

"use client";
import { FOOD_SLIDER_TYPE_SUBTYPE_IMAGES } from "@/api-endpoints/api-endpoint";
import { useFood } from "@/hooks/fetch-data/useFood";
import Image from "next/image";
import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import Slider from "../common/Slider";
import Link from "next/link";
import Loader from "../Loader/Loader";

const FoodCategorySection = () => {
  const { exploreFoodModule, progressing } = useFood();
  const shopCategory = useSelector((state) => state.dashboard.shopCategory);
  const DashboardSlider = useSelector(
    (state) => state.dashboard.DashboardSlider
  );

  useEffect(() => {
    exploreFoodModule();
  }, []);

  return (
    <>
      {progressing ? (
        <Loader />
      ) : (
        <div className="p-5 lg:p-20">
          {/* Section 1 */}
          <div className="flex flex-col lg:flex-row gap-5 lg:gap-10">
            <div className="flex flex-col w-full lg:w-1/2 p-5 lg:p-10">
              <Link href={`/food/${shopCategory[2]?._id}`}>
                <Image
                  src={`${FOOD_SLIDER_TYPE_SUBTYPE_IMAGES}/${shopCategory[2]?.banner}`}
                  alt={`${shopCategory[2]?.store_category_name} banner`}
                  width={500}
                  height={300}
                  className="w-full max-w-full h-auto rounded-lg object-contain"
                />
              </Link>

              <Link href={`/food/${shopCategory[3]?._id}`}>
                <Image
                  src={`${FOOD_SLIDER_TYPE_SUBTYPE_IMAGES}/${shopCategory[3]?.banner}`}
                  alt={`${shopCategory[3]?.store_category_name} banner`}
                  width={500}
                  height={300}
                  className="w-full max-w-full h-auto rounded-lg mt-5 object-contain"
                />
              </Link>
            </div>
            <div className="w-full lg:w-1/2 p-5 lg:p-10">
              {DashboardSlider[0]?.second_slider?.length && (
                <Slider slides={DashboardSlider[0]?.second_slider} />
              )}
            </div>
          </div>

          {/* Section 2 */}
          <div className="flex flex-col lg:flex-row gap-5 py-5 lg:py-10 justify-center items-center">
            <div className="w-full lg:w-1/2 flex items-center justify-center p-5 lg:p-20">
              {DashboardSlider[0]?.first_slider?.length && (
                <Slider slides={DashboardSlider[0]?.first_slider} />
              )}
            </div>
            <div className="w-full lg:w-1/2 p-5 md:p-0 lg:p-10 flex justify-center">
              <div className="flex flex-col md:flex-row gap-5 lg:gap-20">
                <Link href={`/food/${shopCategory[1]?._id}`}>
                  <Image
                    src={`${FOOD_SLIDER_TYPE_SUBTYPE_IMAGES}/${shopCategory[1]?.banner}`}
                    alt={`${shopCategory[1]?.store_category_name} banner`}
                    width={500}
                    height={300}
                    className="w-full max-w-full lg:w-72 h-auto rounded-lg object-contain"
                  />
                </Link>
                <Link href={`/food/${shopCategory[0]?._id}`}>
                  <Image
                    src={`${FOOD_SLIDER_TYPE_SUBTYPE_IMAGES}/${shopCategory[0]?.banner}`}
                    alt={`${shopCategory[0]?.store_category_name} banner`}
                    width={500}
                    height={300}
                    className="w-full max-w-full lg:w-72 h-auto rounded-lg object-contain"
                  />
                </Link>
              </div>
            </div>
          </div>

          {/* Section 3 */}
          <div className="flex flex-col lg:flex-row gap-5 py-5 lg:py-10 justify-center items-center">
            <div className="flex flex-col w-full lg:w-1/2 p-5 md:p-3 lg:p-10">
              <Link href={`/food/${shopCategory[4]?._id}`}>
                <Image
                  src={`${FOOD_SLIDER_TYPE_SUBTYPE_IMAGES}/${shopCategory[4]?.banner}`}
                  alt={`${shopCategory[4]?.store_category_name} banner`}
                  width={500}
                  height={300}
                  className="w-full max-w-full h-auto rounded-lg object-contain"
                />
              </Link>
              <div className="flex flex-col md:flex-row gap-5 justify-evenly mt-5 lg:my-10">
                <Link href={`/food/${shopCategory[5]?._id}`}>
                  <Image
                    src={`${FOOD_SLIDER_TYPE_SUBTYPE_IMAGES}/${shopCategory[5]?.banner}`}
                    alt={`${shopCategory[5]?.store_category_name} banner`}
                    width={500}
                    height={300}
                    className="w-full max-w-full lg:w-64 h-auto rounded-lg object-contain"
                  />
                </Link>
                <Link href={`/food/${shopCategory[6]?._id}`}>
                  <Image
                    src={`${FOOD_SLIDER_TYPE_SUBTYPE_IMAGES}/${shopCategory[6]?.banner}`}
                    alt={`${shopCategory[6]?.store_category_name} banner`}
                    width={500}
                    height={300}
                    className="w-full max-w-full lg:w-64 h-auto rounded-lg object-contain"
                  />
                </Link>
              </div>
            </div>
            <div className="w-full lg:w-1/2 flex items-center p-5 lg:p-10">
              {DashboardSlider[0]?.third_slider?.length && (
                <Slider slides={DashboardSlider[0]?.third_slider} />
              )}
            </div>
          </div>

          {/* Section 4 */}
          <div className="flex flex-col lg:flex-row gap-5 py-5 lg:py-10 justify-center items-center">
            <div className="w-full lg:w-1/2 flex items-center p-5 lg:p-10">
              {DashboardSlider[0]?.fourth_slider?.length && (
                <Slider slides={DashboardSlider[0]?.fourth_slider} />
              )}
            </div>
            <div className="w-full lg:w-1/2 flex items-center p-5 lg:p-10">
              <Link href={`/food/${shopCategory[7]?._id}`}>
                <Image
                  src={`${FOOD_SLIDER_TYPE_SUBTYPE_IMAGES}/${shopCategory[7]?.banner}`}
                  alt={`${shopCategory[7]?.store_category_name} banner`}
                  width={500}
                  height={300}
                  className="w-full max-w-full h-auto rounded-lg object-contain"
                />
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default FoodCategorySection;
