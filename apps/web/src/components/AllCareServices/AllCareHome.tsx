"use client";

import { usePreferencesStore } from "@/stores/preferencesStore";
import React, { useEffect } from "react";
import { HiOutlineWrenchScrewdriver } from "react-icons/hi2";
import { EmptyState, PAGE_CONTAINER } from "@/components/shared/UI/UI";
import ServicesArea from "@/components/AllCareServices/ServicesArea";
import ServicesSlider from "@/components/AllCareServices/ServicesSlider";
import { useCareServices } from "@/hooks/allCare/useAllCare";
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
] as const;

const AllCareHome = () => {
  // Services and sliders for the user's district (refetched when it changes).
  const { services: allServicesInfo, slider, isLoading } = useCareServices();

  // All Care counts as the dashboard (as the old explore call set it).
  useEffect(() => {
    usePreferencesStore.getState().setCurrentModule("dashboard");
  }, []);

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
              <ServicesSlider slider={slider?.[sliderKey]} />
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
