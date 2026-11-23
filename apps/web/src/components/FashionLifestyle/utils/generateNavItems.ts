import type {
  FashionCategory,
  FashionSubCategory,
  FashionType,
} from "@/lib/api/fashion";

export type NavSubCategory = {
  id: string;
  name: string;
  banner_type_1: string | null;
  banner_type_2: string | null;
};

export type NavCategory = {
  type_id: string;
  category_id: string;
  name: string;
  category_img: string | null;
  subcategories: NavSubCategory[];
};

/** One fashion type with its categories, as the navbar and sidebars show it. */
export type NavItem = {
  type_id: string;
  type_name: string;
  featured: { title: string; image: string | null } | null;
  categories: NavCategory[];
};

export const generateNavItems = (
  typeInfo: FashionType[],
  categories: FashionCategory[],
  subcategories: FashionSubCategory[]
): NavItem[] => {
  const navItemsArray: NavItem[] = [];

  typeInfo.forEach((type) => {
    const { _id: typeId, type_name: typeName } = type;

    const relatedCategories = categories
      ?.filter((cat) => cat?.type_info === typeId)
      .map((cat) => {
        const relatedSubcats = subcategories
          ?.filter(
            (sub) =>
              sub?.category_info?._id === cat?._id && sub?.type_info === typeId
          )
          ?.map((sub) => ({
            id: sub?._id,
            name: sub?.sub_category_name,
            banner_type_1: sub?.banner_type_1,
            banner_type_2: sub?.banner_type_2,
          }));

        return {
          type_id: typeId,
          category_id: cat?._id,
          name: cat?.category_name,
          category_img: cat?.banner,
          subcategories: relatedSubcats,
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
