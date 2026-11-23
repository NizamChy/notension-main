import Link from "next/link";
import { HiOutlineArrowRight } from "react-icons/hi2";
import { DEMO_ACCOUNTS, DEMO_CUSTOMER, DEMO_PASSWORD } from "@notension/shared";
import Footer from "@/components/shared/Footer/Footer";
import Navbar from "@/components/shared/Navbar/Navbar";
import { roleLabel } from "@/components/Admin/api";
import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Demo accounts",
  description: "Sign-ins for every NoTension role, for trying the demo: admin, store teams, rider, doctor and customer.",
};

const Mono = ({ children }: { children: ReactNode }) => <span className="font-mono text-gray-900">{children}</span>;

export default function DemoAccountsPage() {
  return (
    <>
      {/* boundary: legacy JS caller. Navbar is JS, so TS reads every prop as
          required; this page passes none. */}
      <Navbar search={undefined} leading={undefined} actions={undefined} />
      <main className="bg-gray-50 pt-16 lg:pt-[72px]">
        <div className="mx-auto max-w-5xl px-4 py-8 md:py-12">
          <h1 className="text-2xl font-bold text-gray-900 md:text-3xl">Demo accounts</h1>
          <p className="mt-2 max-w-2xl text-sm text-gray-600 md:text-base">
            Try NoTension as any role. Staff sign in at{" "}
            <Link href="/admin/login" className="font-medium text-primary hover:underline">
              /admin/login
            </Link>{" "}
            with the phone number and the password <Mono>{DEMO_PASSWORD}</Mono>. These are public demo accounts: their
            passwords can&apos;t be changed and are reset on every deploy.
          </p>

          <div className="mt-5 flex flex-wrap gap-3">
            <Link
              href="/admin/login"
              className="inline-flex min-h-11 items-center gap-2 rounded-lg bg-primary px-4 text-sm font-medium text-white hover:bg-secondary"
            >
              Staff login <HiOutlineArrowRight />
            </Link>
          </div>

          <div className="mt-6 rounded-xl border border-gray-200 bg-white p-4 md:p-5">
            <h2 className="font-semibold text-gray-900">Customer</h2>
            <p className="mt-1 text-sm text-gray-600">
              {DEMO_CUSTOMER.name} · <Mono>{DEMO_CUSTOMER.phone}</Mono>. On the{" "}
              <Link href="/login" className="font-medium text-primary hover:underline">
                login page
              </Link>
              , press &quot;Log in as Demo User&quot;: no password or OTP. {DEMO_CUSTOMER.can.split(". ")[0]}.
            </p>
          </div>

          <h2 className="mt-8 font-semibold text-gray-900">Staff and partners</h2>

          {/* Phones: one card per account */}
          <ul className="mt-3 space-y-3 md:hidden">
            {DEMO_ACCOUNTS.map((a) => (
              <li key={a.phone} className="rounded-xl border border-gray-200 bg-white p-4">
                <p className="font-medium text-gray-900">
                  {roleLabel(a.role)}
                  {a.storeName ? <span className="font-normal text-gray-500"> · {a.storeName}</span> : null}
                </p>
                <p className="mt-0.5 text-sm text-gray-500">{a.name}</p>
                <p className="mt-2 text-sm">
                  <Mono>{a.phone}</Mono> <span className="text-gray-400">/</span> <Mono>{DEMO_PASSWORD}</Mono>
                </p>
                <p className="mt-2 text-sm text-gray-600">{a.can}</p>
              </li>
            ))}
          </ul>

          {/* Wider screens: a table */}
          <div className="mt-3 hidden overflow-hidden rounded-xl border border-gray-200 bg-white md:block">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 text-xs uppercase tracking-wide text-gray-500">
                <tr>
                  <th className="px-4 py-3 font-medium">Role</th>
                  <th className="px-4 py-3 font-medium">Name</th>
                  <th className="px-4 py-3 font-medium">Phone</th>
                  <th className="px-4 py-3 font-medium">Password</th>
                  <th className="px-4 py-3 font-medium">Can</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {DEMO_ACCOUNTS.map((a) => (
                  <tr key={a.phone} className="align-top">
                    <td className="px-4 py-3 font-medium text-gray-900">
                      {roleLabel(a.role)}
                      {a.storeName ? <span className="block text-xs font-normal text-gray-500">{a.storeName}</span> : null}
                    </td>
                    <td className="px-4 py-3 text-gray-700">{a.name}</td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <Mono>{a.phone}</Mono>
                    </td>
                    <td className="px-4 py-3">
                      <Mono>{DEMO_PASSWORD}</Mono>
                    </td>
                    <td className="px-4 py-3 text-gray-600">{a.can}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
