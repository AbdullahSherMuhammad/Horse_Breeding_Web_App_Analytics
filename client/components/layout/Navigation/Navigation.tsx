'use client';
import React, { useEffect, useMemo, useState, useRef } from 'react';
import { MdDashboard } from 'react-icons/md';
import { GiHorseHead } from 'react-icons/gi';
import { SiMicrogenetics } from 'react-icons/si';
import { MdEventSeat, MdEmojiEvents } from 'react-icons/md';
import { IoMdAnalytics } from 'react-icons/io';
import { IoMdArrowDropleft } from "react-icons/io";
import { IoMdArrowDropright } from "react-icons/io";


interface MenuLink {
  name: string;
  url: string;
  icon: React.ReactNode;
}

interface PageNavigationProps {
  scrollToSection: (sectionId: string) => void;
}

const PageNavigation: React.FC<PageNavigationProps> = ({ scrollToSection }) => {
  const [active, setActive] = useState<string | null>('Dashboard');
  const [isSticky, setIsSticky] = useState(false);
  const [showArrows, setShowArrows] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const menuLinks: MenuLink[] = useMemo(
    () => [
      { name: 'Dashboard', url: 'Dashboard', icon: <MdDashboard /> },
      { name: 'Horses', url: 'Horses', icon: <GiHorseHead /> },
      { name: 'Genetics', url: 'Genetics', icon: <SiMicrogenetics /> },
      { name: 'Panels', url: 'Panels', icon: <MdEventSeat /> },
      { name: 'Events', url: 'Events', icon: <MdEmojiEvents /> },
      { name: 'Top 10 List Table', url: 'TopListTable', icon: <IoMdAnalytics /> },
    ],
    []
  );

  const handleNavigation = (sectionId: string, activeName: string) => {
    scrollToSection(sectionId);
    setActive(activeName);
  };

  const scrollMenu = (direction: 'left' | 'right') => {
    if (menuRef.current) {
      const scrollAmount = direction === 'left' ? -200 : 200;
      menuRef.current.scrollBy({
        left: scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY === 0) {
        setActive('Dashboard');
      }
      if (window.scrollY >= 300) {
        setIsSticky(true);
      } else {
        setIsSticky(false);
      }
    };

    const checkScroll = () => {
      if (menuRef.current) {
        const isScrollable =
          menuRef.current.scrollWidth > menuRef.current.clientWidth;
        setShowArrows(isScrollable);
      }
    };

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', checkScroll);
    checkScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', checkScroll);
    };
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const sectionId = entry.target.id;
            const link = menuLinks.find((link) => link.url === sectionId);
            if (link) {
              setActive(link.name);
            }
          }
        });
      },
      { threshold: 0.6 }
    );
  
    // Observe each section
    menuLinks.forEach((link) => {
      const section = document.getElementById(link.url);
      if (section) observer.observe(section);
    });
  
    return () => {
      observer.disconnect();
    };
  }, [menuLinks]);
  

  return (
    <div
      className={`${
        isSticky ? 'fixed top-0 left-0 z-50 bg-white shadow-md' : 'relative top-0'
      } w-full px-2 border-b-2 transition-all duration-300 ease-in-out`}
    >
      {/* Left Arrow */}
      {showArrows && (
        <button
          onClick={() => scrollMenu('left')}
          className="absolute -left-2 top-1/2 transform -translate-y-1/2 text-3xl z-20"
          aria-label="Scroll Left"
          style={{ display: showArrows ? 'flex' : 'none' }}
        >
          <IoMdArrowDropleft />
        </button>
      )}

      {/* Scrollable Menu */}
      <div
        ref={menuRef}
        className="flex md:justify-center gap-5 overflow-x-auto py-2 px-4 scrollbar-hide relative"
      >
        {menuLinks.map((val, id) => (
          <button
            key={id}
            onClick={() => handleNavigation(val.url, val.name)}
            className={`py-2 px-4 rounded-full hover:bg-gray-200 flex gap-2 items-center whitespace-nowrap ${
              active === val.name ? 'bg-gray-200 font-semibold' : 'text-gray-500'
            }`}
          >
            {val.icon}
            {val.name}
          </button>
        ))}
      </div>

      {/* Right Arrow */}
      {showArrows && (
        <button
          onClick={() => scrollMenu('right')}
          className="absolute -right-2 top-1/2 transform -translate-y-1/2 text-3xl z-20"
          aria-label="Scroll Right"
          style={{ display: showArrows ? 'flex' : 'none' }}
        >
          <IoMdArrowDropright />
        </button>
      )}

      {/* Optional: Shadows */}
      {showArrows && (
        <>
          <div className="absolute left-0 top-0 bottom-0 w-10 bg-gradient-to-r from-gray-100 to-transparent pointer-events-none z-0"></div>
          <div className="absolute right-0 top-0 bottom-0 w-10 bg-gradient-to-l from-gray-100 to-transparent pointer-events-none z-0"></div>
        </>
      )}
    </div>
  );
};

export default PageNavigation;
