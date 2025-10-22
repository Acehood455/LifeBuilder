'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Menu from '@/components/Menu';
import Navbar from '@/components/Navbar';
import { Menu as MenuIcon, X as CloseIcon } from 'lucide-react';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="h-screen flex flex-col md:flex-row">
      {/* Sidebar */}
      <div
        className={`
          fixed top-0 left-0 h-full z-50 bg-[#e6f2ff] p-4 shadow-md
          w-64 transform transition-transform duration-300
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          md:relative md:translate-x-0 md:w-[16%] xl:w-[14%]
        `}
      >
        {/* Close Button for Mobile */}
        <div className="flex items-center justify-between md:hidden">
          <Link href="/" className="flex items-center">
            <Image
              src="/lifebuilderLogo.png"
              alt="logo"
              width={160}
              height={160}
              className="min-w-[27px]"
            />
          </Link>
          <button onClick={() => setSidebarOpen(false)}>
            <CloseIcon className="w-6 h-6" />
          </button>
        </div>

        <Link href="/" className="md:flex items-center hidden">
          <Image
            src="/lifebuilderLogo.png"
            alt="logo"
            width={160}
            height={160}
            className="min-w-[27px]"
          />
        </Link>
        
      <div className="overflow-y-auto h-[calc(100vh-100px)] pr-1 md:overflow-visible md:h-auto">
        <Menu onLinkClick={() => setSidebarOpen(false)} />
      </div>
      
      </div>

      {/* Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-40 z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <div className="flex-1 bg-[#f7f8fa] overflow-y-auto ">
        {/* Mobile Top Bar */}
        <div className="md:hidden flex items-center justify-between p-3 bg-[#e6f2ff] shadow-md w-[100%] fixed z-30">
          <button onClick={() => setSidebarOpen(true)}>
            <MenuIcon className="w-6 h-6" />
          </button>
          <Navbar className="p-0 shadow-none" /> {/* use Navbar inline */}
        </div>

        {/* Desktop Navbar */}
        <div className="hidden md:block">
          <Navbar />
        </div>

        {children}
      </div>
    </div>
  );
}
