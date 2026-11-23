"use client";

import { useSessionStore } from "@/stores/sessionStore";
import notify from "@/utils/notify";
import React, { type MouseEvent } from "react";
import { useFavouriteItem } from "@/hooks/fetch-data/favorite-item";
import { ProductDetailsView, ProductQuickView, discountLabelOf } from "./legacyViews";
import {
  ITEM_MODULES,
  itemImageSrc,
  quickViewExtras,
  type ItemModuleName,
  type StoreItem,
} from "./moduleItems";
import { useStoreData } from "./useStoreData";
import { flyToCart } from "@/utils/flyToCart";

type Props = {
  moduleName: ItemModuleName;
  isOpen: boolean;
  onClose: () => void;
  item: StoreItem;
};

// Quick view of a store list item.
const ItemDetailsModal = ({ moduleName, isOpen, onClose, item }: Props) => {
  const config = ITEM_MODULES[moduleName];

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
  const currentQuantity = getCurrentQty(item);
  const isFavoriteAdded = isAddedToFavouriteItems(item?.[config.idField], merchantType);

  const handleAddToCart = (event: MouseEvent<HTMLElement>) => {
    event.preventDefault();
    event.stopPropagation();

    if (addToCart(item)) flyToCart(event.currentTarget);
  };

  const handleAddToFavorite = (event: MouseEvent<HTMLElement>) => {
    event.preventDefault();
    event.stopPropagation();

    if (!loggedinUserInfo?._id) {
      return notify.info("Please log in to save favourites.");
    }

    addToFavouriteItems(item, merchantType);
  };

  const handleRemoveFromFavorite = (event: MouseEvent<HTMLElement>) => {
    event.preventDefault();
    event.stopPropagation();

    const favouriteInfo = {
      productId: item?.[config.idField],
      [config.titleField]: item?.[config.titleField],
      [config.titleBengField]: item?.[config.titleBengField],
      pack_size: item?.pack_size,
      app_image: item?.app_image,
    };

    removeFromfavoriteItems(favouriteInfo, merchantType);
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
      <ProductDetailsView
        variant="modal"
        imageSrc={itemImageSrc(config, item)}
        title={item?.[config.titleField]}
        {...quickViewExtras(config.detailExtras(item))}
        discountLabel={discountLabelOf(item)}
        salePrice={item?.sale_price}
        mrp={item?.max_retail_price}
        savings={config.savings(item)}
        quantity={currentQuantity}
        onAddToCart={handleAddToCart}
        onIncrement={(e) => handleIncrement(e, item._id as string)}
        onDecrement={(e) => handleDecrement(e, item._id as string)}
        isFavorite={!!isFavoriteAdded}
        onFavoriteToggle={
          isFavoriteAdded ? handleRemoveFromFavorite : handleAddToFavorite
        }
      />
    </ProductQuickView>
  );
};

export default ItemDetailsModal;
