import {
  ALL_TYPE,
  ALL_BRAND,
  ALL_CATEGORY,
  KIDS_PRODUCT,
  ALL_SUB_CATEGORY,
} from "@/api-endpoints/api-endpoints";
import axios from "axios";
import { useState } from "react";
import { FASHION_BASE_URL } from "@/api-endpoints/secret";
import { generateNavItems } from "@/utils/generateNavItems";

export const useCategoryItems = () => {
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [allType, setAllType] = useState(null);
  const [navItems, setNavItems] = useState(null);
  const [allCategory, setAllCategory] = useState(null);
  const [allSubCategory, setAllSubCategory] = useState(null);

  const fetchData = async () => {
    try {
      if (navItems && brands.length) return;

      setLoading(true);

      const [typesRes, categoriesRes, subcategoriesRes, brandsRes] =
        await Promise.all([
          axios.get(`${FASHION_BASE_URL}${ALL_TYPE}`),
          axios.get(`${FASHION_BASE_URL}${ALL_CATEGORY}`),
          axios.get(`${FASHION_BASE_URL}${ALL_SUB_CATEGORY}`),
          axios.get(`${FASHION_BASE_URL}${ALL_BRAND}`),
        ]);

      const generatedNavItems = generateNavItems(
        typesRes.data.data,
        categoriesRes.data.data,
        subcategoriesRes.data.data
      );

      setNavItems(generatedNavItems);
      setBrands(brandsRes.data.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      setLoading(false);
    }
  };

  const fetchAllType = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${FASHION_BASE_URL}${ALL_TYPE}`);
      setAllType(response.data.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAllCategory = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${FASHION_BASE_URL}${ALL_CATEGORY}`);
      setAllCategory(response.data.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAllSubCategory = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${FASHION_BASE_URL}${ALL_SUB_CATEGORY}`
      );
      setAllSubCategory(response.data.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategoryById = async (typeId, setCategories) => {
    try {
      setLoading(true);
      const response = await axios.get(`${FASHION_BASE_URL}${ALL_CATEGORY}`);

      const filterCategory = response.data.data.filter(
        (cat) => cat.type_info === typeId
      );
      setCategories(filterCategory);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchSubCategoryById = async (catId, setSubCategories) => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${FASHION_BASE_URL}${ALL_SUB_CATEGORY}`
      );

      const filterSubCategory = response.data.data.filter(
        (sub) => sub.category_info === catId
      );

      setSubCategories(filterSubCategory);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchKidsProducts = async (setProductInfo) => {
    try {
      setLoading(true);
      const response = await axios.get(`${FASHION_BASE_URL}${KIDS_PRODUCT}`);

      setProductInfo(response.data.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchKidsProductById = async (productId, setProductInfo) => {
    try {
      setLoading(true);
      const response = await axios.get(`${FASHION_BASE_URL}${KIDS_PRODUCT}`);

      const findProductInfo = response.data.data.find(
        (product) => product?._id === productId
      );

      setProductInfo(findProductInfo);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  return {
    brands,
    loading,
    allType,
    navItems,
    fetchData,
    allCategory,
    fetchAllType,
    allSubCategory,
    fetchAllCategory,
    fetchKidsProducts,
    fetchCategoryById,
    fetchAllSubCategory,
    fetchSubCategoryById,
    fetchKidsProductById,
  };
};

// const { data: kidsProductsByType } = useKidsProductsByType(typeId);
// const { data: filteredKidsProducts, isLoading } = useKidsProductsByType(
//   typeId,
//   categoryId,
//   subCategoryId
// );
// const { data: allProducts, isLoading, error } = useAllProducts();
// const { data: product } = useProductById("some-product-id");

//  api info:
//  Api: `${BASE_URL}${KIDS_PRODUCT_BY_TYPE}${typeId}`
//  Method: PUT
//  body:
//  {
//     "category_info": catId,
//     "sub_category_info": subCatId,
//  }

// /api/v1/kids-product/product-info-by-type/6880c24c098c458993b32679 <----- type_id
// Method: PUT
// const data = {category_info:  'id', sub_category_info: 'id'}

// category_info="68820ba97f75c082fb074d0b"
// sub_category_info="68821e6d8014a4342934af8b"

// {
//     "_id": "68845e5435588ff42d0573ef",
//     "sub_category_name": "Panjabi & Pajama",
//     "sub_category_slug": null,
//     "type_info": "6880c24c098c458993b32679",
//     "category_info": "68820ba97f75c082fb074d0b",
//     "banner_type_1": "1753505362487-790208287.jpg",
//     "banner_type_2": "1753505362489-355982323.jpg",
//     "is_active": true,
//     "createdBy": "303030303030303030303030",
//     "updatedBy": "303030303030303030303030",
//     "createdAt": "2025-07-26T10:49:24.447Z",
//     "updatedAt": "2025-08-03T11:17:15.093Z",
//     "__v": 0
// }
