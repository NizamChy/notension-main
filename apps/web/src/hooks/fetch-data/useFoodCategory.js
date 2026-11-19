import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useParams } from "next/navigation";
import { useFood } from "./useFood";

// The food store category of the current /food/[id]/... page.
// The category list is normally loaded by the /food page; when someone opens
// a category link directly it isn't there yet, so load it here.
// `ready` turns true once the list is available (or failed to load), so the
// page can tell "still loading" from "unknown category".
export const useFoodCategory = () => {
  const { id: catId } = useParams();
  const shopCategory = useSelector((state) => state.dashboard.shopCategory);
  const { exploreFoodModule } = useFood();
  const [loadFinished, setLoadFinished] = useState(false);

  const hasList = shopCategory?.length > 0;

  useEffect(() => {
    if (hasList) return;
    exploreFoodModule()?.finally(() => setLoadFinished(true));
    // eslint-disable-next-line react-hooks/exhaustive-deps -- load once
  }, []);

  const category = shopCategory?.find((item) => item?._id === catId) || null;

  return { catId, category, ready: hasList || loadFinished };
};
