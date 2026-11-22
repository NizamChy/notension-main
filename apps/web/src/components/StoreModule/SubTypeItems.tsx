"use client";

import React, { useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import NoConnection from "@/components/NoConnection/NoConnection";
import useNetworkStatus from "@/hooks/fetch-data/useNetworkStatus";
import { InfiniteItemGrid, PageHeader, TypeBreadcrumb } from "./legacyViews";
import StoreItemTile from "./StoreItemTile";
import { ITEM_MODULES, type ItemModuleName, type StoreItem } from "./moduleItems";
import { useStoreData } from "./useStoreData";
import { toSlug } from "@/utils/slug";

type Props = { moduleName: ItemModuleName };
type StoreParams = {
  store?: string;
  storeId?: string;
  customStoreId?: string;
  subTypeSlugId?: string;
};
type SubType = { sub_type_name?: string; subtypeInfo?: { _id?: string } };

// The items of one sub-type, with a breadcrumb back to its type.
const SubTypeItems = ({ moduleName }: Props) => {
  const config = ITEM_MODULES[moduleName];
  const params = useParams<StoreParams>();
  const router = useRouter();

  const { isOnline } = useNetworkStatus();

  // The URL segment is "<slug>_<subTypeId>".
  const id = (params?.subTypeSlugId ?? "").split("_")[1] ?? "";
  const { typeInfo } = useStoreData(moduleName);

  const { items, notFound, isError, hasMore, loadMore } = config.useItemList(
    id ? { kind: "sub-type", id } : null
  );

  // The type that holds this sub-type, for the heading and breadcrumb.
  const { typeId, typeName, selectedSubType } = useMemo(() => {
    const type = id
      ? typeInfo.find((info) =>
          (info?.subtype as SubType[])?.find((sub) => sub?.subtypeInfo?._id === id)
        )
      : undefined;
    const subtype = (type?.subtype as SubType[] | undefined)?.find(
      (sub) => sub?.subtypeInfo?._id === id
    );
    return { typeId: type?.id, typeName: type?.name, selectedSubType: subtype ?? null };
  }, [id, typeInfo]);

  const handleType = () => {
    if (typeName && typeId) {
      const formattedTypeName = toSlug(typeName);

      const typeSlugId = `${formattedTypeName}_${typeId}`;

      router.push(
        `${config.basePath}/${params?.store}/${params?.storeId}/${params?.customStoreId}/type/${typeSlugId}`
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
              items?.length > 0
                ? `${items.length}${hasMore ? "+" : ""} products`
                : null
            }
          />

          <InfiniteItemGrid<StoreItem>
            items={items}
            allLoaded={notFound || isError}
            hasMore={hasMore}
            onLoadMore={loadMore}
            renderItem={(item) => (
              <StoreItemTile key={item?._id} moduleName={moduleName} item={item} />
            )}
            emptyText="This category has no products in stock right now."
          />
        </div>
      )}
    </>
  );
};

export default SubTypeItems;
