export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="admin-container">
      <nav>Это панель навигации админки</nav>
      <main>{children}</main>
    </div>
  );
}
