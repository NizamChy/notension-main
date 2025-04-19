"use client";

import { useSelector } from "react-redux";
import React, { useEffect, useState } from "react";
import NoItemFound from "../NoItemSection/NoItemFound";
import { useParams, useRouter } from "next/navigation";
import MedicineItems from "../MedicineItems/MedicineItems";
import { useMedicine } from "@/hooks/fetch-data/useMedicine";
import InfiniteScroll from "react-infinite-scroll-component";
import ItemCardSkeleton from "../MedicineItems/ItemCardSkeleton";

const SubTypeSection = () => {
  const [id, setId] = useState("");
  const [pageNo, setPageNo] = useState(1);
  const [option, setOption] = useState("");
  const [typeId, setTypeId] = useState("");
  const [typeName, setTypeName] = useState("");
  const [selectedSubType, setSelectedSubType] = useState(null);

  const params = useParams();
  const router = useRouter();

  const { getItemsOnPress, productInfo, loadingMore, allLoaded } =
    useMedicine();

  const subTypeSlugId = params.subTypeSlugId;
  const typeInfo = useSelector((state) => state.dashboard.typeInfo);

  useEffect(() => {
    const [slug, subTypeId] = subTypeSlugId.split("_");

    if (subTypeId) {
      const urlOption = "sub-type";

      setOption(urlOption);
      setId(subTypeId);
    }
  }, []);

  useEffect(() => {
    if (option && id && typeInfo) {
      getItemsOnPress(option, id, pageNo, setPageNo);
    }
  }, [id, typeInfo]);

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

  const handleType = () => {
    if (typeName && typeId) {
      const formattedTypeName = typeName
        ?.trim()
        .toLowerCase()
        .replace(/[^\p{Script=Bengali}a-z0-9 ]/gu, "")
        .replace(/\s+/g, "-");

      const typeSlugId = `${formattedTypeName}_${typeId}`;

      router.push(
        `/medicine/${params?.store}/${params?.storeId}/${params?.customStoreId}/type/${typeSlugId}`
      );
    }
  };

  return (
    <div className="m-4 lg:m-20 pt-14 md:pt-20 lg:pt-10 min-h-content">
      {selectedSubType && (
        <>
          <nav className="flex mb-5" aria-label="Breadcrumb">
            <ol className="inline-flex items-center space-x-1 md:space-x-2 rtl:space-x-reverse">
              <li
                onClick={handleType}
                className="inline-flex items-center cursor-pointer"
              >
                <p className="inline-flex items-center text-xs md:text-xl font-medium text-gray-700 hover:text-secondaryMedicine">
                  {typeName}
                </p>
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
                  <p className="ms-1 text-xs md:text-xl font-medium text-gray-500 md:ms-2">
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
            loader={
              <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-6 gap-2 md:gap-5 justify-center items-center">
                {Array.from({ length: 6 }).map((_, index) => (
                  <ItemCardSkeleton key={index} />
                ))}
              </div>
            }
          >
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-6 gap-2 md:gap-5 justify-center items-center">
              {productInfo?.map((item) => (
                <MedicineItems key={item?._id} item={item} />
              ))}
            </div>
          </InfiniteScroll>
        ) : null}
      </div>
    </div>
  );
};

export default SubTypeSection;
