import React from "react";
import { HiArrowRight } from "react-icons/hi";
import { SECONDARY_BUTTON } from "@/components/shared/UI/UI";

const ExploreButton = ({ title = "Browse All Items", onClick = () => {} }) => {
  return (
    <button type="button" onClick={onClick} className={`group ${SECONDARY_BUTTON}`}>
      {title}
      <HiArrowRight className="transition-transform group-hover:translate-x-0.5" />
    </button>
  );
};

export default ExploreButton;
