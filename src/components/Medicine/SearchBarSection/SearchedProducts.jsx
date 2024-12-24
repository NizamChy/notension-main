"use client";
import React, { useEffect, useState } from "react";
import MedicineItems from "../MedicineItems/MedicineItems";
import { useSearchParams } from "next/navigation";
import ItemCardSkeleton from "../MedicineItems/ItemCardSkeleton";
import InfiniteScroll from "react-infinite-scroll-component";
import { useMedicine } from "@/hooks/fetch-data/useMedicine";
import Loader from "@/components/common/Loader";
import NoItemFound from "../NoItemSection/NoItemFound";

const SearchedProducts = () => {
  const [pageNo, setPageNo] = useState(1);

  const searchParams = useSearchParams();
  const searchText = searchParams.get("query");

  const { handleSearch, productInfo, allLoaded, loadingMore } = useMedicine();

  useEffect(() => {
    handleSearch(searchText, 1, setPageNo);
  }, [searchText]);

  return (
    <div className="m-4 lg:m-20 pt-20 lg:pt-10">
      <h4 className="text-sm md:text-xl font-medium text-gray-500 pb-4">
        Items found for{" "}
        <span className="text-gray-700"> &quot;{searchText}&quot;</span>
      </h4>

      {allLoaded && productInfo.length < 1 && <NoItemFound />}

      {!allLoaded && productInfo.length < 1 && (
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-6 gap-2 md:gap-5 justify-center items-center">
          {Array.from({ length: 12 }).map((_, index) => (
            <ItemCardSkeleton key={index} />
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
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-6 gap-2 md:gap-5 justify-center items-center">
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
