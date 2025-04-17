import Link from "next/link";
import Image from "next/image";
import { IoIosHome } from "react-icons/io";

const NotFoundPage = () => {
  return (
    <div className="flex justify-center items-center min-h-screen p-4">
      <div className="relative w-full max-w-[618px]">
        <Image
          src="/png/not-found-page.png"
          width={618}
          height={618}
          alt="not found page"
          className="w-full rounded-lg"
          priority
        />

        <div className="absolute bottom-6 md:bottom-12 lg:bottom-32 left-1/2 transform -translate-x-1/2 w-full px-4 flex justify-center">
          <Link href="/" className="w-full max-w-40">
            <button className="relative outline-none inline-flex items-center justify-start py-3 pl-4 pr-12 overflow-hidden font-semibold text-primary transition-all duration-150 ease-in-out rounded hover:pl-10 hover:pr-6 bg-gray-50 group w-full">
              <span className="absolute bottom-0 left-0 w-full h-1 transition-all duration-150 ease-in-out bg-primary group-hover:h-full"></span>
              <span className="absolute right-0 pr-4 duration-200 ease-out group-hover:translate-x-12">
                <IoIosHome />
              </span>

              <span className="absolute left-0 pl-2.5 -translate-x-12 group-hover:translate-x-0 ease-out duration-200">
                <IoIosHome className="text-white" />
              </span>

              <span className="relative w-full text-left transition-colors duration-200 ease-in-out group-hover:text-white">
                Go HOME
              </span>
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
