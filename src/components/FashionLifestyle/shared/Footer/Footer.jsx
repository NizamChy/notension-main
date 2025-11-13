import {
  BsTwitter,
  BsLinkedin,
  BsFacebook,
  BsInstagram,
  BsTelephonePlusFill,
} from "react-icons/bs";
import React from "react";
import Link from "next/link";
import Image from "next/image";
import { GrMail } from "react-icons/gr";
import { IoLocation } from "react-icons/io5";
import { FiChevronRight } from "react-icons/fi";
import { SiAmericanexpress } from "react-icons/si";
import { FaCcVisa, FaCcMastercard, FaCcDiscover } from "react-icons/fa";

const Footer = () => {
  const date = new Date();
  const fullYear = date.getFullYear();
  return (
    <div className="mt-12 px-4 md:px-10 max-w-screen-2xl mx-auto lg:h-footer">
      <hr />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-12 mb-8 px-4 lg:px-0">
        {/* Section 1 */}
        <div className="space-y-6">
          <Image
            src="/png/notension-logo.png"
            alt="notension"
            width={180}
            height={32}
          />
          <p className="text-xs md:text-sm leading-6 text-gray-700">
            NoTension is an ECommerce Online Service Provider. You can get all
            kinds of services like Grocery Stores, Medicine, Food, and more.
            Doctor's appointments, nurses, ambulances, & blood donors are also
            available.
          </p>
          <div className="flex space-x-4 text-2xl text-gray-700">
            <BsFacebook className="hover:text-blue-600" />
            <BsInstagram className="hover:text-pink-500" />
            <BsLinkedin className="hover:text-blue-700" />
            <BsTwitter className="hover:text-blue-400" />
          </div>
        </div>

        {/* Section 2 */}
        <div className="text-xs md:text-base">
          <p className="text-lg md:text-xl font-semibold mb-2 md:mb-4 text-slate-700">
            Contact
          </p>
          <ul className="space-y-2 md:space-y-4 text-gray-700">
            <li className="flex items-start">
              <span>
                <IoLocation className="text-xl mr-2 mt-2" />
              </span>
              Jobeda Villa (Behind Meghna Bank, 2nd Floor), Holding - 120,
              Mirzarpool, Muradpur, Panchlaish, Chattogram, Bangladesh
            </li>
            <li className="flex items-center">
              <BsTelephonePlusFill className="mr-2" /> +88 01719662995
            </li>
            <li className="flex items-center">
              <GrMail className="mr-2" /> notensionxyz@gmail.com
            </li>
          </ul>
        </div>

        {/* Section 3 */}
        <div className="text-xs md:text-base">
          <p className="text-lg md:text-xl font-semibold mb-2 md:mb-4 text-slate-700">
            Quick Links
          </p>
          <ul className="space-y-2 md:space-y-4">
            <li>
              <Link
                href="https://notension-main.vercel.app"
                className="flex items-center text-gray-700 hover:text-yellow-500"
              >
                <FiChevronRight className="mr-2" />
                Grocery, Medicine, Food
              </Link>
            </li>
            <li>
              <Link
                href="https://notension-main.vercel.app"
                className="flex items-center text-gray-700 hover:text-yellow-500"
              >
                <FiChevronRight className="mr-2" />
                Doctor Registration
              </Link>
            </li>
            <li>
              <Link
                href="https://notension-main.vercel.app"
                className="flex items-center text-gray-700 hover:text-yellow-500"
              >
                <FiChevronRight className="mr-2" />
                Find Doctor
              </Link>
            </li>
            <li>
              <Link
                href="https://notension-main.vercel.app/marketing-policy"
                className="flex items-center text-gray-700 hover:text-yellow-500"
              >
                <FiChevronRight className="mr-2" />
                Marketing Policy
              </Link>
            </li>
          </ul>
        </div>

        {/* Section 4 */}
        <div>
          <div className="bg-white p-3 lg:p-6 rounded-lg shadow-md">
            <h2 className="text-base lg:text-xl font-medium mb-4">
              Subscribe to our newsletter
            </h2>
            <div className="relative">
              <input
                className="w-full border rounded py-2 px-3 text-gray-700 focus:outline-none focus:ring-1 focus:ring-yellow-300"
                type="email"
                placeholder="Email"
              />
              <button
                className="bg-yellow-500 text-white font-semibold py-2 px-2 md:px-4 absolute right-0 top-0 rounded-r hover:bg-yellow-600"
                type="submit"
              >
                Subscribe
              </button>
            </div>
            <div className="flex justify-between items-center mt-4 space-x-2">
              <a
                href="https://play.google.com/store/apps/details?id=com.bitsnotension&hl=en&gl=US"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Image
                  className="w-full"
                  src="/png/playstore.png"
                  width={120}
                  height={30}
                  alt="google-play"
                />
              </a>
              <Link href="https://play.google.com/store/apps/details?id=com.bitsnotension&hl=en&gl=US">
                <Image
                  className="w-full"
                  src="/png/applestore.png"
                  alt="app-store"
                  width={120}
                  height={30}
                />
              </Link>
            </div>
          </div>
        </div>
      </div>

      <hr />
      <div className="flex flex-col md:flex-row justify-between items-center py-6 space-y-2 md:space-y-0 text-gray-700">
        <p className="text-center md:text-start text-xs md:text-base">
          © NoTension All rights reserved {fullYear}
        </p>
        <div className="flex items-center space-x-4 text-2xl">
          <p className="text-xs md:text-base">Accept:</p>
          <FaCcVisa />
          <FaCcMastercard />
          <FaCcDiscover />
          <SiAmericanexpress />
        </div>
      </div>
    </div>
  );
};

export default Footer;
