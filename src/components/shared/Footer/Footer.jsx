import Image from "next/image";
import Link from "next/link";
import React from "react";

import {
  BsFacebook,
  BsInstagram,
  BsLinkedin,
  BsTwitter,
  BsTelephonePlusFill,
} from "react-icons/bs";
import { IoLocation } from "react-icons/io5";
import { GrMail } from "react-icons/gr";
import { FiChevronRight } from "react-icons/fi";
import { FaCcVisa, FaCcMastercard, FaCcDiscover } from "react-icons/fa";
import { SiAmericanexpress } from "react-icons/si";

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
            src="/png/no_tension_bar.png"
            alt="notension"
            width={180}
            height={100}
          />
          <p className="text-sm leading-6 text-gray-700">
            NoTension is an ECommerce Online Service Provider. You can get all
            kinds of services like Grocery Stores, Medicine, Food, and more.
            Doctor's appointments, nurses, ambulances, & blood donors are also
            available.
          </p>
          <div className="flex space-x-4">
            <BsFacebook className="text-2xl text-gray-700 hover:text-blue-600" />
            <BsInstagram className="text-2xl text-gray-700 hover:text-pink-500" />
            <BsLinkedin className="text-2xl text-gray-700 hover:text-blue-700" />
            <BsTwitter className="text-2xl text-gray-700 hover:text-blue-400" />
          </div>
        </div>

        {/* Section 2 */}
        <div>
          <p className="text-xl font-semibold mb-4 text-slate-700">Contact</p>
          <ul className="space-y-4 text-gray-700">
            <li className="flex items-center">
              <IoLocation className="text-xl mr-2" />
              Chattogram, Bangladesh
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
        <div>
          <p className="text-xl font-semibold mb-4 text-slate-700">
            Quick Links
          </p>
          <ul className="space-y-4">
            <li>
              <Link
                href="/"
                className="flex items-center text-gray-700 hover:text-yellow-500"
              >
                <FiChevronRight className="mr-2" />
                Home
              </Link>
            </li>
            <li>
              <Link
                href="#"
                className="flex items-center text-gray-700 hover:text-yellow-500"
              >
                <FiChevronRight className="mr-2" />
                Grocery Store
              </Link>
            </li>
            <li>
              <Link
                href="#"
                className="flex items-center text-gray-700 hover:text-yellow-500"
              >
                <FiChevronRight className="mr-2" />
                Doctor Registration
              </Link>
            </li>
            <li>
              <Link
                href="#"
                className="flex items-center text-gray-700 hover:text-yellow-500"
              >
                <FiChevronRight className="mr-2" />
                Find Doctor
              </Link>
            </li>
            <li>
              <Link
                href="#"
                className="flex items-center text-gray-700 hover:text-yellow-500"
              >
                <FiChevronRight className="mr-2" />
                Special Discount
              </Link>
            </li>
          </ul>
        </div>

        {/* Section 4 */}
        <div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">
              Subscribe to our newsletter
            </h2>
            <div className="relative">
              <input
                className="w-full border rounded py-2 px-3 text-gray-700 focus:outline-none focus:ring focus:ring-yellow-300"
                type="email"
                placeholder="Email"
              />
              <button
                className="bg-yellow-500 text-white font-bold py-2 px-4 absolute right-0 top-0 rounded-r hover:bg-yellow-600"
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
                  src="/png/playstore.png"
                  width={120}
                  height={40}
                  alt="google-play"
                />
              </a>
              <Link href="#">
                <Image
                  src="/png/applestore.png"
                  alt="app-store"
                  width={120}
                  height={40}
                />
              </Link>
            </div>
          </div>
        </div>
      </div>

      <hr />
      <div className="flex flex-col md:flex-row justify-between items-center py-6 space-y-4 md:space-y-0 text-gray-700">
        <p>© NoTension All rights reserved {fullYear}</p>
        <div className="flex items-center space-x-4">
          <p>Accept:</p>
          <FaCcVisa className="text-2xl" />
          <FaCcMastercard className="text-2xl" />
          <FaCcDiscover className="text-2xl" />
          <SiAmericanexpress className="text-2xl" />
        </div>
      </div>
    </div>
  );
};

export default Footer;
