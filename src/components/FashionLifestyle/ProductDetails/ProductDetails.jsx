import React from "react";

const ProductDetails = ({ product }) => {
  return (
    <div className="mt-8 border-t pt-5">
      <div className="mb-4">
        <h3 className="text-lg font-semibold mb-2">Description</h3>
        <div
          className="text-gray-600 text-sm md:text-base"
          dangerouslySetInnerHTML={{ __html: product?.description }}
        />
      </div>
      <div>
        <h3 className="font-semibold mb-2">
          {product?.ingredients
            ? "Product Ingredients"
            : "Detailed Specification"}
        </h3>
        <div
          className="text-gray-600 text-sm md:text-base"
          dangerouslySetInnerHTML={{
            __html: product?.specification || product?.ingredients,
          }}
        />
      </div>

      {product?.size_chart && product?.size_chart !== "null" && (
        <div className="mt-5">
          <h3 className="font-semibold mb-2">Size Chart</h3>
          <div className="overflow-x-auto">
            <div
              className="text-gray-600 [&_table]:w-full [&_table]:border-collapse [&_th]:border [&_td]:border [&_th]:border-gray-300 [&_td]:border-gray-300 [&_th]:p-3 [&_td]:p-3 [&_th]:text-center [&_td]:text-center [&_th]:bg-gray-100 [&_th]:font-semibold"
              dangerouslySetInnerHTML={{ __html: product?.size_chart }}
            />
          </div>
        </div>
      )}

      {product?.use_directions && (
        <div className="mt-5">
          <h3 className="font-semibold mb-2">How To Use</h3>
          <div
            className="text-gray-600 text-sm md:text-base"
            dangerouslySetInnerHTML={{ __html: product?.use_directions }}
          />
        </div>
      )}
    </div>
  );
};

export default ProductDetails;
