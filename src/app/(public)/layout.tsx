import Burger from '@/components/layout/Burger';
import SocialLinks from '@/components/layout/SocialLinks';
import { getSiteConfig } from '../(admin)/admin/settings/actions';

export const dynamic = 'force-dynamic';

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const config = await getSiteConfig();

  return (
    <div className="relative min-h-screen bg-black">
      {/* NAVIGATION */}
      <Burger config={config} />
      <SocialLinks />

      {/* CONTENT */}
      <main>{children}</main>
    </div>
  );
}
