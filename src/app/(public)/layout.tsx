import Burger from '@/components/layout/Burger';

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative min-h-screen bg-black">
      <Burger />
      <main>{children}</main>
    </div>
  );
}
