import AdminSidebar from '@/components/admin/AdminSidebar';

// ADMIN LAYOUT
export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* SIDEBAR */}
      <AdminSidebar />

      {/* MAIN CONTENT */}
      <main className="flex-1 p-10 overflow-y-auto">{children}</main>
    </div>
  );
}
