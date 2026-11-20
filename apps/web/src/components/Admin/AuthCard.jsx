import Image from "next/image";
import Link from "next/link";
import { HiOutlineArrowLeft } from "react-icons/hi2";
import ThemeToggle from "@/components/shared/ThemeToggle/ThemeToggle";

// Centered card for the sign-in and setup pages, with a way back to the
// home page and the light / dark switch on top.
export default function AuthCard({ title, subtitle, children, footer }) {
  return (
    <div className="relative flex min-h-screen items-center justify-center px-4 py-16">
      <div className="absolute inset-x-0 top-0 flex items-center justify-between px-3 py-3 md:px-5">
        <Link
          href="/"
          className="inline-flex min-h-10 items-center gap-1.5 rounded-lg px-3 text-sm font-medium text-gray-700 hover:bg-gray-100"
        >
          <HiOutlineArrowLeft /> Home page
        </Link>
        <ThemeToggle />
      </div>
      <div className="w-full max-w-[400px]">
        <Link href="/" aria-label="NoTension home" className="mx-auto mb-6 block w-40">
          <Image width={224} height={40} src="/png/notension-logo.png" alt="notension" className="h-auto w-full object-contain" />
        </Link>
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-xl shadow-gray-900/5 md:p-8">
          <h1 className="text-center text-xl font-bold text-gray-900">{title}</h1>
          {subtitle ? <p className="mt-1 text-center text-sm text-gray-500">{subtitle}</p> : null}
          <div className="mt-6">{children}</div>
        </div>
        {footer ? <div className="mt-5 text-center text-xs text-gray-500">{footer}</div> : null}
      </div>
    </div>
  );
}
