"use client";

import Link from "next/link";
import Image from "next/image";
import Slider from "../../common/Slider";
import { useSelector } from "react-redux";
import { HiOutlineMapPin } from "react-icons/hi2";
import {
  CARD,
  CARD_HOVER,
  PAGE_CONTAINER,
  SectionTitle,
  Skeleton,
} from "@/components/shared/UI/UI";
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
            <div className={`${PAGE_CONTAINER} space-y-8 py-6 md:space-y-12 md:py-10`}>
              <Skeleton className="h-16 w-72 max-w-full" />
              <div className="grid gap-4 md:grid-cols-2 md:gap-6">
                <Skeleton className="aspect-[5/2] w-full rounded-2xl" />
                <Skeleton className="hidden aspect-[5/2] w-full rounded-2xl md:block" />
              </div>
              <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4 lg:gap-5">
                {Array.from({ length: 8 }).map((_, index) => (
                  <Skeleton key={index} className="aspect-[5/4] w-full rounded-2xl" />
                ))}
              </div>
            </div>
          ) : (
            <div className={`${PAGE_CONTAINER} space-y-8 py-6 md:space-y-12 md:py-10`}>
              <div>
                <p className="inline-flex items-center gap-1.5 text-sm font-medium text-gray-500">
                  <HiOutlineMapPin className="text-base text-[#EB5C2F]" aria-hidden="true" />
                  Delivering to {currentUserLocation}
                </p>
                <h1 className="mt-1 text-2xl font-bold tracking-tight text-gray-900 md:text-3xl">
                  What are you craving today?
                </h1>
              </div>

              <SliderPair
                first={sliders.first_slider}
                second={sliders.second_slider}
              />

              {shopCategory?.length > 0 && (
                <section>
                  <SectionTitle
                    title="Explore by category"
                    subtitle="Restaurants and food stores near you"
                  />
                  {/* Equal 5:3 photos with the name underneath: 2 columns
                      on phones, 4 from tablet up. */}
                  <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4 lg:gap-5">
                    {shopCategory.map((category) => (
                      <Link
                        key={category?._id}
                        href={`/food/${category?._id}`}
                        className={`${CARD} ${CARD_HOVER} group block overflow-hidden`}
                      >
                        <div className="relative aspect-[5/3] overflow-hidden bg-gray-100">
                          <Image
                            fill
                            sizes="(min-width: 1024px) 25vw, 50vw"
                            src={`${FOOD_SLIDER_TYPE_SUBTYPE_IMAGES}/${category?.banner}`}
                            alt={`${category?.store_category_name} banner`}
                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                        </div>
                        <p className="truncate px-3 py-2.5 text-sm font-semibold text-gray-900 md:px-4 md:py-3 md:text-base">
                          {category?.store_category_name}
                        </p>
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
