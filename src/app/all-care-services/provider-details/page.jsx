import React, { Suspense } from "react";
import Loader from "@/components/common/Loader";
import ServiceProviderDetails from "@/components/AllCareServices/ServiceProviderDetails";

const page = () => {
  return (
    <div className="min-h-content">
      {/* useSearchParams (provider id) needs a Suspense boundary. */}
      <Suspense fallback={<Loader />}>
        <ServiceProviderDetails />
      </Suspense>
    </div>
  );
};

export default page;
