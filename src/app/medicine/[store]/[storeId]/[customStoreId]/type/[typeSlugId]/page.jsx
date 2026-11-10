import React from "react";
import TypeSection from "@/components/StoreModule/TypeSection";

// TypeSection reads `typeSlugId` itself via useParams().
const page = () => {
  return (
    <>
      <TypeSection moduleName="medicine" />
    </>
  );
};

export default page;
