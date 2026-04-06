'use client';

import { usePathname } from 'next/navigation';
import { useState } from 'react';
import Link from 'next/link';

const menuItems = [
  { to: '/', label: 'Main' },
  { to: '/about', label: 'About' },
  { to: '/projects', label: 'Projects' },
  { to: '/contacts', label: 'Contacts' },
];

interface BurgerProps {
  lineColor?: string;
  className?: string;
}

const Burger: React.FC<BurgerProps> = ({
  lineColor = 'bg-white',
  className,
}) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  return (
    <>
      {/* Burger Icon */}
      <div
        id="burger"
        className={`fixed top-5 right-5 z-[1001] flex flex-col justify-center items-center gap-1 cursor-pointer w-[30px] h-[30px] transition-transform ${className}`}
        onClick={() => setMenuOpen(!menuOpen)}
      >
        <span
          className={`block h-[3px] w-full rounded transition-transform duration-300 ease-in-out ${
            menuOpen ? 'rotate-45 translate-y-[8px] bg-white' : `${lineColor}`
          }`}
        ></span>
        <span
          className={`block h-[3px] w-full rounded transition-all duration-300 ease-in-out ${
            menuOpen ? 'opacity-0' : `${lineColor}`
          }`}
        ></span>
        <span
          className={`block h-[3px] w-full rounded transition-transform duration-300 ease-in-out ${
            menuOpen ? '-rotate-45 -translate-y-[8px] bg-white' : `${lineColor}`
          }`}
        ></span>
      </div>

      {/* Side Menu */}
      <nav
        className={`fixed top-0 right-0 h-screen w-[250px] bg-[#111] shadow-lg transition-transform duration-300 z-[1000] transform ${
          menuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <ul className="flex flex-col gap-6 p-8 mt-16">
          {menuItems.map((item) => {
            const isActive = pathname === item.to;
            return (
              <li key={item.to}>
                <Link
                  href={item.to}
                  onClick={() => setMenuOpen(false)}
                  className={`text-lg transition-all ${
                    isActive
                      ? 'text-sky-400 font-semibold border-b-2 border-sky-400'
                      : 'text-white hover:text-sky-300'
                  }`}
                >
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Overlay */}
      {menuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-[999]"
          onClick={() => setMenuOpen(false)}
        ></div>
      )}
    </>
  );
};

export default Burger;
