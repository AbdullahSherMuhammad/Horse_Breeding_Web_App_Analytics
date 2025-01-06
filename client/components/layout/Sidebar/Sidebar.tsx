'use client';

import { usePathname } from 'next/navigation';
import logo from '@/public/assets/logo.webp';
import { RiCalendarScheduleFill } from "react-icons/ri";
import { FaNewspaper } from "react-icons/fa6";
import { FaBook } from "react-icons/fa6";
import { FaShop } from "react-icons/fa6";
import React, { useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface MenuLink {
  name: string;
  url: string;
  icon?: React.ReactNode;
}

interface SidebarProps {
  toggleSidebar: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ toggleSidebar }) => {
  const pathname = usePathname();

  const menuLinks: MenuLink[] = useMemo(
    () => [

      { name: 'Schedule', url: '#Schedule' , icon: <RiCalendarScheduleFill />},
      { name: 'Catalogue', url: '#Catalogue', icon: <FaBook /> },
      { name: 'Shop', url: '#Shop', icon: <FaShop /> },
      { name: 'News', url: '#News', icon: <FaNewspaper /> },
    ],
    []
  );


  return (
    <div className="space-y-20 py-5 flex flex-col w-full">
      <div className="flex justify-center items-center space-x-2 bg-black p-2 rounded-full">
            <Image src={logo} priority alt="Logo" />
          </div>
      <nav className="flex flex-col gap-5 w-full">
        {menuLinks.map((val, id) => (
          <Link
            key={id}
            href={val.url}
            onClick={toggleSidebar}
            className={`${
              val.url === pathname ? 'bg-gray-200 font-bold text-black' : 'text-gray-500'
            } py-2 px-4 rounded hover:bg-gray-200 hover:text-black flex gap-2 items-center`}
          >
            {val.icon && <span className='text-xl'>{val.icon}</span>}
            {val.name}
          </Link>
        ))}
      </nav>
      <div className="flex flex-col gap-4">
        <button className="border-2 border-gray-300 bg-white text-black py-2 px-4 rounded hover:bg-gray-200">Sign Up</button>
        <button className="border-2 border-black py-2 px-4 rounded hover:bg-black hover:text-white">
          Log In
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
