"use client";

import { useSelector } from "react-redux";
import React, { useEffect, useState } from "react";

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

    setCatId(categoryId);
  }, []);

  useEffect(() => {
    if (catId && shopCategory) {
      const category = shopCategory?.find((item) => item._id === catId);
      setSelectedCategory(category);
    }
  }, [catId, shopCategory]);

  return (
    <>
      {selectedCategory?.store_category_name && (
        <p className="text-center py-3 text-xl text-primaryFood bg-[#FFF1EA] my-2">
          {selectedCategory?.store_category_name}
        </p>
      )}
    </>
  );
};

export default SelectedCategory;
