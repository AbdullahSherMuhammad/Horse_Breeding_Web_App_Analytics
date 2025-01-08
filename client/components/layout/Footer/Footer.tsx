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
    autoplaySpeed: 1,
    cssEase: "linear",
    speed: 2000,
    slidesToShow: 12,
    arrows: false,
    responsive: [
      { breakpoint: 1024, settings: { slidesToShow: 8 } },
      { breakpoint: 768, settings: { slidesToShow: 4 } },
      { breakpoint: 480, settings: { slidesToShow: 2 } },
    ],
  };

  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#121212] text-white">
      {/* Partners Section */}
      <div className="py-16 h-[300px] border-b-2 border-[#27272a]">
        <div className="flex justify-between items-center px-6 md:px-12">
          <h2 className="text-xl md:text-3xl font-semibold">Alendis Partners</h2>
          <button className="text-[12px] md:text-lg bg-white text-black rounded-full py-2 px-4 hover:bg-slate-100 flex items-center">
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

      <div className="md:px-12">
        {/* Footer Content */}
        <div className="py-8 px-6 md:px-0 pb-[100px]">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
            <div className="flex flex-col items-center md:items-start space-y-4">
              <Image src={logo} alt="Alendis Logo" className="w-48" />
            </div>

            <div className="md:col-span-4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">
              <div>
                <h3 className="font-bold text-lg mb-4">Home</h3>
                <ul className="space-y-2 text-[#A1A1A1] md:text-lg">
                  <li className="hover:text-white cursor-pointer">Devices</li>
                  <li className="hover:text-white cursor-pointer">Pricing</li>
                  <li className="hover:text-white cursor-pointer">FAQ</li>
                </ul>
              </div>

              <div>
                <h3 className="font-bold text-lg mb-4">Catalogue</h3>
                <ul className="space-y-2 text-[#A1A1A1] md:text-lg">
                  <li className="flex items-center hover:text-white cursor-pointer">
                    Live/Up Next{" "}
                    <span className="bg-red-500 text-white text-xs ml-2 px-2 py-1 rounded-full">
                      Live
                    </span>
                  </li>
                  <li className="hover:text-white cursor-pointer">Favorite Videos</li>
                </ul>
              </div>

              <div>
                <h3 className="font-bold text-lg mb-4">News</h3>
                <ul className="space-y-2 text-[#A1A1A1] md:text-lg">
                  <li className="hover:text-white cursor-pointer">Horse Update</li>
                  <li className="hover:text-white cursor-pointer">Latest Update</li>
                  <li className="hover:text-white cursor-pointer">Trending</li>
                  <li className="hover:text-white cursor-pointer">Popular</li>
                </ul>
              </div>

              <div>
                <h3 className="font-bold text-lg mb-4">About Us</h3>
                <ul className="space-y-2 text-[#A1A1A1] md:text-lg">
                  <li className="hover:text-white cursor-pointer">Your Trusted Platform</li>
                </ul>
              </div>

              <div>
                <h3 className="font-bold text-lg mb-4">Contact Us</h3>
                <ul className="space-y-2 text-[#A1A1A1] md:text-lg">
                  <li className="hover:text-white cursor-pointer">press@alendis.com</li>
                  <li className="hover:text-white cursor-pointer">partnerships@alendis.com</li>
                  <li className="hover:text-white cursor-pointer">jobs@alendis.com</li>
                </ul>
                <div className="flex space-x-4 mt-4">
                  <Link href="#" className="text-gray-300 hover:text-white  text-2xl bg-[#27272a1a] border-2 border-[#27272a] p-2 rounded-lg">
                    <FaFacebook />
                  </Link>
                  <Link href="#" className="text-gray-300 hover:text-white  text-2xl bg-[#27272a1a] border-2 border-[#27272a] p-2 rounded-lg">
                    <FaTwitter />
                  </Link>
                  <Link href="#" className="text-gray-300 hover:text-white  text-2xl bg-[#27272a1a] border-2 border-[#27272a] p-2 rounded-lg">
                    <FaInstagram />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="border-t-2 border-[#27272a] py-4 px-6 md:px-12 md:pb-20 text-center md:text-left">
          <div className="flex flex-col md:flex-row justify-between items-center md:items-start space-y-4 md:space-y-0">
            <p className="text-[#A1A1A1] text-sm md:text-lg">© {currentYear} Alendis All Rights Reserved</p>
            <ul className="flex space-x-6 text-[#A1A1A1] text-sm md:text-lg">
              <li>Terms of Use</li>
              <li>Privacy Policy</li>
              <li>Cookie Policy</li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
