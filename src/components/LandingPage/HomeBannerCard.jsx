import React from "react";
import Image from "next/image";

/**
 * Shared banner tile for the landing page so every tile uses the same
 * overlay position, typography and hover behaviour.
 */
const HomeBannerCard = ({
  image,
  alt,
  width,
  height,
  title,
  actionText,
  ActionIcon,
  onClick,
  position = "bottom",
  size = "lg",
  fill = false,
  className = "",
  priority = false,
}) => {
  const titleSize =
    size === "sm"
      ? "text-sm sm:text-base md:text-xl xl:text-2xl"
      : "text-base md:text-2xl";

  return (
    <div
      onClick={onClick}
      className={`group relative overflow-hidden rounded-lg cursor-pointer bg-gray-50 ${className}`}
    >
      <Image
        width={width}
        height={height}
        priority={priority}
        className={`w-full transition-[transform,filter] duration-300 group-hover:scale-105 dark:brightness-[0.8] dark:group-hover:brightness-90 ${
          fill ? "h-full object-cover" : "h-auto"
        }`}
        src={image}
        alt={alt || title}
      />

      <div
        className={`absolute left-3 right-3 sm:left-4 md:left-8 md:right-6 ${
          position === "top"
            ? "top-3 sm:top-4 md:top-8"
            : "bottom-3 sm:bottom-4 md:bottom-8"
        }`}
      >
        {/* The banners are light photos in both themes, so the text stays
            dark gray in dark mode too (gray-500 would turn light). */}
        <h3
          className={`${titleSize} font-semibold leading-tight tracking-wide xl:tracking-widest text-gray-500 dark:text-[#4b5563]`}
        >
          {title}
        </h3>
        {actionText && (
          <p className="mt-0.5 md:mt-1 flex items-center gap-1.5 text-xs md:text-base tracking-wider font-semibold text-gray-500 dark:text-[#4b5563]">
            {ActionIcon && (
              <ActionIcon className="shrink-0 text-xs md:text-base text-mediumGray dark:text-[#4b5563]" />
            )}
            <span>{actionText}</span>
          </p>
        )}
      </div>
    </div>
  );
};

export default HomeBannerCard;
