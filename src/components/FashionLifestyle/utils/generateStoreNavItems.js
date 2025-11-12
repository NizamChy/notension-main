export const generateStoreNavItems = (typeInfo, categories, subcategories) => {
  const navItemsArray = [];

  typeInfo.forEach((type) => {
    const { _id: typeId, type_name: typeName } = type?.type_info;

    const relatedCategories = categories
      ?.filter((cat) => cat?.type_info === typeId)
      .map((cat) => {
        const relatedSubcats = subcategories
          ?.filter(
            (sub) =>
              sub?.category_info === cat?.category_info?._id &&
              sub?.type_info === typeId
          )
          ?.map((sub) => ({
            id: sub?.sub_category_info?._id,
            name: sub?.sub_category_info?.sub_category_name,
            banner_type_1: sub?.sub_category_info?.banner_type_1,
            banner_type_2: sub?.sub_category_info?.banner_type_2,
          }));

        return {
          type_id: typeId,
          subcategories: relatedSubcats,
          category_id: cat?.category_info?._id,
          name: cat?.category_info?.category_name,
          category_img: cat?.category_info?.banner,
        };
      });

    const featuredItem =
      relatedCategories?.length > 0
        ? {
            title: relatedCategories[0]?.name,
            image: relatedCategories[0]?.category_img,
          }
        : null;

    navItemsArray.push({
      type_id: typeId,
      type_name: typeName,
      featured: featuredItem,
      categories: relatedCategories,
    });
  });

  return navItemsArray;
};
