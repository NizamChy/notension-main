import React from "react";
import SubTypeSection from "@/components/Grocery/SubTypeSection/SubTypeSection";

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
