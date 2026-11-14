"use client";

import Head from "next/head";
import Link from "next/link";
import Image from "next/image";
import toast from "react-hot-toast";
import ProductInfo from "./ProductInfo";
import { FiHeart } from "react-icons/fi";
import ImageGallery from "./ImageGallery";
import { useEffect, useState } from "react";
import { slugify } from "../utils/slugify";
import ProductDetails from "./ProductDetails";
import { useParams, usePathname, useRouter } from "next/navigation";
import { useCategoryItem } from "../hooks/fetchData/useCategoryItem";
import { HiCheck, HiMinus, HiPlus } from "react-icons/hi";
import { HiOutlineMapPin, HiOutlineShoppingBag } from "react-icons/hi2";
import { useCart } from "../context/CartContext";
import CartDrawer from "../shared/Cart/CartDrawer";
import { useDispatch, useSelector } from "react-redux";
import { FASHION_IMAGE_URL } from "@/api-endpoints/env";
import { handleUserChoiceReducer } from "@/redux/userChoiceReducer";
import { FASHION_CONTAINER } from "../shared/FashionSection";
import {
  CARD,
  EmptyState,
  PRIMARY_BUTTON,
  SECONDARY_BUTTON,
  Skeleton,
} from "@/components/shared/UI/UI";

const OptionLabel = ({ title, value }) => (
  <p className="mb-2.5 text-sm font-semibold text-gray-900">
    {title}
    {value && <span className="ml-1.5 font-normal text-gray-500">{value}</span>}
  </p>
);

const DetailSkeleton = () => (
  <div className={`${FASHION_CONTAINER} py-6 md:py-10`} aria-hidden>
    <div className="grid gap-6 md:grid-cols-2 lg:gap-12">
      <Skeleton className="aspect-[3/4] !rounded-2xl" />
      <div className="space-y-4">
        <Skeleton className="h-3 w-24 !rounded-full" />
        <Skeleton className="h-8 w-3/4 !rounded-full" />
        <Skeleton className="h-7 w-40 !rounded-full" />
        <Skeleton className="mt-8 h-11 w-2/3 !rounded-full" />
        <Skeleton className="h-12 w-full !rounded-full" />
      </div>
    </div>
  </div>
);

