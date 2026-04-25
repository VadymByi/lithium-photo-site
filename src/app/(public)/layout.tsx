import Burger from '@/components/layout/Burger';
import { getSiteConfig } from '../(admin)/admin/settings/actions';

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const config = await getSiteConfig();
  return (
    <div className="relative min-h-screen bg-black">
      <Burger config={config} />
      <main>{children}</main>
    </div>
  );
}
