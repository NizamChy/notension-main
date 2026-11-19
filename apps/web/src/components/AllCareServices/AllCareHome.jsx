"use client";

import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { HiOutlineWrenchScrewdriver } from "react-icons/hi2";
import { EmptyState, PAGE_CONTAINER } from "@/components/shared/UI/UI";
import ServicesArea from "@/components/AllCareServices/ServicesArea";
import ServicesSlider from "@/components/AllCareServices/ServicesSlider";
import { useAllCareService } from "@/hooks/fetch-data/useAllCareService";
import AllCareServices from "@/components/AllCareServices/AllCareServices";

// Each group of services (a slice of the service list) follows its own
// banner slider.
const SECTIONS = [
  ["first_slider", 0, 4, "Your Trusted Partner for Every Service"],
  ["second_slider", 4, 16, "One Platform, Endless Solutions!"],
  ["third_slider", 16, 20, "Learn, Grow, Succeed with Us!"],
  ["fourth_slider", 20, 24, "Building Skills, Shaping Futures"],
  ["fifth_slider", 24, 33, "All-in-One Service at Your Fingertips!"],
  ["sixth_slider", 33, 39, "Expert Help, Anytime!"],
  ["seventh_slider", 39, 45, "Connecting You to Expert Services!"],
];

const AllCareHome = () => {
  const { exploreAllCareService } = useAllCareService();
  const { careSlider, allServicesInfo, isLoading } = useSelector(
    (state) => state.allCare
  );
  const districtId = useSelector((state) => state.user.districtId);

  // Refetch whenever the user's district changes. Persisted data is kept on
  // screen meanwhile only if it was fetched for this same district (the
  // reducer clears it otherwise).
  useEffect(() => {
    return exploreAllCareService();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [districtId]);

  const isEmpty = !isLoading && !(allServicesInfo?.length > 0);

  return (
    <div
      className={`${PAGE_CONTAINER} min-h-content flex flex-col gap-10 py-5 md:gap-14 md:py-8`}
    >
      <AllCareServices />

      <div
        id="all-care-services"
        className="flex scroll-mt-24 flex-col gap-10 md:gap-14"
      >
        {isEmpty ? (
          <EmptyState
            icon={<HiOutlineWrenchScrewdriver />}
            title="No services in your area yet"
            text="We're adding new providers every week. Try another location or check back soon."
          />
        ) : (
          SECTIONS.map(([sliderKey, start, end, title]) => (
            <React.Fragment key={sliderKey}>
              <ServicesSlider slider={careSlider?.[0]?.[sliderKey]} />
              <ServicesArea
                sliceStart={start}
                sliceEnd={end}
                title={title}
              />
            </React.Fragment>
          ))
        )}
      </div>
    </div>
  );
};

export default AllCareHome;
