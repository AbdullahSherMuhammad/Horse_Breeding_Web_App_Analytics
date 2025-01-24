'use client';
import React, { useMemo } from 'react';
import logo from '@/public/assets/logo.webp';
import Image from 'next/image';
import Link from 'next/link';
import { RiMenu3Fill } from "react-icons/ri";
import { usePathname } from 'next/navigation';
import LanguageSelect from '@/components/layout/LanguageSelector/LanguageSelect';



interface MenuLink {
  name: string;
  url: string;
}

interface NavbarProps {
  toggleSidebar: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ toggleSidebar }) => {

  const pathname = usePathname();

  const menuLinks: MenuLink[] = useMemo(
    () => [
      { name: 'Home', url: '/'},
      { name: 'Schedule', url: '#Schedule'},
      { name: 'Catalogue', url: '#Catalogue'},
      { name: 'Shop', url: '#Shop'},
      { name: 'News', url: '#News'},
    ],
    []
  );


  return (
    <div className="p-5 flex justify-center">
      <div className="flex gap-5 items-center justify-between bg-[#1a1a1a] px-6 py-3 shadow-md rounded-full w-full xl:w-[80%]">

          <div className="flex items-center space-x-2">
            <Image src={logo} priority alt="Logo" />
          </div>
        <nav className="hidden lg:flex justify-between w-full items-center gap-5">
          <div className='flex gap-2 items-center'>
            {menuLinks.map((val, id) => (
              <Link
                key={id}
                href={val.url}
                onClick={toggleSidebar}
                className={`${
                  val.url === pathname ? 'bg-gray-200 font-bold text-black' : 'text-gray-200'
                } py-2 px-4 rounded-full hover:bg-gray-200 hover:text-black flex gap-2 items-center`}
              >
                {val.name}
              </Link>
            ))}
          </div>
          <div className='text-white flex gap-5'>
            <button className='bg-white text-black py-2 px-4 rounded-full hover:bg-gray-200'>Sign Up</button>
            <button className='border-2 border-white py-2 px-4 rounded-full hover:bg-black'>Log In</button>
            <LanguageSelect/>
          </div>
        </nav>

        <div className='flex gap-5 lg:hidden'>
          <LanguageSelect/>
          <button
            className="block text-3xl text-white"
            onClick={toggleSidebar}
            >
            <RiMenu3Fill />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
