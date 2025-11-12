import React from "react";
import Link from "next/link";
import { PRODUCTS_BY_CATEGORY } from "@/utils/constants";

const ProductsByStore = ({ storeInfo }) => {
  const productsByStore = PRODUCTS_BY_CATEGORY?.filter(
    (product) => product?.storeInfo?.store_id === storeInfo?.store_id
  );

  return (
    <div>
      <div className="max-w-7xl mx-auto p-3">
        <div className="md:flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900">
            Featured Products
          </h2>
          <Link
            href="/category/products"
            className="text-primary hover:text-primary/80 font-medium"
          >
            View all products →
          </Link>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-10">
          {productsByStore?.map((product) => (
            <div key={product.id}>
              <Link href={`/product/${product.slug}`}>
                <div className="max-h-[390px] group relative bg-white rounded-md overflow-hidden my-2 shadow-md hover:shadow-xl transition-all duration-300 h-full flex flex-col">
                  <div className="aspect-square bg-gray-100 overflow-hidden">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
                      loading="lazy"
                    />
                  </div>
                  <div className="p-4 flex-grow flex flex-col">
                    <h3 className="lg:text-lg font-medium text-gray-900 mb-1 line-clamp-1">
                      {product.name}
                    </h3>
                    <p className="text-sm text-gray-500 mb-2">
                      {product.category}
                    </p>
                    <div className="mt-auto flex justify-between items-center">
                      <p className="text-sm md:text-lg font-semibold text-gray-900">
                        ৳{product.price}
                      </p>
                      {product.originalPrice && (
                        <p className="text-xs md:text-sm text-gray-500 line-through">
                          ৳{product.originalPrice}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductsByStore;
