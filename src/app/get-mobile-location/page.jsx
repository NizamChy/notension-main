import React from "react";
// import Map from "@/components/shared/Map/Map";
import MapMobile from "@/components/shared/Map/MapMobile";

const page = () => {
  return (
    <div className="mt-4 block md:hidden">
      {/* <Map /> */}

      <MapMobile />
    </div>
  );
};

export default page;
