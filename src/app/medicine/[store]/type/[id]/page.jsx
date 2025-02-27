import React from "react";
import TypeSection from "@/components/Medicine/TypeSection/TypeSection";

const page = async ({ params }) => {
  const { id } = await params;
  const typeId = id || null;

  return (
    <>
      <TypeSection typeId={typeId} />
    </>
  );
};

export default page;
