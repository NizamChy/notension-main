"use client";

import Loader from "@/components/common/Loader";
import React, { useEffect, useState } from "react";
import { useCenter } from "@/hooks/fetch-data/useCenter";
import InfiniteScroll from "react-infinite-scroll-component";
import CenterHero from "./CenterHero";
import CenterGrid from "./CenterGrid";
import { MedicalPageBody } from "./MedicalLayout";
import SearchCenter from "../SearchMedicalCenter/SearchCenter";

// Shared body of the Eye care / Dental / Hospital / Diagnostic / Consultation
// center pages: search field, hero row (slider + nearest promo) and the
// infinite list of centers in the current district.
const CenterDistrictListing = ({
  centerType,
  heroHref,
  heroImage,
  heroAlt,
  sliderNode = null,
}) => {
  const [pageNo, setPageNo] = useState(1);
  const [centerInfo, setCenterInfo] = useState([]);

  const { getCenterInfoByDistrict, loadingMore, allLoaded, banner } =
    useCenter();

  useEffect(() => {
    getCenterInfoByDistrict(centerType, setCenterInfo, pageNo, setPageNo);
  }, []);

  // All banners except the last one go to the slider.
  const slider = banner?.length > 1 ? banner.slice(0, -1) : [];

  return (
    <MedicalPageBody>
      <SearchCenter />

      <CenterHero
        slider={slider}
        sliderNode={sliderNode}
        href={heroHref}
        image={heroImage}
        alt={heroAlt}
      />

      {!allLoaded && centerInfo?.length < 1 && <Loader />}

      {centerInfo && centerInfo?.length > 0 ? (
        <InfiniteScroll
          dataLength={centerInfo?.length}
          next={() => {
            getCenterInfoByDistrict(
              centerType,
              setCenterInfo,
              pageNo,
              setPageNo
            );
          }}
          hasMore={loadingMore}
          loader={<Loader />}
          style={{ overflow: "visible" }}
        >
          <CenterGrid centers={centerInfo} />
        </InfiniteScroll>
      ) : null}
    </MedicalPageBody>
  );
};

export default CenterDistrictListing;
