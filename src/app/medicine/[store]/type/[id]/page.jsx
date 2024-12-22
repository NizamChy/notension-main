import TypeSection from "@/components/Medicine/TypeSection/TypeSection";
import React from "react";

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
