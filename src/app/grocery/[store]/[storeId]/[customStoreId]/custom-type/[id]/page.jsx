import React from "react";
import CustomTypeSection from "@/components/StoreModule/CustomTypeSection";

const page = async ({ params }) => {
  const { id } = await params;
  const customTypeId = id || null;

  return (
    <>
      <CustomTypeSection moduleName="grocery" customTypeId={customTypeId} />
    </>
  );
};

export default page;
