import Image from "next/image";
import Link from "next/link";

// Centered card for the sign-in and setup pages.
export default function AuthCard({ title, subtitle, children, footer }) {
  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-10">
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
