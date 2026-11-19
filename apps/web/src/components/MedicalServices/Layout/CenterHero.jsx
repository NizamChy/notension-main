import Link from "next/link";
import Image from "next/image";
import DoctorCommonSlider from "../DoctorSection/DoctorCommonSlider/DoctorCommonSlider";

// Hero row for the center pages: banner slider on the left, "find nearest"
// promo on the right. Both cells are the same 2:1 box, so they always share
// top edge and height; they stack on mobile.
const CenterHero = ({ slider, href, image, alt, sliderNode = null }) => {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:gap-5">
      {sliderNode || <DoctorCommonSlider slider={slider} />}

      <Link
        href={href}
        aria-label={alt}
        className="group relative block aspect-[2/1] w-full overflow-hidden rounded-2xl border border-gray-200 bg-gray-100 shadow-sm shadow-gray-900/[0.03] transition duration-300 hover:shadow-lg hover:shadow-gray-900/5 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#EB5C2F]"
      >
        <Image
          src={image}
          alt={alt}
          fill
          sizes="(min-width: 1280px) 640px, (min-width: 768px) 50vw, 100vw"
          className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
        />
      </Link>
    </div>
  );
};

export default CenterHero;
