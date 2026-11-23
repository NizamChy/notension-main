"use client";

import { useSessionStore } from "@/stores/sessionStore";
import notify from "@/utils/notify";
import { useParams } from "next/navigation";
import React, { useState, type MouseEvent } from "react";
import { ProductDetailsPage, ProductDetailsView, discountLabelOf } from "./legacyViews";
import { ITEM_MODULES, itemImageSrc, savingsOf, type ItemModuleName, type StoreItem } from "./moduleItems";
import { useStoreData } from "./useStoreData";
import { useFavouriteItem } from "@/hooks/fetch-data/favorite-item";
import { flyToCart } from "@/utils/flyToCart";

type Props = { moduleName: ItemModuleName };

// The product page. An item opened from a list is already in the query cache;
// a direct link (or a reload) fetches it by id.
const StoreItemDetails = ({ moduleName }: Props) => {
  const config = ITEM_MODULES[moduleName];
  const [isLoading, setIsLoading] = useState(false);

  const params = useParams<{ productId?: string }>();
  const productId = params?.productId;

  const query = config.useItem(productId);
  const item: StoreItem | undefined = query.item;
  // A failed request shows as not found, as the old fetch did.
  const notFound = query.notFound || query.isError;

  const { addToCart, getCurrentQty, incrementQty, decrementQty } = config.useCart();
  // The visited store, from the store query (not Redux).
  const { storeRef } = useStoreData(moduleName);
  const {
    addToFavouriteItems,
    isAddedToFavouriteItems,
    removeFromfavoriteItems,
  } = useFavouriteItem(storeRef);

  const loggedinUserInfo = useSessionStore((s) => s.userInfo);

  const merchantType = config.merchantType;
  // Read from the cart and favourites each render (the old effects re-ran
  // on every render anyway).
  const currentQuantity = item ? getCurrentQty(item) : 0;
  const isFavoriteAdded = isAddedToFavouriteItems(item?.[config.idField], merchantType);

  const handleAddToCart = async (event: MouseEvent<HTMLElement>) => {
    event.preventDefault();
    event.stopPropagation();
    const from = event.currentTarget;
    if (!item) return;
    setIsLoading(true);
    try {
      if (await addToCart(item)) flyToCart(from);
    } catch {
      notify.error("Couldn't add to cart. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddToFavorite = async (event: MouseEvent<HTMLElement>) => {
    event.preventDefault();
    event.stopPropagation();

    if (!loggedinUserInfo?._id) {
      return notify.info("Please log in to save favourites.");
    }

    setIsLoading(true);
    try {
      await addToFavouriteItems(item, merchantType);
    } catch {
      notify.error("Couldn't add to favourites. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveFromFavorite = async (event: MouseEvent<HTMLElement>) => {
    event.preventDefault();
    event.stopPropagation();

    const favouriteInfo = {
      productId: item?.[config.idField],
      [config.titleField]: item?.[config.titleField],
      [config.titleBengField]: item?.[config.titleBengField],
      pack_size: item?.pack_size,
      app_image: item?.app_image,
    };

    setIsLoading(true);
    try {
      await removeFromfavoriteItems(favouriteInfo, merchantType);
    } catch {
      notify.error("Couldn't remove from favourites. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleIncrement = async (e: MouseEvent<HTMLElement>, itemId: string) => {
    e.preventDefault();
    e.stopPropagation();
    setIsLoading(true);
    try {
      await incrementQty(itemId);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDecrement = async (e: MouseEvent<HTMLElement>, itemId: string) => {
    e.preventDefault();
    e.stopPropagation();
    setIsLoading(true);
    try {
      await decrementQty(itemId);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ProductDetailsPage
      basePath={config.basePath}
      isLoading={!item && !notFound}
      notFound={!item && notFound}
    >
      {item && (
        <ProductDetailsView
          imageSrc={itemImageSrc(config, item)}
          title={item?.[config.titleField]}
          altTitle={item?.[config.titleBengField]}
          chips={[item?.pack_size]}
          discountLabel={discountLabelOf(item)}
          salePrice={item?.sale_price}
          mrp={item?.max_retail_price}
          savings={savingsOf(item)}
          isAvailable={item?.is_available == null ? null : !!item?.is_available}
          details={[
            { label: "Pack size", value: item?.pack_size },
            { label: "Unit", value: item?.unit_symbol },
          ]}
          quantity={currentQuantity}
          isBusy={isLoading}
          onAddToCart={handleAddToCart}
          onIncrement={(e) => handleIncrement(e, item._id as string)}
          onDecrement={(e) => handleDecrement(e, item._id as string)}
          isFavorite={!!isFavoriteAdded}
          onFavoriteToggle={
            isFavoriteAdded ? handleRemoveFromFavorite : handleAddToFavorite
          }
        />
      )}
    </ProductDetailsPage>
  );
};

export default StoreItemDetails;
