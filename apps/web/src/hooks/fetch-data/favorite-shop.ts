import { useFavourites } from "@/hooks/favourites/useFavourites";

type Shop = Record<string, unknown> & { _id?: unknown; storeId?: unknown };

// Favourite grocery (0), medicine (1) and food (2) stores.
export const useFavouriteStore = () => {
  const { visible, isSaved, save, remove } = useFavourites("store");

  const snapshot = (storeId: unknown, data: Shop) => ({
    storeId,
    custom_store_id: data.custom_store_id,
    shop_name: data.shop_name,
    shop_address: data.shop_address,
    shop_banner_app: data.shop_banner_app,
    contact_no: data.contact_no,
    alternative_contact_no: data.alternative_contact_no,
  });

  return {
    visible,
    isAddedToFavouriteList: (storeId: unknown, merchantType: number) => isSaved(storeId, merchantType),
    /** `data` is the store (its `_id` is saved as storeId). */
    addToFavouriteList: (data: Shop, merchantType: number) => {
      if (data?.custom_store_id === "") return Promise.resolve();
      return save(merchantType, snapshot(data._id, data));
    },
    /** `data` is a saved favourite (it has storeId). */
    removeFromfavoriteList: (data: Shop, merchantType: number) =>
      remove(merchantType, snapshot(data.storeId, data)),
  };
};
