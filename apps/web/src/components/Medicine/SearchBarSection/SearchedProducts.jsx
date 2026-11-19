"use client";

import { useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import MedicineItems from "../MedicineItems/MedicineItems";
import { useMedicine } from "@/hooks/fetch-data/useMedicine";
import { PageHeader } from "@/components/shared/UI/UI";
import { InfiniteItemGrid } from "@/components/StoreModule/ItemBrowse";

const SearchedProducts = () => {
  const [pageNo, setPageNo] = useState(1);

  const searchParams = useSearchParams();
  const searchText = searchParams.get("query");

  const { handleSearch, productInfo, allLoaded, loadingMore } = useMedicine();

  useEffect(() => {
    handleSearch(searchText, 1, setPageNo);
  }, [searchText]);

  return (
    <div>
      <PageHeader
        title={`Results for “${searchText || ""}”`}
        subtitle={
          productInfo?.length > 0
            ? `${productInfo.length}${loadingMore ? "+" : ""} medicines found in this store`
            : null
        }
      />

      <InfiniteItemGrid
        items={productInfo}
        allLoaded={allLoaded}
        hasMore={loadingMore}
        onLoadMore={() => handleSearch(searchText, pageNo, setPageNo)}
        renderItem={(item) => <MedicineItems key={item?._id} item={item} />}
        emptyTitle="No medicines found"
        emptyText="Check the spelling, or search by brand or generic name."
      />
    </div>
  );
};

export default SearchedProducts;
