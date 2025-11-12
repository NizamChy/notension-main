import React from "react";

const ProductDetails = ({ product }) => {
  return (
    <div className="mt-8 border-t pt-5">
      <div className="mb-4">
        <h3 className="text-lg font-semibold mb-2">Description</h3>
        <p className="text-gray-600">{product?.description}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h3 className="font-semibold mb-2">Materials</h3>
          <p className="text-gray-600">{product?.materials}</p>
        </div>
        <div>
          <h3 className="font-semibold mb-2">Care Instructions</h3>
          <p className="text-gray-600">{product?.care}</p>
        </div>
        <div>
          <h3 className="font-semibold mb-2">Shipping & Returns</h3>
          <p className="text-gray-600">{product?.shipping}</p>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
