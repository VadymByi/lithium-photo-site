'use client';

import { usePathname } from 'next/navigation';
import { useState } from 'react';
import Link from 'next/link';
import { SiteConfig } from '@prisma/client';

interface BurgerProps {
  lineColor?: string;
  className?: string;
  config: SiteConfig | null;
}

const Burger: React.FC<BurgerProps> = ({
  lineColor = 'bg-white',
  className,
  config,
}) => {
  // STATE MANAGEMENT
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  // MENU FILTERING BASED ON CONFIG
  const filteredMenuItems = [
    { to: '/', label: 'Main', show: true },
    { to: '/about', label: 'About', show: config?.showAbout },
    { to: '/portfolio', label: 'Portfolio', show: config?.showPortfolio },
    { to: '/projects', label: 'Projects', show: config?.showProjects },
    { to: '/contacts', label: 'Contacts', show: config?.showContacts },
  ].filter((item) => item.show ?? true);

  return (
    <>
      {/* BURGER BUTTON */}
      <div
        id="burger"
        className={`fixed top-6 left-6 md:top-10 md:left-10 z-1001 flex flex-col justify-center items-center gap-1.5 cursor-pointer w-7.5 h-7.5 transition-transform active:scale-90 ${className || ''}`}
        onClick={() => setMenuOpen(!menuOpen)}
      >
        <span
          className={`block h-0.5 w-full rounded transition-all duration-300 ease-in-out ${
            menuOpen ? 'rotate-45 translate-y-[8.5px] bg-white' : lineColor
          }`}
        />
        <span
          className={`block h-0.5 w-full rounded transition-all duration-300 ease-in-out ${
            menuOpen ? 'opacity-0' : lineColor
          }`}
        />
        <span
          className={`block h-0.5 w-full rounded transition-all duration-300 ease-in-out ${
            menuOpen ? '-rotate-45 -translate-y-[8.5px] bg-white' : lineColor
          }`}
        />
      </div>

      {/* SIDE MENU */}
      <nav
        className={`fixed top-0 left-0 h-full w-64 bg-black text-white transform transition-transform duration-500 z-1000 ${
          menuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <ul className="flex flex-col gap-8 p-10 mt-24">
          {filteredMenuItems.map((item) => {
            const isActive = pathname === item.to;

            return (
              <li key={item.to}>
                <Link
                  href={item.to}
                  className={`text-lg transition-colors ${
                    isActive ? 'text-red-500' : 'text-white'
                  }`}
                  onClick={() => setMenuOpen(false)}
                >
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* OVERLAY */}
      <div
        className={`fixed inset-0 bg-black/20 backdrop-blur-sm transition-opacity duration-500 z-999 ${
          menuOpen
            ? 'opacity-100 pointer-events-auto'
            : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setMenuOpen(false)}
      />
    </>
  );
};

export default Burger;
