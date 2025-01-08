import React, { useEffect } from "react";
import CommonModal from "@/components/shared/CommonModal/CommonModal";
import { useFavouriteItem } from "@/hooks/fetch-data/favorite-item";
import Image from "next/image";
import { MEDICINE_ITEMS_IMAGES } from "@/api-endpoints/api-endpoint";
import { TbCurrencyTaka } from "react-icons/tb";

const FavoriteItemsDetailsModal = ({ isOpen, onClose, item }) => {
  const { getMedicineProductDetails } = useFavouriteItem();

  useEffect(() => {
    getMedicineProductDetails(item?.medStoreProductInfo);
  }, [item]);

  return (
    <CommonModal
      isOpen={isOpen}
      onClose={onClose}
      className="max-w-screen-md m-4"
    >
      <div className="space-y-3">
        <h2 className="text-xl font-bold mb-4 text-secondary">
          Product Details
        </h2>

        <div className="md:flex">
          <div className=" md:w-1/3">
            <Image
              src={
                item?.app_image
                  ? `${MEDICINE_ITEMS_IMAGES}/${item.app_image}`
                  : "/png/dummyImage.png"
              }
              alt={item?.item_title_eng || "Product image"}
              width={500}
              height={500}
              className="w-full md:w-64"
            />
          </div>

          <div className="space-y-1 md:w-2/3 p-4">
            <div className="flex justify-between">
              <h5 className="text-sm md:text-xl font-semibold text-deepGray line-clamp-2 overflow-hidden">
                {item?.item_title_eng}
              </h5>

              <p className="text-sm text-mediumGray">{item?.strength}</p>
            </div>
            <p className="text-base text-secondaryMedicine">
              {item?.generic_name}
            </p>
            <p className="text-base text-secondary">{item?.company_name}</p>
            <p className="text-base text-deepGray font-medium">
              {item?.pack_size}
            </p>

            <p className="text-sm md:text-lg font-medium flex items-center text-primaryMedicine">
              <TbCurrencyTaka className="md:text-2xl" />
              {item?.sale_price}
            </p>
          </div>
        </div>
      </div>
    </CommonModal>
  );
};

export default FavoriteItemsDetailsModal;
