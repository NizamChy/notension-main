import Link from "next/link";
import Image from "next/image";
import { IoIosHome } from "react-icons/io";

const NotFoundPage = () => {
  return (
    <div className="flex justify-center min-h-screen items-center">
      <div className="relative">
        <Image
          src="/png/not-found-page.png"
          width={618}
          height={618}
          alt="not found page"
          className="w-full max-w-[618px] rounded-lg"
        />

        <div className="absolute bottom-32 left-60">
          <Link href="/">
            <button className="relative outline-none inline-flex items-center justify-start py-3 pl-4 pr-12 overflow-hidden font-semibold text-primary transition-all duration-150 ease-in-out rounded hover:pl-10 hover:pr-6 bg-gray-50 group">
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
