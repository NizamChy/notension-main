"use client";

import Link from "next/link";
import Image from "next/image";
import Slider from "../../common/Slider";
import Loader from "../../common/Loader";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useFood } from "@/hooks/fetch-data/useFood";
import MapModal from "@/components/shared/LocationModal/MapModal";
import { FOOD_SLIDER_TYPE_SUBTYPE_IMAGES } from "@/api-endpoints/api-endpoint";

// Two equal 5:2 sliders side by side (stacked on mobile).
const SliderPair = ({ first, second }) => {
  if (!first?.length && !second?.length) return null;

  return (
    <div className="grid gap-4 md:gap-6 md:grid-cols-2">
      {first?.length > 0 && <Slider slides={first} />}
      {second?.length > 0 && <Slider slides={second} />}
    </div>
  );
};

const FoodCategorySection = () => {
  const [openMapModal, setOpenMapModal] = useState(false);

  const router = useRouter();
  const { exploreFoodModule, progressing } = useFood();

  const handleOpenMapModal = () => setOpenMapModal(true);
  const handleCloseMapModal = () => setOpenMapModal(false);

  const currentUserLocation = useSelector(
    (state) => state.user.currentUserLocation.districtName
  );

  const shopCategory = useSelector((state) => state.dashboard.shopCategory);
  const DashboardSlider = useSelector(
    (state) => state.dashboard.DashboardSlider
  );
  const sliders = DashboardSlider?.[0] || {};

  useEffect(() => {
    if (currentUserLocation) {
      exploreFoodModule();
    } else {
      const screenWidth = window.innerWidth;

      if (screenWidth < 768) {
        router.push("/get-mobile-location");
      } else {
        handleOpenMapModal();
      }
    }
    // Runs once on mount; the helpers are recreated on every render.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="min-h-content">
      {currentUserLocation && (
        <>
          {progressing ? (
            <div className="flex justify-center items-center">
              <Loader />
            </div>
          ) : (
            <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-6 md:py-10 space-y-8 md:space-y-12">
              <SliderPair
                first={sliders.first_slider}
                second={sliders.second_slider}
              />

              {shopCategory?.length > 0 && (
                <section>
                  <h2 className="text-lg md:text-2xl font-bold text-deepGray mb-4 md:mb-6">
                    Explore by category
                  </h2>
                  {/* Equal 5:3 tiles (the banners' ratio): 2 columns on
                      phones, 4 from tablet up. */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 lg:gap-5">
                    {shopCategory.map((category) => (
                      <Link
                        key={category?._id}
                        href={`/food/${category?._id}`}
                        title={category?.store_category_name}
                        className="group relative block aspect-[5/3] overflow-hidden rounded-xl md:rounded-2xl bg-gray-100 shadow-sm hover:shadow-lg transition-shadow duration-300"
                      >
                        <Image
                          fill
                          sizes="(min-width: 1024px) 25vw, 50vw"
                          src={`${FOOD_SLIDER_TYPE_SUBTYPE_IMAGES}/${category?.banner}`}
                          alt={`${category?.store_category_name} banner`}
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      </Link>
                    ))}
                  </div>
                </section>
              )}

              <SliderPair
                first={sliders.third_slider}
                second={sliders.fourth_slider}
              />
            </div>
          )}
        </>
      )}

      {openMapModal && (
        <MapModal isOpen={openMapModal} onCloseModal={handleCloseMapModal} />
      )}
    </div>
  );
};

export default FoodCategorySection;
