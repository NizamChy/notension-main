"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import GroceryItems from "../GroceryItems/GroceryItems";
import NoConnection from "@/components/NoConnection/NoConnection";
import useNetworkStatus from "@/hooks/fetch-data/useNetworkStatus";
import { useGroceryProduct } from "@/hooks/fetch-data/useGroceryProduct";
import { useStoreData } from "@/components/StoreModule/useStoreData";
import { PageHeader } from "@/components/shared/UI/UI";
import {
  InfiniteItemGrid,
  TypeBreadcrumb,
} from "@/components/StoreModule/ItemBrowse";
import { toSlug } from "@/utils/slug";

const SubTypeSection = () => {
  const [id, setId] = useState("");
  const [pageNo, setPageNo] = useState(1);
  const [option, setOption] = useState("");
  const [typeId, setTypeId] = useState("");
  const [typeName, setTypeName] = useState("");
  const [selectedSubType, setSelectedSubType] = useState(null);

  const params = useParams();
  const router = useRouter();

  const { isOnline } = useNetworkStatus();
  const { getItemsOnPress, productInfo, loadingMore, allLoaded } =
    useGroceryProduct();

  const subTypeSlugId = params.subTypeSlugId;
  const { typeInfo } = useStoreData("grocery");

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
      const formattedTypeName = toSlug(typeName);

      const typeSlugId = `${formattedTypeName}_${typeId}`;

      router.push(
        `/grocery/${params?.store}/${params?.storeId}/${params?.customStoreId}/type/${typeSlugId}`
      );
    }
  };

  if (!isOnline) {
    return <NoConnection />;
  }

  return (
    <>
      {selectedSubType && id && (
        <div>
          <TypeBreadcrumb
            typeName={typeName}
            subTypeName={selectedSubType?.sub_type_name}
            onTypeClick={handleType}
          />
          <PageHeader
            title={selectedSubType?.sub_type_name}
            subtitle={
              productInfo?.length > 0
                ? `${productInfo.length}${loadingMore ? "+" : ""} products`
                : null
            }
          />

          <InfiniteItemGrid
            items={productInfo}
            allLoaded={allLoaded}
            hasMore={loadingMore}
            onLoadMore={() => getItemsOnPress(option, id, pageNo, setPageNo)}
            renderItem={(item) => <GroceryItems key={item?._id} item={item} />}
            emptyText="This category has no products in stock right now."
          />
        </div>
      )}
    </>
  );
};

export default SubTypeSection;
