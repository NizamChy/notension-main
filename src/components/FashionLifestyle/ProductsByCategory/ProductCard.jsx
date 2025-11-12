import Link from "next/link";

const ProductCard = ({ product }) => {
  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      <Link href={`/product/${product?.slug}`}>
        <div className="block">
          <div className="aspect-square bg-gray-100 relative">
            <img
              src={product?.image}
              alt={product?.name}
              className="w-full h-full object-cover"
            />
            {!product?.inStock && (
              <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                <span className="text-white font-medium">Out of Stock</span>
              </div>
            )}
          </div>
          <div className="p-4">
            <h3 className="font-medium text-gray-900 mb-1">{product?.name}</h3>
            <p className="text-gray-600 text-sm mb-2">{product?.brand}</p>
            <div className="flex justify-between items-center">
              <span className="font-medium">৳{product?.price?.toFixed(2)}</span>
              {product?.originalPrice && (
                <span className="text-sm text-gray-500 line-through">
                  ৳{product?.originalPrice?.toFixed(2)}
                </span>
              )}
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default ProductCard;
