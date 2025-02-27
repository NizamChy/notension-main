import React from "react";
import CustomTypeSection from "@/components/Medicine/CustomTypeSection/CustomTypeSection";

const page = async ({ params }) => {
  const { id } = await params;
  const customTypeId = id || null;

  return (
    <>
      <CustomTypeSection customTypeId={customTypeId} />
    </>
  );
};

export default page;
