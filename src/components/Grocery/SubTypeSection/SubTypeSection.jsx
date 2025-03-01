"use client";

import Link from "next/link";
import { useSelector } from "react-redux";
import { useParams } from "next/navigation";
import Loader from "@/components/common/Loader";
import React, { useEffect, useState } from "react";
import NoItemFound from "../NoItemSection/NoItemFound";
import GroceryItems from "../GroceryItems/GroceryItems";
import InfiniteScroll from "react-infinite-scroll-component";
import ItemCardSkeleton from "../GroceryItems/ItemCardSkeleton";
import NoConnection from "@/components/NoConnection/NoConnection";
import useNetworkStatus from "@/hooks/fetch-data/useNetworkStatus";
import { useGroceryProduct } from "@/hooks/fetch-data/useGroceryProduct";

const SubTypeSection = () => {
  const [id, setId] = useState("");
  const [pageNo, setPageNo] = useState(1);
  const [option, setOption] = useState("");
  const [typeId, setTypeId] = useState("");
  const [typeName, setTypeName] = useState("");
  const [selectedSubType, setSelectedSubType] = useState(null);

  const params = useParams();

  const { isOnline } = useNetworkStatus();
  const { getItemsOnPress, productInfo, loadingMore, allLoaded } =
    useGroceryProduct();

  const typeInfo = useSelector((state) => state.dashboard.typeInfo);

  useEffect(() => {
    const currentUrl = window.location.href;
    const pathSegments = currentUrl.split("/");
    const subTypeId = pathSegments[pathSegments.length - 1];
    const urlOption = pathSegments[pathSegments.length - 2];

    setOption(urlOption);
    setId(subTypeId);
  }, []);

  useEffect(() => {
    if (option && id) {
      getItemsOnPress(option, id, pageNo, setPageNo);
    }
  }, [id]);

  useEffect(() => {
    if (option && id) {
      const type = typeInfo.find((item) =>
        item?.subtype?.find((sub) => sub?.subtypeInfo?._id === id)
      );

      if (type) {
        const subtype = type.subtype.find(
          (sub) => sub?.subtypeInfo?._id === id
        );
        setTypeId(type?.id);
        setTypeName(type?.name);
        setSelectedSubType(subtype);
      }
    }
  }, [option, id, typeInfo]);

  if (!isOnline) {
    return <NoConnection />;
  }

  return (
    <div className="m-4 lg:m-20 pt-14 md:pt-20 lg:pt-10 min-h-content">
      {selectedSubType && (
        <>
          <nav className="flex mb-2 md:mb-5" aria-label="Breadcrumb">
            <ol className="inline-flex items-center space-x-1 md:space-x-2 rtl:space-x-reverse">
              <li className="inline-flex items-center">
                <Link
                  href={`/grocery/${params?.store}/type/${typeId}`}
                  className="inline-flex items-center text-sm md:text-xl font-medium text-gray-700 hover:text-blue-600"
                >
                  {typeName}
                </Link>
              </li>
              <li>
                <div className="flex items-center">
                  <svg
                    className="rtl:rotate-180 w-3 h-3 text-gray-400 mx-1"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 6 10"
                  >
                    <path
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="m1 9 4-4-4-4"
                    />
                  </svg>
                  <p className="ms-1 text-sm md:text-xl font-medium text-gray-500 md:ms-2">
                    {selectedSubType?.sub_type_name}
                  </p>
                </div>
              </li>
            </ol>
          </nav>
        </>
      )}

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
              getItemsOnPress(option, id, pageNo, setPageNo);
            }}
            hasMore={loadingMore}
            loader={<Loader />}
          >
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-6 gap-2 md:gap-5 justify-center items-center">
              {productInfo?.map((item) => (
                <GroceryItems key={item?._id} item={item} />
              ))}
            </div>
          </InfiniteScroll>
        ) : null}
      </div>
    </div>
  );
};

export default SubTypeSection;
