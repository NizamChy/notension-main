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
