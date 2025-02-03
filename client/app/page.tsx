'use client';
import React, { useState } from 'react';
import ScrollToTop from '@/components/layout/ScrollToTop/ScrollToTop';
import Sidebar from '@/components/layout/Sidebar/Sidebar';
import Footer from '@/components/layout/Footer/Footer';
import Navbar from '@/components/layout/Header/Navbar';
import TopListTable from './TopListTables/page';
import Dashboard from './Dashboard/page';
import Genetics from './Genetics/page';
import Horses from './Horses/page';
import Panels from './Panels/page';
import Events from './Events/page';

const sections = [
  { id: 'Dashboard', Component: Dashboard },
  { id: 'Horses', Component: Horses },
  { id: 'Genetics', Component: Genetics },
  { id: 'Panels', Component: Panels },
  { id: 'Events', Component: Events },
  { id: 'TopListTable', Component: TopListTable },
];

const Page: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };


  return (
      <div className="flex min-h-screen overflow-hidden">
        <div
          className={`flex lg:hidden fixed top-0 left-0 z-[999] h-screen w-64 bg-gray-100 p-4 transition-transform duration-300 ease-in-out ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 overflow-y-auto`}
        >
          <Sidebar toggleSidebar={toggleSidebar} />
        </div>

        <div
          className={`flex-1 transition-all duration-300 ${isSidebarOpen ? 'flex-1' : 'ml-0'
            } md:ml-0 overflow-hidden`}
        >
          <Navbar toggleSidebar={toggleSidebar} />

          <main className="flex-1 py-6 px-6 md:px-10 overflow-x-hidden">
            {sections.map(({ id, Component }) => (
              <section
                key={id}
                id={id}
                className="scroll-mt-[150px] sm:p-5 rounded-[20px] mb-10 sm:bg-[#f4f4f4]"
              >
                  <Component />
              </section>
            ))}
          </main>

          <Footer />
        </div>

        {isSidebarOpen && (
          <div
            className="fixed inset-0 z-[100] bg-black opacity-50 lg:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        <ScrollToTop />
      </div>
  );
};

export default Page;