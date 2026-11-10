import React from "react";
import TypeSection from "@/components/Medicine/TypeSection/TypeSection";

// TypeSection reads `typeSlugId` itself via useParams().
const page = () => {
  return (
    <>
      <TypeSection />
    </>
  );
};

export default page;
