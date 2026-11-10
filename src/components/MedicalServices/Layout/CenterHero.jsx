import Link from "next/link";
import Image from "next/image";
import DoctorCommonSlider from "../DoctorSection/DoctorCommonSlider/DoctorCommonSlider";

// Hero row for the center pages: banner slider on the left, "find nearest"
// promo on the right. Both cells are the same 2:1 box, so they always share
// top edge and height; they stack on mobile.
const CenterHero = ({ slider, href, image, alt, sliderNode = null }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
      {sliderNode || <DoctorCommonSlider slider={slider} />}

      <Link
        href={href}
        className="group relative block w-full aspect-[2/1] rounded-xl overflow-hidden bg-gray-100 shadow-sm hover:shadow-md transition-shadow"
      >
        <Image
          src={image}
          alt={alt}
          fill
          sizes="(min-width: 1280px) 640px, (min-width: 768px) 50vw, 100vw"
          className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
        />
      </Link>
    </div>
  );
};

export default CenterHero;
