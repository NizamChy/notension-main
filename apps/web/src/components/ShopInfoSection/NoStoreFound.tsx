import React, { type ReactNode } from "react";
import { HiOutlineBuildingStorefront } from "react-icons/hi2";
import { EmptyState } from "../shared/UI/UI";

type Props = {
  title?: string;
  text?: string;
  action?: ReactNode;
};

const NoStoreFound = ({
  title = "No stores found",
  text = "We couldn't find a store here yet. Try another search or change your delivery location.",
  action,
}: Props) => (
  <EmptyState
    icon={<HiOutlineBuildingStorefront />}
    title={title}
    text={text}
    action={action}
    className="min-h-[40vh]"
  />
);

export default NoStoreFound;
