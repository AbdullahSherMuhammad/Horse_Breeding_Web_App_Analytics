'use client';
import React, { useMemo } from 'react';
import { usePathname } from 'next/navigation';
import { MdDashboard } from 'react-icons/md';
import { GiHorseHead } from 'react-icons/gi';
import { SiMicrogenetics } from 'react-icons/si';
import { MdEventSeat } from 'react-icons/md';
import { MdEmojiEvents } from 'react-icons/md';
import { IoMdAnalytics } from 'react-icons/io';
import { FaCodeCompare } from 'react-icons/fa6';

interface MenuLink {
  name: string;
  url: string;
  icon: React.ReactNode;
}

interface PageNavigationProps {
  scrollToSection: (sectionId: string) => void;
}

const PageNavigation: React.FC<PageNavigationProps> = ({ scrollToSection }) => {

  const pathname = usePathname();

  const menuLinks: MenuLink[] = useMemo(
    () => [
      { name: 'Dashboard', url: 'Dashboard', icon: <MdDashboard /> },
      { name: 'Genetics', url: 'Genetics', icon: <SiMicrogenetics /> },
      { name: 'Horses', url: 'Horses', icon: <GiHorseHead /> },
      { name: 'Panels', url: 'Panels', icon: <MdEventSeat /> },
      { name: 'Events', url: 'Events', icon: <MdEmojiEvents /> },
      { name: 'Performance', url: 'Performance', icon: <IoMdAnalytics /> },
      { name: 'Compare', url: 'Compare', icon: <FaCodeCompare /> },
    ],
    []
  );

  const handleNavigation = (sectionId: string) => {
    scrollToSection(sectionId);
  };


  return (
      <nav className="flex items-center justify-between py-2 border-b-2">        
        <nav className="flex flex-wrap gap-5">
          {menuLinks.map((val, id) => (
            <button
              key={id}
              // href={val.url}
              onClick={() => handleNavigation(val.url)}
              className={`${
                val.url === pathname ? 'bg-gray-200 font-bold text-black' : 'text-gray-500'
              } py-2 px-4 rounded-full hover:bg-gray-200 flex gap-2 items-center`}
            >
              {val.icon}
              {val.name}
            </button>
          ))}
        </nav>
      </nav>
  );
};

export default PageNavigation;
