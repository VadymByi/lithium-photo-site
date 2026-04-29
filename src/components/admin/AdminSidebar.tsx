'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { logoutAction } from '@/app/(admin)/admin/actions';
import { ADMIN_MENU_ITEMS } from '@/constants/admin-navigation';

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-slate-900 text-white p-6 flex flex-col shrink-0">
      {/* SIDEBAR HEADER */}
      <div className="mb-8">
        <h2 className="text-xl font-bold text-blue-400 tracking-tight">
          Lithium Admin
        </h2>
        <p className="text-[10px] text-slate-500 uppercase tracking-widest mt-1">
          Photography Portfolio
        </p>
      </div>

      {/* NAVIGATION MENU */}
      <nav className="flex-1 space-y-1">
        {ADMIN_MENU_ITEMS.map((item) => {
          const isActive =
            pathname === item.path ||
            (item.path !== '/admin' && pathname.startsWith(item.path));

          return (
            <Link
              key={item.path}
              href={item.path}
              className={`block px-3 py-2 rounded-md text-sm font-medium transition-all ${
                isActive
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20'
                  : 'hover:bg-slate-800 text-zinc-400 hover:text-white'
              }`}
            >
              {item.name}
            </Link>
          );
        })}
      </nav>

      {/* LOGOUT SECTION */}
      <form
        action={logoutAction}
        className="mt-auto pt-6 border-t border-slate-800"
      >
        <button
          type="submit"
          className="w-full group flex items-center justify-between px-3 py-2 hover:bg-red-900/20 text-red-400/80 hover:text-red-400 transition-colors rounded-md text-xs font-semibold"
        >
          <span>SIGN OUT</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4 transform group-hover:translate-x-1 transition-transform"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
            />
          </svg>
        </button>
      </form>
    </aside>
  );
}