const ProductDetailSection = () => {
  const [quantity, setQuantity] = useState(1);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [selectedSize, setSelectedSize] = useState(null);

  const pathname = usePathname();
  const router = useRouter();
  const params = useParams();
  const { addToCart } = useCart();
  const { useProductById } = useCategoryItem();

  const dispatch = useDispatch();

  // The slug is "<title-slug>_<productId>".
  const productId = params?.slugId?.split("_").pop() || null;

  // Redux has the product when it was opened from a list. A direct link (or
  // a reload with cleared state) fetches it by id instead.
  const { currentProductDetails } = useSelector((state) => state.product);
  const hasReduxProduct =
    !!productId && currentProductDetails?._id === productId;
  const { data: fetchedProduct, isLoading: isFetching } = useProductById(
    hasReduxProduct ? null : productId
  );
  const product = hasReduxProduct ? currentProductDetails : fetchedProduct;
  const colorsArray = product?.colors?.split(",");
  const sizesArray = product?.sizes?.split(",");

  const [selectedImage, setSelectedImage] = useState(
    product?.images_by_color?.[0] || product?.web_image
  );

  // A fetched product arrives after the first render.
  useEffect(() => {
    setSelectedImage(product?.images_by_color?.[0] || product?.web_image);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [product?._id]);

  const favouriteFashionItems = useSelector(
    (state) => state.userChoice.favouriteFashionItems
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

  const hasSizes =
    product?.sizes !== "null" &&
    product?.sizes !== "" &&
    product?.sizes !== "undefined" &&
    sizesArray?.length > 0;

  // Buy Now = same validation + add to cart, then straight to checkout
  // instead of opening the cart drawer.
  const handleAddToCart = ({ buyNow = false } = {}) => {
    if (hasSizes && !selectedSize) {
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

    addToCart(product, quantity, selectedSize, selectedImage);

    if (buyNow) {
      toast.dismiss();
      router.push("/fashion-lifestyle/checkout");
      return;
    }

    toast.dismiss();
    toast.success(`${product?.product_title_eng} added to cart!`, {
      style: {
        border: "1px solid #2C3E50",
        padding: "10px",
        color: "#2C3E50",
      },
    });
    toggleCart();
  };

  const toggleWishlist = (e, productId, product) => {
    e.preventDefault();

    if (favouriteFashionItems?.find((product) => product?._id === productId)) {
      removeFromReducer({
        productId: productId,
      });
    } else {
      addToReducer({
        itemInfo: [product],
      });
    }
  };

  const addToReducer = (itemInfo) => {
    dispatch(
      handleUserChoiceReducer({
        type: "ADD_TO_FAVOURITE_FASHION_ITEMS",
        data: itemInfo,
      })
    );
    toast.dismiss();
    toast.success("💖 পণ্যটি আপনার ফেভারিট লিস্টের অন্তর্ভূক্ত করা হল!", {
      style: {
        border: "1px solid #FC8F1E",
      },
      iconTheme: {
        primary: "#FC8F1E",
        secondary: "#FFFAEE",
      },
    });
  };

  const removeFromReducer = (Info) => {
    dispatch(
      handleUserChoiceReducer({
        type: "REMOVE_FROM_FAVOURITE_FASHION_ITEMS",
        data: Info,
      })
    );
    toast.dismiss();
    toast("পণ্যটি আপনার ফেভারিট লিস্ট থেকে বাদ দেওয়া হল!", {
      style: {
        border: "1px solid #FC8F1E",
      },
      icon: "🗑️",
      iconTheme: {
        primary: "#FC8F1E",
        secondary: "#FFFAEE",
      },
    });
  };

  if (!product && isFetching) return <DetailSkeleton />;

  if (!product?._id) {
    return (
      <div className={`${FASHION_CONTAINER} min-h-content py-10 md:py-16`}>
        <EmptyState
          icon={<HiOutlineShoppingBag />}
          title="Product not found"
          text="It may have been removed or the link is incorrect."
          action={
            <Link href="/fashion-lifestyle" className={PRIMARY_BUTTON}>
              Continue shopping
            </Link>
          }
        />
      </div>
    );
  }

  const isFavourite = !!favouriteFashionItems?.find(
    (item) => item?._id === product?._id
  );
  const variants = product?.images_by_color || [];
  const variantIndex = variants.indexOf(selectedImage);
  const variantName =
    variantIndex !== -1 && colorsArray?.length === variants.length
      ? colorsArray[variantIndex]?.trim()
      : null;
  const store = product?.store_info;

  return (
    <>
      <Head>
        <title>
          {product?.name} | {product?.brand} - Fashion Store
        </title>
        <meta name="description" content={product?.description} />
      </Head>

      <div className={`${FASHION_CONTAINER} py-4 md:py-10`}>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] lg:gap-12">
          <div className="md:sticky md:top-28 md:self-start">
            <ImageGallery product={product} selectedImage={selectedImage} />
          </div>

          <div className="min-w-0">
            <ProductInfo product={product} />

            <div className="mt-6 space-y-6 border-t border-gray-200 pt-6">
              {/* Colour variants */}
              {variants.length > 0 && (
                <div>
                  <OptionLabel title="Colour" value={variantName} />

                  <div className="flex flex-wrap gap-2.5">
                    {variants.map((img, index) => {
                      const active = selectedImage === img;
                      const name = colorsArray?.[index]?.trim();
                      return (
                        <button
                          key={index}
                          type="button"
                          onClick={() => setSelectedImage(img)}
                          aria-pressed={active}
                          aria-label={
                            name ? `Colour ${name}` : `Variant ${index + 1}`
                          }
                          className={`relative h-[72px] w-14 overflow-hidden rounded-xl border-2 bg-gray-100 transition-colors ${
                            active
                              ? "border-[#0C3F8E] dark:border-[#7FB2FF]"
                              : "border-gray-200 hover:border-gray-400"
                          }`}
                        >
                          <Image
                            src={`${FASHION_IMAGE_URL}/${img}`}
                            alt=""
                            fill
                            sizes="56px"
                            className="object-cover"
                          />
                          {active && (
                            <span className="absolute bottom-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#0C3F8E] text-[10px] text-white">
                              <HiCheck />
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Sizes */}
              {hasSizes && (
                <div>
                  <OptionLabel
                    title="Size"
                    value={selectedSize || "Select a size"}
                  />
                  <div className="flex flex-wrap gap-2">
                    {sizesArray?.map((size) => {
                      const active = selectedSize === size;
                      return (
                        <button
                          key={size}
                          type="button"
                          onClick={() => setSelectedSize(size)}
                          aria-pressed={active}
                          className={`h-11 min-w-12 rounded-full border px-4 text-sm font-medium transition-colors ${
                            active
                              ? "border-[#0C3F8E] bg-[#0C3F8E] text-white"
                              : "border-gray-200 text-gray-800 hover:border-gray-400"
                          }`}
                        >
                          {size}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Quantity */}
              <div>
                <OptionLabel title="Quantity" />
                <div className="inline-flex h-11 items-center rounded-full border border-gray-200">
                  <button
                    type="button"
                    aria-label="Decrease quantity"
                    disabled={quantity <= 1}
                    onClick={() => handleQuantityChange("decrease")}
                    className="flex h-11 w-11 items-center justify-center rounded-full text-gray-700 transition-colors hover:bg-gray-100 disabled:cursor-not-allowed disabled:text-gray-300 disabled:hover:bg-transparent"
                  >
                    <HiMinus />
                  </button>
                  <span
                    aria-live="polite"
                    className="min-w-10 text-center text-sm font-semibold tabular-nums text-gray-900"
                  >
                    {quantity}
                  </span>
                  <button
                    type="button"
                    aria-label="Increase quantity"
                    onClick={() => handleQuantityChange("increase")}
                    className="flex h-11 w-11 items-center justify-center rounded-full text-gray-700 transition-colors hover:bg-gray-100"
                  >
                    <HiPlus />
                  </button>
                </div>
              </div>
            </div>

            {/* Actions: sticky at the bottom of the screen on mobile */}
            <div className="z-10 mt-6 flex gap-2 max-md:sticky max-md:bottom-0 max-md:-mx-4 max-md:border-t max-md:border-gray-200 max-md:bg-white max-md:px-4 max-md:py-3 sm:gap-3">
              <button
                type="button"
                onClick={() => handleAddToCart()}
                className={`${PRIMARY_BUTTON} h-12 flex-1 !px-3 sm:!px-5`}
              >
                <HiOutlineShoppingBag className="text-lg" />
                Add to bag
              </button>

              <button
                type="button"
                onClick={() => handleAddToCart({ buyNow: true })}
                className="inline-flex h-12 flex-1 items-center justify-center rounded-full bg-[#EB5C2F] px-3 text-sm sm:px-5 font-semibold text-white shadow-sm shadow-[#EB5C2F]/20 transition-colors hover:bg-[#D9481C]"
              >
                Buy now
              </button>

              <button
                type="button"
                onClick={(e) => toggleWishlist(e, product?._id, product)}
                aria-pressed={isFavourite}
                aria-label={
                  isFavourite ? "Remove from wishlist" : "Add to wishlist"
                }
                className={`${SECONDARY_BUTTON} h-12 w-12 shrink-0 !px-0 ${
                  isFavourite ? "text-[#D92D20]" : ""
                }`}
              >
                <FiHeart
                  className={`text-lg ${isFavourite ? "fill-current" : ""}`}
                />
              </button>
            </div>

            {/* Sold by */}
            {!pathname?.includes("shop") && store?._id && (
              <div className={`${CARD} mt-6 flex items-center gap-3 p-4`}>
                <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-full border border-gray-200 bg-gray-100">
                  <Image
                    src={
                      store?.shop_logo || store?.shop_banner_app
                        ? `${FASHION_IMAGE_URL}/${
                            store?.shop_logo || store?.shop_banner_app
                          }`
                        : "/png/dummyImage.png"
                    }
                    alt=""
                    fill
                    sizes="48px"
                    className="object-cover"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs text-gray-500">Sold by</p>
                  <p className="truncate text-sm font-semibold text-gray-900">
                    {store?.shop_name}
                  </p>
                  {store?.shop_address && (
                    <p className="mt-0.5 flex items-center gap-1 truncate text-xs text-gray-500">
                      <HiOutlineMapPin className="shrink-0" />
                      <span className="truncate">{store.shop_address}</span>
                    </p>
                  )}
                </div>
                <Link
                  href={`/fashion-lifestyle/shop/${slugify(store?.shop_name)}_${
                    store?._id
                  }`}
                  className={`${SECONDARY_BUTTON} h-10 shrink-0 !px-4`}
                >
                  Visit store
                </Link>
              </div>
            )}

            <ProductDetails product={product} />
          </div>
        </div>
      </div>

      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  );
};

export default ProductDetailSection;
