"use client";

import { useSessionStore } from "@/stores/sessionStore";
import { useParams } from "next/navigation";
import { useEffect, useRef, useState, type MouseEvent, type SyntheticEvent } from "react";
import { useQueryClient } from "@tanstack/react-query";
import CommonModal from "@/components/shared/CommonModal/CommonModal";
import LoginModalDetails from "@/components/LoginSection/LoginModalDetails";
import StoreItemCard from "./StoreItemCard";
import { discountLabelOf } from "./ProductDetailsView";
import ItemDetailsModal from "./ItemDetailsModal";
import FavoriteItemDetailsModal from "./FavoriteItemDetailsModal";
import { ITEM_MODULES, itemImageSrc, type ItemModuleName, type StoreItem } from "./moduleItems";
import { useStoreData } from "./useStoreData";
import { useFavouriteItem } from "@/hooks/fetch-data/favorite-item";
import { flyToCart } from "@/utils/flyToCart";

type Props = { moduleName: ItemModuleName; item: StoreItem; isFavorite?: boolean };
type StoreParams = { store?: string; storeId?: string; customStoreId?: string };

const StoreItemTile = ({ moduleName, item, isFavorite = false }: Props) => {
  const config = ITEM_MODULES[moduleName];
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<StoreItem | null>(null);

  const params = useParams<StoreParams>();
  const prevUrlRef = useRef<string | null>(null);
  const queryClient = useQueryClient();

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
  // Read straight from the store each render, so the card never lags.
  const currentQuantity = getCurrentQty(item);
  const isFavoriteAdded = isAddedToFavouriteItems(item?.[config.idField], merchantType);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const handleAddToCart = (event: MouseEvent<HTMLElement>) => {
    event.preventDefault();
    event.stopPropagation();

    if (addToCart(item)) flyToCart(event.currentTarget);
  };

  const handleAddToFavorite = (event: MouseEvent<HTMLElement>) => {
    event.preventDefault();
    event.stopPropagation();

    if (!loggedinUserInfo?._id) {
      return openModal();
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

    if (isFavorite) {
      removeFromfavoriteItems(item, merchantType);
    } else {
      removeFromfavoriteItems(favouriteInfo, merchantType);
    }
  };

  const handleProductClick = (event: SyntheticEvent<HTMLElement>) => {
    event.preventDefault();
    event.stopPropagation();

    setSelectedItem(item);

    // The product page reads the item from the query cache (it was Redux).
    // A saved favourite is not a store item, so it is not filed.
    if (!isFavorite && params?.storeId) {
      config.seedItem(queryClient, params.storeId, item);
    }
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

  useEffect(() => {
    const basePath = `${config.basePath}/${params?.store}/${params?.storeId}/${params?.customStoreId}`;

    if (selectedItem && item?._id && !isFavorite) {
      if (!prevUrlRef.current) {
        prevUrlRef.current = window.location.href;
      }

      const newUrl = `${basePath}/product/${item._id}`;
      if (!window.location.pathname.endsWith(`/${item._id}`)) {
        window.history.replaceState({}, "", newUrl);
      }
    } else {
      if (prevUrlRef.current) {
        window.history.replaceState({}, "", prevUrlRef.current);
        prevUrlRef.current = null;
      }
    }
  }, [selectedItem, item?._id, params, isFavorite, config.basePath]);

  return (
    <>
      <StoreItemCard
        moduleName={moduleName}
        imageSrc={itemImageSrc(config, item)}
        title={item?.[config.titleField]}
        subtitle={config.subtitle(item)}
        salePrice={item?.sale_price}
        mrp={item?.max_retail_price}
        discountLabel={discountLabelOf(item)}
        isFavorite={isFavorite || !!isFavoriteAdded}
        onClick={handleProductClick}
        onFavoriteToggle={
          isFavorite || isFavoriteAdded
            ? handleRemoveFromFavorite
            : handleAddToFavorite
        }
        showCartControls={!isFavorite}
        quantity={currentQuantity}
        isAvailable={item?.is_available !== false}
        onAddToCart={handleAddToCart}
        onIncrement={(e) => handleIncrement(e, item._id as string)}
        onDecrement={(e) => handleDecrement(e, item._id as string)}
      />

      {selectedItem && !isFavorite && (
        <ItemDetailsModal
          moduleName={moduleName}
          isOpen={!!selectedItem}
          onClose={() => setSelectedItem(null)}
          item={selectedItem}
        />
      )}

      {selectedItem && isFavorite && (
        <FavoriteItemDetailsModal
          moduleName={moduleName}
          isOpen={!!selectedItem}
          onClose={() => setSelectedItem(null)}
          item={selectedItem}
        />
      )}

      <CommonModal isOpen={isModalOpen} onClose={closeModal}>
        <LoginModalDetails
          onClose={closeModal}
          type="favourite"
          handleAddToFavorite={handleAddToFavorite}
        />
      </CommonModal>
    </>
  );
};

export default StoreItemTile;
