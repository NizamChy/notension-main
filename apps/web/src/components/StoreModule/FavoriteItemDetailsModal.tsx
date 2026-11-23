"use client";

import React, { type MouseEvent } from "react";
import { HiOutlineCube } from "react-icons/hi2";
import { useFavouriteItem } from "@/hooks/fetch-data/favorite-item";
import {
  EmptyState,
  ProductDetailsSkeleton,
  ProductDetailsView,
  ProductQuickView,
  discountLabelOf,
} from "./legacyViews";
import {
  ITEM_MODULES,
  itemImageSrc,
  quickViewExtras,
  type ItemModuleName,
  type StoreItem,
} from "./moduleItems";
import { useStoreData } from "./useStoreData";
import { flyToCart } from "@/utils/flyToCart";

// What the old favourites lookup said when the store no longer has the item.
const NOT_IN_STORE = "এই মুহুর্তে পণ্যটি দোকানে নেই !!";

type Props = {
  moduleName: ItemModuleName;
  isOpen: boolean;
  onClose: () => void;
  /** A saved favourite: `productId` plus the saved fields. */
  item: StoreItem;
};

// Quick view of a saved favourite: loads the item from the visited store.
const FavoriteItemDetailsModal = ({ moduleName, isOpen, onClose, item }: Props) => {
  const config = ITEM_MODULES[moduleName];

  const { addToCart, getCurrentQty, incrementQty, decrementQty } = config.useCart();
  // The visited store, from the store query (not Redux).
  const { storeRef } = useStoreData(moduleName);

  const {
    visible,
    addToFavouriteItems,
    isAddedToFavouriteItems,
    removeFromfavoriteItems,
  } = useFavouriteItem(storeRef);
  const details = config.useItem(item?.productId);
  const itemDetails: StoreItem | undefined = details.item;
  const { isLoading, notFound } = details;

  const merchantType = config.merchantType;
  // Read from the cart and favourites each render (the old effects re-ran
  // on every render anyway).
  const currentQuantity = itemDetails ? getCurrentQty(itemDetails) : 0;
  const isFavoriteAdded = isAddedToFavouriteItems(
    // productInfoTable is an id string (populated object on some
    // responses); `?._id` alone was always undefined for the string form.
    (itemDetails?.[config.idField] as { _id?: string } | undefined)?._id ??
      itemDetails?.[config.idField],
    merchantType
  );

  const handleAddToCart = (event: MouseEvent<HTMLElement>) => {
    event.preventDefault();
    event.stopPropagation();

    if (itemDetails && addToCart(itemDetails)) flyToCart(event.currentTarget);
  };

  const handleAddToFavorite = (event: MouseEvent<HTMLElement>) => {
    event.preventDefault();
    event.stopPropagation();

    addToFavouriteItems(itemDetails, merchantType);
  };

  const handleRemoveFromFavorite = (event: MouseEvent<HTMLElement>) => {
    event.preventDefault();
    event.stopPropagation();

    if (config.favouriteRemoval === "saved") {
      removeFromfavoriteItems(item, merchantType);
      return;
    }
    removeFromfavoriteItems(
      {
        productId: itemDetails?.[config.idField],
        [config.titleField]: itemDetails?.[config.titleField],
        [config.titleBengField]: itemDetails?.[config.titleBengField],
        pack_size: itemDetails?.pack_size,
        app_image: itemDetails?.app_image,
      },
      merchantType,
    );
  };

  const handleIncrement = (e: MouseEvent<HTMLElement>, itemId: string) => {
    e.preventDefault();
    e.stopPropagation();

    incrementQty(itemId);
  };

  const handleDecrement = (e: MouseEvent<HTMLElement>, itemId: string) => {
    e.preventDefault();
    e.stopPropagation();

    decrementQty(itemId);
  };

  return (
    <ProductQuickView isOpen={isOpen} onClose={onClose}>
      {visible || isLoading ? (
        <ProductDetailsSkeleton variant="modal" />
      ) : notFound ? (
        <EmptyState
          icon={<HiOutlineCube />}
          title="Not available"
          text={NOT_IN_STORE}
          className="min-h-[30vh] border-0!"
        />
      ) : (
        <ProductDetailsView
          variant="modal"
          imageSrc={itemImageSrc(config, itemDetails)}
          title={itemDetails?.[config.titleField]}
          {...quickViewExtras(config.detailExtras(itemDetails))}
          discountLabel={discountLabelOf(itemDetails)}
          salePrice={itemDetails?.sale_price}
          mrp={itemDetails?.max_retail_price}
          savings={config.savings(itemDetails)}
          quantity={currentQuantity}
          onAddToCart={handleAddToCart}
          onIncrement={(e) => handleIncrement(e, itemDetails?._id as string)}
          onDecrement={(e) => handleDecrement(e, itemDetails?._id as string)}
          isFavorite={!!isFavoriteAdded}
          onFavoriteToggle={
            isFavoriteAdded ? handleRemoveFromFavorite : handleAddToFavorite
          }
        />
      )}
    </ProductQuickView>
  );
};

export default FavoriteItemDetailsModal;
