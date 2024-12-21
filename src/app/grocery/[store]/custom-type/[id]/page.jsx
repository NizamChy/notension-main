import CustomTypeSection from "@/components/Grocery/CustomTypeSection/CustomTypeSection";
import React from "react";

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
