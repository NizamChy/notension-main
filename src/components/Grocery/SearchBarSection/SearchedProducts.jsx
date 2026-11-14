"use client";

import { useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import GroceryItems from "../GroceryItems/GroceryItems";
import { PageHeader } from "@/components/shared/UI/UI";
import { InfiniteItemGrid } from "@/components/StoreModule/ItemBrowse";
import { useGroceryProduct } from "@/hooks/fetch-data/useGroceryProduct";

const SearchedProducts = () => {
  const [pageNo, setPageNo] = useState(1);

  const searchParams = useSearchParams();
  const searchText = searchParams.get("query");

  const { handleSearch, productInfo, allLoaded, loadingMore } =
    useGroceryProduct();

  useEffect(() => {
    if (searchText?.length > 1) {
      handleSearch(searchText, 1, setPageNo);
    }
  }, [searchText]);

  return (
    <div>
      <PageHeader
        title={`Results for “${searchText || ""}”`}
        subtitle={
          productInfo?.length > 0
            ? `${productInfo.length}${loadingMore ? "+" : ""} products found in this store`
            : null
        }
      />

      <InfiniteItemGrid
        items={productInfo}
        allLoaded={allLoaded}
        hasMore={loadingMore}
        onLoadMore={() => handleSearch(searchText, pageNo, setPageNo)}
        renderItem={(item) => <GroceryItems key={item?._id} item={item} />}
        emptyTitle="No products found"
        emptyText="Check the spelling or try a more general word."
      />
    </div>
  );
};

export default SearchedProducts;
