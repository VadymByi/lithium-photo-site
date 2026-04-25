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
        className={`fixed top-6 left-6 md:top-10 md:left-10 z-[1001] flex flex-col justify-center items-center gap-1.5 cursor-pointer w-[30px] h-[30px] transition-transform active:scale-90 ${className ?? ''}`}
        onClick={() => setMenuOpen(!menuOpen)}
      >
        <span
          className={`block h-[2px] w-full rounded transition-all duration-300 ease-in-out ${
            menuOpen ? 'rotate-45 translate-y-[8.5px] bg-white' : lineColor
          }`}
        />
        <span
          className={`block h-[2px] w-full rounded transition-all duration-300 ease-in-out ${
            menuOpen ? 'opacity-0' : lineColor
          }`}
        />
        <span
          className={`block h-[2px] w-full rounded transition-all duration-300 ease-in-out ${
            menuOpen ? '-rotate-45 -translate-y-[8.5px] bg-white' : lineColor
          }`}
        />
      </div>

      {/* Side Menu */}
      <nav
        className={`fixed top-0 left-0 h-screen w-[280px] bg-black/90 backdrop-blur-xl border-r border-white/10 shadow-2xl transition-transform duration-500 z-[1000] ease-out ${
          menuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <ul className="flex flex-col gap-8 p-10 mt-24">
          {menuItems.map((item) => {
            const isActive = pathname === item.to;

            return (
              <li key={item.to}>
                <Link
                  href={item.to}
                  onClick={() => setMenuOpen(false)}
                  className={
                    'text-2xl font-light tracking-widest uppercase transition-all duration-300 ' +
                    (isActive
                      ? 'text-white pl-4 border-l-2 border-white'
                      : 'text-zinc-500 hover:text-white hover:pl-2')
                  }
                >
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-black/20 backdrop-blur-sm transition-opacity duration-500 z-[999] ${
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
