import { useFavourites } from "@/hooks/favourites/useFavourites";

type Entry = Record<string, unknown> & { _id?: unknown; mongodbId?: unknown };

// Favourite consultation centres (3) and doctors (4).
export const useFavouriteList = () => {
  const { visible, isSaved, save, remove } = useFavourites("list");

  return {
    visible,
    isAddedToFavouriteList: (id: unknown, merchantType: number) => isSaved(id, merchantType),
    /** `data` is the centre or the doctor (its `_id` is saved as mongodbId). */
    addToFavouriteList: (data: Entry, merchantType: number) =>
      save(
        merchantType,
        merchantType === 3
          ? {
              mongodbId: data?._id,
              center_name: data?.center_name,
              address: data?.address,
              medical_center_banner_app: data?.medical_center_banner_app,
            }
          : {
              mongodbId: data?._id,
              doctor_name: data?.doctor_name,
              qualifications: data?.qualifications,
              speciality: data?.speciality,
              gender: data?.gender,
              profile_pic: data?.profile_pic,
            },
      ),
    /** `data` is a saved favourite (it has mongodbId). */
    removeFromfavoriteList: (data: Entry, merchantType: number) =>
      remove(merchantType, { mongodbId: data?.mongodbId }),
  };
};
