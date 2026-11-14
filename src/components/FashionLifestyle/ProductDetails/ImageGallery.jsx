"use client";

import Image from "next/image";
import React, { useState, useEffect } from "react";
import { FASHION_IMAGE_URL } from "@/api-endpoints/env";

const imageUrl = (img) =>
  img ? `${FASHION_IMAGE_URL}/${img}` : "/png/dummyImage.png";

const ImageGallery = ({ product, selectedImage }) => {
  const [zoomStyle, setZoomStyle] = useState({});
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Unique, non-empty images only (a missing variant image used to show up
  // as a blank thumbnail).
  const detailImages = [
    ...new Set(
      [
        product?.web_image,
        selectedImage,
        ...(product?.detail_product_image || []),
      ].filter(Boolean),
    ),
  ];

  // Sync parent selectedImage with gallery
  useEffect(() => {
    if (selectedImage) {
      const index = detailImages.indexOf(selectedImage);
      if (index !== -1) setCurrentImageIndex(index);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedImage]);

  const handleMove = (e) => {
    const target = e.currentTarget;
    const { left, top, width, height } = target.getBoundingClientRect();

    let clientX, clientY;
    if (e.touches) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }

    const x = ((clientX - left) / width) * 100;
    const y = ((clientY - top) / height) * 100;

    setZoomStyle({
      transformOrigin: `${x}% ${y}%`,
      transform: "scale(2)",
    });
  };

  const handleLeave = () => {
    setZoomStyle({});
  };

  const salePrice = Number(product?.sale_price);
  const mrp = Number(product?.max_retail_price);
  const discount =
    mrp > 0 && salePrice < mrp ? Math.round((1 - salePrice / mrp) * 100) : 0;

  return (
    <div className="flex flex-col gap-3 lg:flex-row-reverse lg:gap-4">
      <div
        className="relative aspect-[3/4] flex-1 cursor-zoom-in overflow-hidden rounded-2xl bg-gray-100"
        onMouseMove={handleMove}
        onMouseLeave={handleLeave}
        onTouchMove={handleMove}
        onTouchEnd={handleLeave}
        onTouchCancel={handleLeave}
      >
        <Image
          src={imageUrl(detailImages[currentImageIndex])}
          alt={product?.product_title_eng || "Product"}
          fill
          priority
          sizes="(min-width: 1024px) 45vw, (min-width: 768px) 50vw, 100vw"
          className="touch-none object-cover transition-transform duration-500"
          style={zoomStyle}
        />

        {discount > 0 && (
          <span className="absolute left-3 top-3 rounded-full bg-[#EB5C2F] px-2.5 py-1 text-xs font-semibold tabular-nums text-white shadow-sm">
            -{discount}%
          </span>
        )}

        {detailImages.length > 1 && (
          <span className="absolute bottom-3 right-3 rounded-full bg-black/55 px-2.5 py-1 text-xs font-medium tabular-nums text-[#FFFFFF] lg:hidden">
            {currentImageIndex + 1} / {detailImages.length}
          </span>
        )}
      </div>

      {/* Thumbnails: a row on mobile, a column beside the image on desktop */}
      {detailImages.length > 1 && (
        <div
          role="tablist"
          aria-label="Product images"
          className="flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] lg:max-h-[640px] lg:w-20 lg:flex-col lg:overflow-y-auto lg:overflow-x-visible lg:pb-0 [&::-webkit-scrollbar]:hidden"
        >
          {detailImages.map((img, index) => {
            const active = currentImageIndex === index;
            return (
              <button
                key={img}
                type="button"
                role="tab"
                aria-selected={active}
                aria-label={`Show image ${index + 1}`}
                onClick={() => setCurrentImageIndex(index)}
                className={`relative aspect-[3/4] w-16 shrink-0 overflow-hidden rounded-xl border-2 bg-gray-100 transition-colors lg:w-full ${
                  active
                    ? "border-[#0C3F8E] dark:border-[#7FB2FF]"
                    : "border-transparent hover:border-gray-300"
                }`}
              >
                <Image
                  src={imageUrl(img)}
                  alt=""
                  fill
                  sizes="80px"
                  className="object-cover"
                />
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ImageGallery;
