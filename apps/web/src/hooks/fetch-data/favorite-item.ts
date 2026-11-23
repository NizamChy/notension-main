import { useFavourites } from "@/hooks/favourites/useFavourites";

type Item = Record<string, unknown> | null | undefined;

// Favourite grocery (0) and medicine (1) items. The store argument is kept for
// the callers' sake; favourites are not per store.
export const useFavouriteItem = (_storeRef?: unknown) => {
  void _storeRef;
  const { visible, isSaved, save, remove } = useFavourites("item");

  return {
    visible,
    isAddedToFavouriteItems: (productId: unknown, merchantType: number) => isSaved(productId, merchantType),
    /** `data` is the store item; grocery saves its productInfoTable, medicine its medStoreProductInfo. */
    addToFavouriteItems: (data: Item, merchantType: number) =>
      save(
        merchantType,
        merchantType === 0
          ? {
              productId: data?.productInfoTable,
              product_title_eng: data?.product_title_eng,
              product_title_beng: data?.product_title_beng,
              pack_size: data?.pack_size,
              app_image: data?.app_image,
            }
          : {
              productId: data?.medStoreProductInfo,
              item_title_eng: data?.item_title_eng,
              strength: data?.strength,
              pack_size: data?.pack_size,
              app_image: data?.app_image,
            },
      ),
    /** `data` carries the productId to remove. */
    removeFromfavoriteItems: (data: Item, merchantType: number) => remove(merchantType, data ?? {}),
  };
};
