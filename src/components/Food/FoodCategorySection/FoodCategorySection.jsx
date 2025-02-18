"use client";

import Link from "next/link";
import Image from "next/image";
import Slider from "../../common/Slider";
import Loader from "../../common/Loader";
import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { useFood } from "@/hooks/fetch-data/useFood";
import { FOOD_SLIDER_TYPE_SUBTYPE_IMAGES } from "@/api-endpoints/api-endpoint";

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
        <div className="min-h-content flex justify-center items-center">
          <Loader />
        </div>
      ) : (
        <div className="p-5 lg:p-20 min-h-content">
          {/* Section 1 */}
          <div className="flex flex-col-reverse lg:flex-row gap-5 lg:gap-10">
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
                <Slider
                  classNames="max-h-[532px]"
                  slides={DashboardSlider[0]?.second_slider}
                />
              )}
            </div>
          </div>

          {/* Section 2 */}
          <div className="flex flex-col lg:flex-row gap-5 py-5 lg:py-10 justify-center items-center">
            <div className="w-full lg:w-1/2 flex items-center justify-center p-5 lg:p-20">
              {DashboardSlider[0]?.first_slider?.length && (
                <Slider
                  classNames="max-h-[359px]"
                  slides={DashboardSlider[0]?.first_slider}
                />
              )}
            </div>
            <div className="w-full lg:w-1/2 p-5 md:p-0 lg:p-10 flex justify-center">
              <div className="flex flex-row gap-5 lg:gap-20">
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
          <div className="flex flex-col-reverse lg:flex-row gap-5 py-5 lg:py-10 justify-center items-center">
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
              <div className="flex flex-row gap-5 justify-evenly mt-5 lg:my-10">
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
                <Slider
                  classNames="max-h-[532px]"
                  slides={DashboardSlider[0]?.third_slider}
                />
              )}
            </div>
          </div>

          {/* Section 4 */}
          <div className="flex flex-col lg:flex-row gap-5 py-5 lg:py-10 justify-center items-center">
            <div className="w-full lg:w-1/2 flex items-center p-5 lg:p-10">
              {DashboardSlider[0]?.fourth_slider?.length && (
                <Slider
                  classNames="max-h-[399px]"
                  slides={DashboardSlider[0]?.fourth_slider}
                />
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
