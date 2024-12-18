import { FaLocationDot } from "react-icons/fa6";
import Image from "next/image";
import { IMAGE_URL } from "@/api-endpoints/secret";

const ShopInfoCard = ({ shop, type }) => {
  return (
    <div className="group card bg-white shadow-md cursor-pointer rounded-lg mb-4 hover:shadow-lg transition-shadow duration-300">
      <div className="relative overflow-hidden  rounded-t-lg">
        <Image
          src={`${IMAGE_URL}/${type}-store-docs/${shop?.shop_banner_app}`}
          alt={`${shop?.shop_name} banner`}
          width={500}
          height={300}
          className="w-full h-60 object-cover rounded-t-lg transition-transform duration-300 group-hover:scale-105"
        />

        <p className="bg-yellow-300 absolute bottom-3 left-3 rounded-lg px-2 py-0.5 text-sm font-semibold">
          {shop?.delivery_notice}
        </p>
      </div>

      <div className="p-4">
        <h2 className="text-xl font-semibold mb-2">{shop?.shop_name}</h2>
        <p className="text-gray-700 mb-2 flex gap-1">
          <span className="text-blue-600 mt-1">
            <FaLocationDot />
          </span>
          {shop?.shop_address}
        </p>

        {shop?.distance && (
          <p className="text-gray-500 ps-4">
            Distance: {(shop?.distance / 1000).toFixed(2)} km
          </p>
        )}
      </div>
    </div>
  );
};

export default ShopInfoCard;
