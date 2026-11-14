import Link from "next/link";
import { HiOutlineHome, HiOutlineMagnifyingGlass } from "react-icons/hi2";

const NotFoundPage = () => {
  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-gray-50 px-4 py-12">
      <div className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-8 text-center shadow-sm shadow-gray-900/[0.03] md:p-10">
        <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#0C3F8E]/10 text-3xl text-[#0C3F8E] dark:text-[#7FB2FF]">
          <HiOutlineMagnifyingGlass aria-hidden="true" />
        </span>
        <p className="mt-5 text-sm font-semibold uppercase tracking-[0.14em] text-[#EB5C2F]">
          Error 404
        </p>
        <h1 className="mt-1.5 text-xl font-bold tracking-tight text-gray-900 md:text-2xl">
          Page not found
        </h1>
        <p className="mt-2 text-sm text-gray-500 md:text-base">
          The page you&apos;re looking for doesn&apos;t exist or has been
          moved.
        </p>

        <Link
          href="/"
          className="mt-7 inline-flex h-11 w-full items-center justify-center gap-2 rounded-full bg-[#0C3F8E] px-6 text-sm font-semibold text-white shadow-sm shadow-[#0C3F8E]/20 transition-colors hover:bg-[#0A3478] sm:w-auto"
        >
          <HiOutlineHome className="text-lg" aria-hidden="true" />
          Back to home
        </Link>
      </div>
    </div>
  );
};

export default NotFoundPage;
