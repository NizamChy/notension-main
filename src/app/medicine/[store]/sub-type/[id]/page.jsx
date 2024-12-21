// import SubTypeSection from "@/components/SubTypeSection/SubTypeSection";
// import SubTypeSection from "@/components/Grocery/SubTypeSection/SubTypeSection";
import SubTypeSection from "@/components/Medicine/SubTypeSection/SubTypeSection";
import React from "react";

const page = async ({ params }) => {
  const { id } = await params;
  const subTypeId = id || null;

  return (
    <>
      <SubTypeSection subTypeId={subTypeId} />
    </>
  );
};

export default page;
