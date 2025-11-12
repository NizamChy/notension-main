"use client";

import Head from "next/head";
import Link from "next/link";
import { useState } from "react";
import toast from "react-hot-toast";
import ProductInfo from "./ProductInfo";
import ImageGallery from "./ImageGallery";
import { useParams } from "next/navigation";
import ProductDetails from "./ProductDetails";
import { FaShoppingCart } from "react-icons/fa";
import { useCart } from "@/context/CartContext";
import StoreSection from "../store/StoreSection";
import CartDrawer from "../shared/Cart/CartDrawer";
import { PRODUCTS_BY_CATEGORY } from "@/utils/constants";

const ProductDetailsPage = () => {
  const [quantity, setQuantity] = useState(1);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);

  const params = useParams();
  const { addToCart } = useCart();

  const productSlug = params?.slug || null;

  const product = PRODUCTS_BY_CATEGORY?.find(
    (item) => item?.slug === productSlug
  );

  const toggleCart = () => {
    setIsCartOpen(!isCartOpen);
  };

  const handleQuantityChange = (action) => {
    if (action === "increase") {
      setQuantity((prev) => prev + 1);
    } else if (action === "decrease" && quantity > 1) {
      setQuantity((prev) => prev - 1);
    }
  };

  const handleAddToCart = () => {
    if (product?.sizes?.length > 0 && !selectedSize) {
      toast.dismiss();
      toast("Please select a size!", {
        icon: "ℹ️",
        style: {
          border: "1px solid #2C3E50",
          padding: "10px",
          color: "#2C3E50",
        },
        iconTheme: {
          primary: "#713200",
          secondary: "#FFFAEE",
        },
      });
      return;
    }

    if (product?.colors?.length > 0 && !selectedColor) {
      toast.dismiss();
      toast("Please select color!", {
        icon: "ℹ️",
        style: {
          border: "1px solid #2C3E50",
          padding: "10px",
          color: "#2C3E50",
        },
        iconTheme: {
          primary: "#713200",
          secondary: "#FFFAEE",
        },
      });
      return;
    }

    addToCart(product, quantity, selectedSize, selectedColor);

    toast.dismiss();
    toast.success(`${product.name} added to cart!`, {
      style: {
        border: "1px solid #2C3E50",
        padding: "10px",
        color: "#2C3E50",
      },
    });
    toggleCart();
  };

  return (
    <>
      <Head>
        <title>
          {product?.name} | {product?.brand} - Fashion Store
        </title>
        <meta name="description" content={product?.description} />
      </Head>

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          <div className="md:w-[42%]">
            <ImageGallery product={product} />
          </div>

          <div className="md:w-1/2">
            <ProductInfo product={product} />

            {product?.colors?.length > 0 && (
              <div className="my-6">
                <h3 className="text-lg font-semibold mb-2">Color</h3>
                <div className="flex gap-2">
                  {product?.colors?.map((color) => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`w-10 h-10 rounded-full border-2 ${
                        selectedColor === color
                          ? "border-indigo-500"
                          : "border-gray-200"
                      }`}
                      style={{ backgroundColor: color }}
                      aria-label={`Select ${color} color`}
                    />
                  ))}
                </div>
              </div>
            )}

            {product?.sizes?.length > 0 && (
              <div className="my-6">
                <h3 className="text-lg font-semibold mb-2">Size</h3>
                <div className="flex flex-wrap gap-2">
                  {product?.sizes?.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`px-4 py-2 border rounded-md ${
                        selectedSize === size
                          ? "bg-indigo-500 text-white border-indigo-500"
                          : "border-gray-300 hover:border-gray-400"
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
                <Link
                  href="https://www.sailor.clothing/page/Size-Guide"
                  target="_blank"
                  rel="noopener"
                  className="inline-block mt-2 text-sm text-indigo-600 hover:underline"
                >
                  Size Guide
                </Link>
              </div>
            )}

            <div className="my-6">
              <h3 className="text-lg font-semibold mb-2">Quantity</h3>
              <div className="flex items-center">
                <button
                  onClick={() => handleQuantityChange("decrease")}
                  className="px-3 py-1 border border-gray-300 rounded-l-md hover:bg-gray-100"
                >
                  -
                </button>
                <span className="px-4 py-1 border-t border-b border-gray-300">
                  {quantity}
                </span>
                <button
                  onClick={() => handleQuantityChange("increase")}
                  className="px-3 py-1 border border-gray-300 rounded-r-md hover:bg-gray-100"
                >
                  +
                </button>
              </div>
            </div>

            <div className="flex flex-col md:flex-row md:gap-4 mt-8">
              <button
                onClick={handleAddToCart}
                className="flex items-center justify-center flex-1 gap-2 bg-indigo-600 hover:bg-indigo-700 text-white py-3 px-6 rounded-md font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={!product?.inStock}
              >
                {product?.inStock ? (
                  <>
                    <FaShoppingCart /> Add to Cart
                  </>
                ) : (
                  "Out of Stock"
                )}
              </button>

              <Link
                href={`/visit/${product?.storeInfo?.store_id}`}
                className="mt-4 md:mt-0 flex-1 bg-primary hover:bg-primary/95
                text-white py-3 px-6 rounded-md font-medium transition-colors text-center"
              >
                Buy Now
              </Link>
            </div>

            <ProductDetails product={product} />
          </div>
        </div>
      </div>

      <StoreSection storeInfo={product?.storeInfo} />

      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  );
};

export default ProductDetailsPage;
