'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { logoutAction } from '@/app/(admin)/admin/actions';

export default function AdminSidebar() {
  // ROUTE STATE
  const pathname = usePathname();

  // SIDEBAR MENU CONFIGURATION
  const menuItems = [
    { name: 'Dashboard', path: '/admin' },
    { name: 'Photos', path: '/admin/photos' },
    { name: 'Main Slider', path: '/admin/slider' },
    { name: 'Menu Settings', path: '/admin/settings' },
  ];

  return (
    <aside className="w-64 bg-slate-900 text-white p-6 flex flex-col shrink-0">
      {/* SIDEBAR HEADER */}
      <h2 className="text-xl font-bold mb-8 text-blue-400 tracking-tight">
        Lithium Admin
      </h2>

      {/* NAVIGATION MENU */}
      <nav className="flex-1 space-y-1">
        {menuItems.map((item) => {
          const isActive = pathname === item.path;

          return (
            <Link
              key={item.path}
              href={item.path}
              className={`block p-2 rounded transition-colors ${
                isActive
                  ? 'bg-slate-800 text-blue-400'
                  : 'hover:bg-slate-800 text-zinc-300 hover:text-white'
              }`}
            >
              {item.name}
            </Link>
          );
        })}
      </nav>

      {/* LOGOUT ACTION */}
      <form
        action={logoutAction}
        className="mt-auto pt-6 border-t border-slate-800"
      >
        <button
          type="submit"
          className="w-full text-left p-2 hover:bg-red-900/30 text-red-400/80 hover:text-red-400 transition-colors rounded text-sm"
        >
          Sign Out
        </button>
      </form>
    </aside>
  );
}
