"use client";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

const SelectedCategory = () => {
  const [catId, setCatId] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(null);

  const shopCategory = useSelector((state) => state.dashboard.shopCategory);

  useEffect(() => {
    const currentUrl = new URL(window.location.href);
    const pathSegments = currentUrl.pathname.split("/");
    const categoryId = pathSegments.find((segment) =>
      /^[a-f0-9]{24}$/.test(segment)
    );

    console.log("currentUrl:", currentUrl.href);
    console.log("categoryId:", categoryId);

    setCatId(categoryId);
  }, []);

  useEffect(() => {
    if (catId && shopCategory) {
      const category = shopCategory?.find((item) => item._id === catId);
      setSelectedCategory(category);
    }
  }, [catId, shopCategory]);

  console.log(shopCategory);
  console.log("selectedCategory:", selectedCategory);

  return (
    <>
      {selectedCategory?.store_category_name && (
        <p className="text-center py-3 text-xl text-primary bg-[#FFF1EA]">
          {selectedCategory?.store_category_name}
        </p>
      )}
    </>
  );
};

export default SelectedCategory;
