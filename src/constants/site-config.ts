import { SiteConfig } from '@prisma/client';

// SITE SETTINGS MENU CONFIGURATION
export interface SettingMenuItem {
  id: string;
  label: string;
  key: keyof SiteConfig;
}

// STATIC SETTINGS MENU LIST
export const SITE_SETTINGS_MENU: SettingMenuItem[] = [
  { id: 'about', label: 'About', key: 'showAbout' },
  { id: 'portfolio', label: 'Portfolio', key: 'showPortfolio' },
  { id: 'projects', label: 'Projects', key: 'showProjects' },
  { id: 'contacts', label: 'Contacts', key: 'showContacts' },
];
