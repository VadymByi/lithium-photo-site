import Burger from '@/components/layout/Burger';
import SocialLinks from '@/components/layout/SocialLinks';
import { getSiteConfig } from '../(admin)/admin/settings/actions';

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // FETCH SITE CONFIGURATION
  const config = await getSiteConfig();

  return (
    // MAIN LAYOUT CONTAINER
    <div className="relative min-h-screen bg-black">
      {/* NAVIGATION COMPONENTS */}
      <Burger config={config} />
      <SocialLinks />

      {/* PAGE CONTENT */}
      <main>{children}</main>
    </div>
  );
}
