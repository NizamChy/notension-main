"use client";

import Image from "next/image";
import React, { useState, useEffect } from "react";
import { FiMaximize2 } from "react-icons/fi";
import { FASHION_IMAGE_URL } from "@/api-endpoints/env";
import ImageLightbox from "./ImageLightbox";

const imageUrl = (img) =>
  img ? `${FASHION_IMAGE_URL}/${img}` : "/png/dummyImage.png";

const ImageGallery = ({ product, selectedImage }) => {
  // Hover zoom (mouse only): null, or the pointer position in % of the image.
  const [zoomAt, setZoomAt] = useState(null);
  const [lightboxOpen, setLightboxOpen] = useState(false);
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

  // Touch and pen get the full-screen viewer instead (tap), so the page can
  // still scroll over the image.
  const handleMove = (e) => {
    if (e.pointerType !== "mouse") return;
    const { left, top, width, height } =
      e.currentTarget.getBoundingClientRect();
    setZoomAt({
      x: Math.min(100, Math.max(0, ((e.clientX - left) / width) * 100)),
      y: Math.min(100, Math.max(0, ((e.clientY - top) / height) * 100)),
    });
  };

  const handleLeave = () => setZoomAt(null);

  const openLightbox = () => {
    setZoomAt(null);
    setLightboxOpen(true);
  };

  const salePrice = Number(product?.sale_price);
  const mrp = Number(product?.max_retail_price);
  const discount =
    mrp > 0 && salePrice < mrp ? Math.round((1 - salePrice / mrp) * 100) : 0;

  return (
    <div className="flex flex-col gap-3 lg:flex-row-reverse lg:gap-4">
      <div
        role="button"
        tabIndex={0}
        aria-label="Open image viewer"
        className="relative aspect-3/4 flex-1 cursor-zoom-in overflow-hidden rounded-2xl bg-gray-100 focus:outline-hidden focus-visible:ring-2 focus-visible:ring-[#0C3F8E]"
        onPointerMove={handleMove}
        onPointerLeave={handleLeave}
        onClick={openLightbox}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            openLightbox();
          }
        }}
      >
        <Image
          src={imageUrl(detailImages[currentImageIndex])}
          alt={product?.product_title_eng || "Product"}
          fill
          preload
          quality={90}
          sizes="(min-width: 1024px) 90vw, 100vw"
          className="object-cover transition-transform duration-200 ease-out"
          style={
            zoomAt
              ? {
                  transformOrigin: `${zoomAt.x}% ${zoomAt.y}%`,
                  transform: "scale(2.2)",
                }
              : undefined
          }
        />

        <span
          className={`pointer-events-none absolute bottom-3 left-3 flex items-center gap-1.5 rounded-full bg-black/55 px-2.5 py-1 text-xs font-medium text-[#FFFFFF] transition-opacity ${
            zoomAt ? "opacity-0" : "opacity-100"
          }`}
        >
          <FiMaximize2 aria-hidden />
          <span className="hidden sm:inline">Hover to zoom, click to expand</span>
          <span className="sm:hidden">Tap to zoom</span>
        </span>

        {discount > 0 && (
          <span className="absolute left-3 top-3 rounded-full bg-[#EB5C2F] px-2.5 py-1 text-xs font-semibold tabular-nums text-white shadow-xs">
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
          className="flex gap-2 overflow-x-auto pb-1 scrollbar-none lg:max-h-[640px] lg:w-20 lg:flex-col lg:overflow-y-auto lg:overflow-x-visible lg:pb-0 [&::-webkit-scrollbar]:hidden"
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
                className={`relative aspect-3/4 w-16 shrink-0 overflow-hidden rounded-xl border-2 bg-gray-100 transition-colors lg:w-full ${
                  active
                    ? "border-primary dark:border-[#7FB2FF]"
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

      {lightboxOpen && (
        <ImageLightbox
          images={detailImages.map(imageUrl)}
          index={currentImageIndex}
          onIndexChange={setCurrentImageIndex}
          onClose={() => setLightboxOpen(false)}
          alt={product?.product_title_eng || "Product"}
        />
      )}
    </div>
  );
};

export default ImageGallery;
