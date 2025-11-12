import React from "react";
import Link from "next/link";
import Image from "next/image";

const CategoriesByStore = ({ storeInfo }) => {
  return (
    <>
      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">
            Shop by Category
          </h2>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {storeInfo?.categories?.map((category) => (
              <Link
                href={`/category/${category?.slug}`}
                className="cursor-pointer group"
                key={category?.slug}
              >
                <div className="relative">
                  <Image
                    src={category?.image}
                    alt={category?.name}
                    width={800}
                    height={600}
                    className="h-32 md:h-60 object-cover group-hover:opacity-90 rounded"
                  />

                  <p className="absolute bottom-2 md:bottom-5 py-2 rounded-sm inset-x-2 md:inset-x-5 text-center bg-black/50 md:text-xl font-medium text-white group-hover:text-white/80">
                    {category?.name}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default CategoriesByStore;
