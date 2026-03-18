import { logoutAction } from './admin/actions';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-gray-100">
      {/*Sidebar*/}
      <aside className="w-64 bg-slate-900 text-white p-6 flex flex-col">
        <h2 className="text-xl font-bold mb-8 text-blue-400">Lithium Admin</h2>
        <nav className="flex-1 space-y-2">
          <a href="/admin" className="block p-2 hover:bg-slate-800 rounded">
            Dashboard
          </a>
          <a
            href="/admin/photos"
            className="block p-2 hover:bg-slate-800 rounded"
          >
            Photos
          </a>
        </nav>
        <form action={logoutAction}>
          <button
            type="submit"
            className="w-full text-left p-2 hover:bg-red-900/50 text-red-400 transition-colors rounded"
          >
            Sign Out
          </button>
        </form>
      </aside>

      <main className="flex-1 p-10">{children}</main>
    </div>
  );
}
