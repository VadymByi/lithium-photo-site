'use client';

import { usePathname } from 'next/navigation';
import { useState } from 'react';
import Link from 'next/link';
import { SiteConfig } from '@prisma/client';

interface BurgerProps {
  config: SiteConfig | null;
}

const Burger: React.FC<BurgerProps> = ({ config }) => {
  // STATE MANAGEMENT
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  // DYNAMIC LINE COLOR BASED ON CURRENT PAGE
  const isLightPage = pathname === '/about' || pathname === '/contacts';
  const currentLineColor = isLightPage ? 'bg-black' : 'bg-white';

  // FILTERED NAVIGATION ITEMS BASED ON CONFIG
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
        className="fixed top-6 left-6 md:top-10 md:left-10 z-101 flex flex-col justify-center items-center gap-1.5 cursor-pointer w-8 h-8 transition-transform active:scale-90"
        onClick={() => setMenuOpen(!menuOpen)}
      >
        <span
          className={`block h-px w-full transition-all duration-300 ease-in-out ${
            menuOpen
              ? 'rotate-45 translate-y-[7.5px] bg-white'
              : currentLineColor
          }`}
        />
        <span
          className={`block h-px w-full transition-all duration-300 ease-in-out ${
            menuOpen ? 'opacity-0' : currentLineColor
          }`}
        />
        <span
          className={`block h-px w-full transition-all duration-300 ease-in-out ${
            menuOpen
              ? '-rotate-45 -translate-y-[7.5px] bg-white'
              : currentLineColor
          }`}
        />
      </div>

      {/* SLIDE-IN MENU */}
      <nav
        className={`fixed top-0 left-0 h-full w-full md:w-80 bg-black text-white transform transition-transform duration-500 ease-[cubic-bezier(0.77,0,0.175,1)] z-100 flex flex-col p-10 pt-32 ${
          menuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* NAVIGATION LINKS */}
        <ul className="flex flex-col gap-6">
          {filteredMenuItems.map((item) => {
            const isActive = pathname === item.to;
            return (
              <li key={item.to}>
                <Link
                  href={item.to}
                  className={`text-3xl font-light tracking-tighter transition-all hover:pl-2 ${
                    isActive ? 'italic' : 'opacity-60 hover:opacity-100'
                  }`}
                  onClick={() => setMenuOpen(false)}
                >
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>

        {/* SOCIAL LINKS */}
        <div className="mt-auto border-t border-zinc-800 pt-10">
          <p className="text-[10px] uppercase tracking-[0.3em] text-zinc-500 mb-6 font-bold">
            Socials
          </p>
          <a
            href="https://www.instagram.com/lithium_cloud/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xl font-light hover:italic transition-all inline-block"
          >
            Instagram
          </a>
        </div>
      </nav>

      {/* OVERLAY BACKDROP */}
      <div
        className={`fixed inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-500 z-99 ${
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
