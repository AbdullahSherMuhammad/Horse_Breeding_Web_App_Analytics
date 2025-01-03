'use client';

import React, { useMemo } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

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

      { name: 'Schedule', url: '#Schedule' },
      { name: 'Catalogue', url: '#Catalogue' },
      { name: 'Shop', url: '#Shop' },
      { name: 'News', url: '#News' },
    ],
    []
  );


  return (
    <div className="space-y-20 py-5 flex flex-col w-full">
      <h2 className="text-lg font-semibold">Alendis Breeding</h2>
      <nav className="flex flex-col gap-5 w-full">
        {menuLinks.map((val, id) => (
          <Link
            key={id}
            href={val.url}
            onClick={toggleSidebar}
            className={`${
              val.url === pathname ? 'bg-gray-200 font-bold text-black' : 'text-gray-500'
            } py-2 px-4 rounded hover:bg-gray-200 flex gap-2 items-center`}
          >
            {val.icon && <span>{val.icon}</span>}
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
