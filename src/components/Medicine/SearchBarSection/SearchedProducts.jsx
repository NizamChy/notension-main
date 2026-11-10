"use client";

import Loader from "@/components/common/Loader";
import { useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import MedicineItems from "../MedicineItems/MedicineItems";
import InfiniteScroll from "react-infinite-scroll-component";
import { useMedicine } from "@/hooks/fetch-data/useMedicine";
import ItemCardSkeleton from "@/components/StoreModule/ItemCardSkeleton";
import NoItemFound from "@/components/common/NoItemFound";

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
      <h4 className="text-base md:text-xl font-medium text-gray-500 mb-4 md:mb-6">
        Items found for{" "}
        <span className="text-gray-700"> &quot;{searchText}&quot;</span>
      </h4>

      {allLoaded && productInfo.length < 1 && <NoItemFound />}

      {!allLoaded && productInfo.length < 1 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-3 md:gap-5">
          {Array.from({ length: 12 }).map((_, index) => (
            <ItemCardSkeleton moduleName="medicine" key={index} />
          ))}
        </div>
      )}

      <div className="relative">
        {productInfo && productInfo.length > 0 ? (
          <InfiniteScroll
            dataLength={productInfo?.length}
            next={() => {
              handleSearch(searchText, pageNo, setPageNo);
            }}
            hasMore={loadingMore}
            loader={<Loader />}
          >
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-3 md:gap-5">
              {productInfo?.map((item) => (
                <div key={item?._id}>
                  <MedicineItems item={item} />
                </div>
              ))}
            </div>
          </InfiniteScroll>
        ) : null}
      </div>
    </div>
  );
};

export default SearchedProducts;
