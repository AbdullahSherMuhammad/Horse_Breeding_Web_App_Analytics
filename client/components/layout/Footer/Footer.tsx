import React from "react";
import dynamic from "next/dynamic";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Image from "next/image";
import logo from "@/public/assets/logo.webp";
import carosalImage from "@/public/assets/carosal_image.png";
import { FaFacebook, FaTwitter, FaInstagram } from "react-icons/fa";
import { TbUsersGroup } from "react-icons/tb";
import Link from "next/link";
import type { Settings } from "react-slick";


const Slider = dynamic(() => import("react-slick"), { ssr: false }) as React.ComponentType<Settings>;
const Footer: React.FC = () => {
  const carouselSettings = {
    dots: false,
    infinite: true,
    autoplay: true,
    autoplaySpeed: 0,
    cssEase: "linear",
    speed: 5000,
    slidesToShow: 6,
    slidesToScroll: 1,
    arrows: false,
    responsive: [
      { breakpoint: 1024, settings: { slidesToShow: 4 } },
      { breakpoint: 768, settings: { slidesToShow: 3 } },
      { breakpoint: 480, settings: { slidesToShow: 2 } },
    ],
  };

  return (
    <footer className="bg-[#121212] text-white">
      {/* Partners Section */}
      <div className="py-8">
        <div className="flex justify-between items-center px-6 md:px-12">
          <h2 className="text-2xl md:text-3xl font-semibold">Alendis Partners</h2>
          <button className="bg-white text-black rounded-full py-2 px-4 hover:bg-slate-100 flex items-center">
            <span className="mr-2"><TbUsersGroup /></span> Become Partner
          </button>
        </div>
        <div className="mt-6 px-6 md:px-12">
          <Slider {...carouselSettings}>
            {Array.from({ length: 22 }).map((_, index) => (
              <div
                key={index}
                className="flex justify-center items-center px-2"
              >
                <Image
                  src={carosalImage}
                  alt="Champion Cup Partner Logo"
                  className=""
                />
              </div>
            ))}
          </Slider>
        </div>
      </div>

      {/* Footer Content */}
      <div className="border-t border-gray-800 py-8 px-6 md:px-12">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
          {/* Column 1: Logo */}
          <div className="flex flex-col items-start space-y-4">
            <Image src={logo} alt="Alendis Logo" className="w-36" />
          </div>

          {/* Column 2: Navigation Links */}
          <div className="md:col-span-4 grid grid-cols-2 md:grid-cols-4 gap-8">
            {/* Links Group 1 */}
            <div>
              <h3 className="font-bold text-lg mb-4">Home</h3>
              <ul className="space-y-2 text-gray-400">
                <li>Devices</li>
                <li>Pricing</li>
                <li>FAQ</li>
              </ul>
            </div>

            {/* Links Group 2 */}
            <div>
              <h3 className="font-bold text-lg mb-4">Catalogue</h3>
              <ul className="space-y-2 text-gray-400">
                <li className="flex items-center">
                  Live/Up Next{" "}
                  <span className="bg-red-500 text-white text-xs ml-2 px-2 py-1 rounded-full">
                    Live
                  </span>
                </li>
                <li>Favorite Videos</li>
              </ul>
            </div>

            {/* Links Group 3 */}
            <div>
              <h3 className="font-bold text-lg mb-4">News</h3>
              <ul className="space-y-2 text-gray-400">
                <li>Horse Update</li>
                <li>Latest Update</li>
                <li>Trending</li>
                <li>Popular</li>
              </ul>
            </div>

            {/* Links Group 4 */}
            <div>
              <h3 className="font-bold text-lg mb-4">Contact Us</h3>
              <ul className="space-y-2 text-gray-400">
                <li>press@alendis.com</li>
                <li>partnerships@alendis.com</li>
                <li>jobs@alendis.com</li>
              </ul>
              <div className="flex space-x-4 mt-4">
                <Link href="#" className="text-xl">
                  <FaFacebook />
                </Link>
                <Link href="#" className="text-xl">
                  <FaTwitter />
                </Link>
                <Link href="#" className="text-xl">
                  <FaInstagram />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Bottom */}
      <div className="border-t border-gray-800 py-4 px-6 md:px-12 text-center md:text-left">
        <div className="flex flex-col md:flex-row justify-between items-center md:items-start space-y-4 md:space-y-0">
          <p className="text-gray-400 text-sm">©2024 Alendis All Rights Reserved</p>
          <ul className="flex space-x-6 text-gray-400 text-sm">
            <li>Terms of Use</li>
            <li>Privacy Policy</li>
            <li>Cookie Policy</li>
          </ul>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
